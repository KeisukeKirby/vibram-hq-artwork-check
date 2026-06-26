/* ============================================================
   Vibram Brand Compliance Dashboard — app.js
   ============================================================ */

'use strict';

// ── STATE ─────────────────────────────────────────────────────
let state = {
  items: [],
  currentReviewer: 'CEO',
  filterStatus: 'pending',
  filterCategory: 'BAREFOOT PARK',
  searchQuery: '',
  nextId: 1,
  brandGuidePdf1: null,
  brandGuidePdf2: null,
  brandGuidePdf3: null,
};

// ── INIT ──────────────────────────────────────────────────────
let sortableInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadFromStorage();
  if (state.items.length === 0) {
    // Start with one empty item
    addItem();
  } else {
    renderAll();
  }
  updateStats();
  initSortable();
});

function initSortable() {
  const container = document.getElementById('itemsContainer');
  if (typeof Sortable !== 'undefined') {
    sortableInstance = new Sortable(container, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      onEnd: function (evt) {
        const newOrderIds = Array.from(container.children).map(el => parseInt(el.dataset.id));
        const newItems = [];
        newOrderIds.forEach(id => {
          const item = state.items.find(i => i.id === id);
          if (item) newItems.push(item);
        });
        state.items = newItems;
        saveToStorage();
        updateCardNumbers();
      }
    });
  }
}

function updateCardNumbers() {
  const cards = document.querySelectorAll('.item-card');
  cards.forEach((card, idx) => {
    const numEl = card.querySelector('.card-number');
    if (numEl) {
      numEl.textContent = String(cards.length - idx).padStart(2, '0');
    }
  });
}

// ── STORAGE ───────────────────────────────────────────────────
const DB_NAME = 'vibram_brand_check_db';
const STORE_NAME = 'state_store';

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToStorage() {
  const toSave = {
    items: state.items.map(item => ({
      ...item,
      originalImage: item.originalImage || null,
      modifiedImage: item.modifiedImage || null,
    })),
    currentReviewer: state.currentReviewer,
    nextId: state.nextId,
    brandGuidePdf1: state.brandGuidePdf1,
    brandGuidePdf2: state.brandGuidePdf2,
    brandGuidePdf3: state.brandGuidePdf3,
  };
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(toSave, 'appState');
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch(e) {
    console.error('Failed to save to IndexedDB', e);
  }
}

async function loadFromStorage() {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const request = tx.objectStore(STORE_NAME).get('appState');
    let data = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!data) {
      const raw = localStorage.getItem('vibram_brand_check');
      if (raw) {
        data = JSON.parse(raw);
        tx.objectStore(STORE_NAME).put(data, 'appState');
      }
    }

    if (data) {
      state.items = data.items || [];
      // Default category for existing items
      state.items.forEach(item => {
        if (!item.category) item.category = 'OTHERS';
      });
      state.currentReviewer = data.currentReviewer || 'CEO';
      state.nextId = data.nextId || (state.items.length + 1);
      state.brandGuidePdf1 = data.brandGuidePdf1 || null;
      state.brandGuidePdf2 = data.brandGuidePdf2 || null;
      state.brandGuidePdf3 = data.brandGuidePdf3 || null;
    }
  } catch(e) {
    console.error('Failed to load from IndexedDB', e);
    state.items = [];
  }
}

// ── ITEM FACTORY ──────────────────────────────────────────────
function createItem() {
  return {
    id: state.nextId++,
    category: state.filterCategory || 'BAREFOOT PARK',
    title: '',
    originalImage: null,
    modifiedImage: null,
    memo: '',
    isMemoEditing: true,
    status: 'pending',    // pending | approved | rejected
    reviews: [],          // [{reviewer, status, comment, timestamp}]
    rejectionComment: '',
    createdAt: Date.now(),
  };
}

// ── REVIEWER ──────────────────────────────────────────────────
function selectReviewer(name, btn) {
  state.currentReviewer = name;
  document.querySelectorAll('.reviewer-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  saveToStorage();
}

// ── ADD / DELETE ──────────────────────────────────────────────
function addItem() {
  const item = createItem();
  state.items.unshift(item);   // newest first
  saveToStorage();
  renderAll();
  updateStats();

  // Scroll to top
  setTimeout(() => {
    const firstCard = document.querySelector('.item-card');
    if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 50);
}

function deleteItem(id) {
  if (!confirm('このアイテムを削除しますか？')) return;
  state.items = state.items.filter(i => i.id !== id);
  saveToStorage();
  renderAll();
  updateStats();
  showToast('アイテムを削除しました', 'neutral');
}

// ── FILTER / SEARCH ───────────────────────────────────────────
function filterItems(status, btn) {
  state.filterStatus = status;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
}

function searchItems(query) {
  state.searchQuery = query.toLowerCase();
  applyFilter();
}

function filterByCategory(cat, btn) {
  state.filterCategory = cat;
  document.querySelectorAll('.filter-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilter();
}

function applyFilter() {
  const cards = document.querySelectorAll('.item-card');
  cards.forEach(card => {
    const id = parseInt(card.dataset.id);
    const item = state.items.find(i => i.id === id);
    if (!item) return;

    const matchStatus = item.status === state.filterStatus;
    const matchCategory = item.category === state.filterCategory;
    const matchSearch = !state.searchQuery ||
      (item.title || '').toLowerCase().includes(state.searchQuery) ||
      (item.memo  || '').toLowerCase().includes(state.searchQuery);

    card.style.display = (matchStatus && matchCategory && matchSearch) ? '' : 'none';
  });

  const isFiltered = state.searchQuery !== '';
  if (sortableInstance) {
    sortableInstance.option('disabled', isFiltered);
  }

  // Show/hide empty state
  const visible = Array.from(cards).filter(c => c.style.display !== 'none');
  document.getElementById('emptyState').style.display =
    (visible.length === 0) ? 'block' : 'none';
}

// ── APPROVAL / CATEGORY ───────────────────────────────────────
function updateCategory(id, cat) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;
  item.category = cat;
  saveToStorage();
  
  // Update visually without full re-render
  const card = document.querySelector(`.item-card[data-id="${id}"]`);
  if (card) {
    card.querySelectorAll('.cat-sel-btn').forEach(b => b.classList.remove('active'));
    card.querySelector(`.cat-sel-btn[data-cat="${cat}"]`)?.classList.add('active');
  }
  applyFilter(); // Might hide the card if filter is active
}

function approveItem(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  const existingReview = item.reviews.find(r => r.reviewer === state.currentReviewer);

  // Remove existing review from this reviewer
  item.reviews = item.reviews.filter(r => r.reviewer !== state.currentReviewer);

  if (existingReview && existingReview.status === 'approved') {
    showToast(`🔄 ${state.currentReviewer} の承認を取り消しました`, 'neutral');
  } else {
    item.reviews.push({
      reviewer: state.currentReviewer,
      status: 'approved',
      comment: '',
      timestamp: Date.now(),
    });
    showToast(`✅ ${state.currentReviewer} が承認しました`, 'approve');
  }

  recalcStatus(item);
  saveToStorage();
  updateCardApproval(id);
  updateStats();
}

function rejectItem(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  const existingReview = item.reviews.find(r => r.reviewer === state.currentReviewer);

  item.reviews = item.reviews.filter(r => r.reviewer !== state.currentReviewer);

  const block = document.querySelector(`[data-id="${id}"] .rejection-comment-block`);

  if (existingReview && existingReview.status === 'rejected') {
    showToast(`🔄 ${state.currentReviewer} の非承認を取り消しました`, 'neutral');
    if (block) block.classList.remove('visible');
  } else {
    item.reviews.push({
      reviewer: state.currentReviewer,
      status: 'rejected',
      comment: '',
      timestamp: Date.now(),
    });
    showToast(`❌ ${state.currentReviewer} が非承認にしました`, 'reject');
    if (block) block.classList.add('visible');
  }

  recalcStatus(item);
  saveToStorage();
  updateCardApproval(id);
  updateStats();
}

function recalcStatus(item) {
  if (item.reviews.length === 0) { item.status = 'pending'; return; }
  const hasRejection = item.reviews.some(r => r.status === 'rejected');
  item.status = hasRejection ? 'rejected' : 'approved';
}

function updateRejectionComment(id, comment) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;
  const myReview = item.reviews.find(r => r.reviewer === state.currentReviewer);
  if (myReview) myReview.comment = comment;
  saveToStorage();
}

// ── UPDATE CARD APPROVAL UI (without full re-render) ──────────
function updateCardApproval(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  const item = state.items.find(i => i.id === id);
  if (!card || !item) return;

  // Badge
  const badge = card.querySelector('.card-status-badge');
  badge.className = `card-status-badge badge-${item.status}`;
  badge.textContent = statusLabel(item.status);

  // Card border
  card.className = `item-card status-${item.status}`;
  card.dataset.id = id;

  // Approval buttons state
  const myReview = item.reviews.find(r => r.reviewer === state.currentReviewer);
  const btnApprove = card.querySelector('.btn-approve');
  const btnReject  = card.querySelector('.btn-reject');
  btnApprove.classList.toggle('active', myReview?.status === 'approved');
  btnReject.classList.toggle('active',  myReview?.status === 'rejected');

  // Review chips
  const chipsContainer = card.querySelector('.approval-reviews');
  chipsContainer.innerHTML = renderChips(item);
}

// ── TITLE / MEMO UPDATES ──────────────────────────────────────
function updateTitle(id, value) {
  const item = state.items.find(i => i.id === id);
  if (item) { item.title = value; saveToStorage(); }
}

function updateMemo(id, value) {
  const item = state.items.find(i => i.id === id);
  if (item) { item.memo = value; saveToStorage(); }
}

function toggleMemoEdit(id, isEditing) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  item.isMemoEditing = isEditing;
  saveToStorage();

  const textarea = document.getElementById(`memo-input-${id}`);
  const display = document.getElementById(`memo-display-${id}`);
  const btnEdit = document.getElementById(`btn-memo-edit-${id}`);
  const btnSave = document.getElementById(`btn-memo-save-${id}`);

  if (isEditing) {
    textarea.style.display = 'block';
    display.style.display = 'none';
    btnEdit.style.display = 'none';
    btnSave.style.display = 'inline-block';
    textarea.focus();
  } else {
    textarea.style.display = 'none';
    display.innerHTML = escHtml(item.memo) || '<span style="color:#aaa;">(メモなし)</span>';
    display.style.display = 'block';
    btnEdit.style.display = 'inline-block';
    btnSave.style.display = 'none';
  }
}

// ── IMAGE UPLOAD ──────────────────────────────────────────────
function handleFileSelect(id, field, file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('画像ファイルを選択してください', 'neutral');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const item = state.items.find(i => i.id === id);
    if (item) {
      item[field] = e.target.result;
      saveToStorage();
      refreshUploadArea(id, field, e.target.result);
    }
  };
  reader.readAsDataURL(file);
}

function clearImage(id, field) {
  const item = state.items.find(i => i.id === id);
  if (item) {
    item[field] = null;
    saveToStorage();
    refreshUploadArea(id, field, null);
  }
}

function refreshUploadArea(id, field, src) {
  const area = document.querySelector(`[data-id="${id}"] [data-field="${field}"]`);
  if (!area) return;

  const placeholder = area.querySelector('.upload-placeholder');
  const preview     = area.querySelector('.upload-preview');

  if (src) {
    preview.src = src;
    area.classList.add('has-image');
    if (placeholder) placeholder.style.display = 'none';
    preview.style.display = 'block';
  } else {
    area.classList.remove('has-image');
    if (placeholder) placeholder.style.display = '';
    preview.src = '';
    preview.style.display = 'none';
  }
}

// ── DRAG AND DROP ─────────────────────────────────────────────
function setupDropZone(area, id, field) {
  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    area.classList.add('drag-over');
  });
  area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFileSelect(id, field, file);
  });
}

// ── LIGHTBOX ──────────────────────────────────────────────────
function openLightboxById(id, field, label) {
  const item = state.items.find(i => i.id === id);
  if (item && item[field]) {
    openLightbox(item[field], label);
  }
}

function openLightbox(src, caption) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = caption;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ── PDF UPLOAD MODAL ──────────────────────────────────────────

function openPdfModal() {
  document.getElementById('pdfModal').classList.add('open');
}

function closePdfModal() {
  document.getElementById('pdfModal').classList.remove('open');
}

// Removed dynamic PDF upload logic

// ── STATS ─────────────────────────────────────────────────────
function updateStats() {
  const counts = { pending: 0, approved: 0, rejected: 0 };
  state.items.forEach(i => counts[i.status]++);
  document.getElementById('countPending').textContent  = counts.pending;
  document.getElementById('countApproved').textContent = counts.approved;
  document.getElementById('countRejected').textContent = counts.rejected;
}

// ── EXPORT ────────────────────────────────────────────────────
function exportData() {
  const rows = [
    ['#', 'タイトル', 'ステータス', '承認者', '非承認理由', '作成日時']
  ];
  state.items.forEach((item, i) => {
    const approved = item.reviews.filter(r => r.status === 'approved').map(r => r.reviewer).join(', ');
    const rejected = item.reviews.filter(r => r.status === 'rejected');
    const rejectedNames = rejected.map(r => r.reviewer).join(', ');
    const rejectedComments = rejected.map(r => r.comment).filter(Boolean).join(' / ');
    rows.push([
      i + 1,
      item.title || `アイテム ${item.id}`,
      statusLabel(item.status),
      approved,
      rejectedComments ? `${rejectedNames}: ${rejectedComments}` : rejectedNames,
      new Date(item.createdAt).toLocaleString('ja-JP'),
    ]);
  });

  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vibram_brand_check_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSVをダウンロードしました', 'neutral');
}

// ── TOAST ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'neutral') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show toast-${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── HELPERS ───────────────────────────────────────────────────
function statusLabel(s) {
  return { pending: '確認待ち', approved: '承認済', rejected: '非承認' }[s] || s;
}

function renderChips(item) {
  return item.reviews.map(r => {
    const cls = r.status === 'approved' ? 'chip-approved' : 'chip-rejected';
    const icon = r.status === 'approved' ? '✓' : '✕';
    const name = r.reviewer.length > 12 ? r.reviewer.slice(0, 12) + '…' : r.reviewer;
    return `<span class="review-chip ${cls}">${icon} ${name}</span>`;
  }).join('');
}

// ── RENDER ────────────────────────────────────────────────────
function renderAll() {
  const container = document.getElementById('itemsContainer');
  container.innerHTML = '';

  if (state.items.length === 0) {
    document.getElementById('emptyState').style.display = 'block';
    return;
  }
  document.getElementById('emptyState').style.display = 'none';

  state.items.forEach((item, idx) => {
    const el = renderItem(item, state.items.length - idx);
    container.appendChild(el);
  });

  // Re-apply filter
  applyFilter();
}

function renderItem(item, displayNum) {
  const myReview = item.reviews.find(r => r.reviewer === state.currentReviewer);
  const isRejected = item.status === 'rejected';
  const hasMyRejection = myReview?.status === 'rejected';
  const isEditing = item.isMemoEditing !== undefined ? item.isMemoEditing : (item.memo ? false : true);

  const div = document.createElement('div');
  div.className = `item-card status-${item.status}`;
  div.dataset.id = item.id;

  div.innerHTML = `
    <!-- Card Header -->
    <div class="card-header">
      <div class="drag-handle" title="ドラッグして並べ替え" style="cursor: grab; padding: 4px; margin-right: 4px; display: flex; align-items: center; color: var(--text-muted); opacity: 0.6;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </div>
      <div class="card-number">${String(displayNum).padStart(2, '0')}</div>
      <input
        class="card-title-input"
        type="text"
        placeholder="ブロック名や場所を入力..."
        value="${escHtml(item.title || '')}"
        oninput="updateTitle(${item.id}, this.value)"
        id="title-${item.id}"
      />
      <div class="card-category-selector">
        <button class="cat-sel-btn ${item.category === 'BAREFOOT PARK' ? 'active' : ''}" data-cat="BAREFOOT PARK" onclick="updateCategory(${item.id}, 'BAREFOOT PARK')">BAREFOOT</button>
        <button class="cat-sel-btn ${item.category === 'K VILLAGE' ? 'active' : ''}" data-cat="K VILLAGE" onclick="updateCategory(${item.id}, 'K VILLAGE')">K VILLAGE</button>
        <button class="cat-sel-btn ${item.category === 'OTHERS' ? 'active' : ''}" data-cat="OTHERS" onclick="updateCategory(${item.id}, 'OTHERS')">OTHERS</button>
      </div>
      <span class="card-status-badge badge-${item.status}">${statusLabel(item.status)}</span>
      <button class="card-delete-btn" onclick="deleteItem(${item.id})" title="削除">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>

    <!-- Card Body: 3 columns -->
    <div class="card-body">

      <!-- Original Image -->
      <div class="image-zone">
        <div class="image-zone-label">
          <span class="label-dot label-dot-original"></span>
          オリジナル画像
        </div>
        ${renderUploadArea(item, 'originalImage', 'オリジナル')}
      </div>

      <!-- Modified Image -->
      <div class="image-zone">
        <div class="image-zone-label">
          <span class="label-dot label-dot-modified"></span>
          修正後画像
        </div>
        ${renderUploadArea(item, 'modifiedImage', '修正後')}
      </div>

      <!-- Memo -->
      <div class="image-zone memo-zone">
        <div class="image-zone-label" style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span class="label-dot label-dot-memo"></span>
            変更内容メモ
          </div>
          <div>
            <button class="btn-memo-action" id="btn-memo-edit-${item.id}" onclick="toggleMemoEdit(${item.id}, true)" style="display: ${isEditing ? 'none' : 'inline-block'}; padding: 4px 12px; font-size: 12px; border-radius: 4px; border: 1px solid #ccc; background: #fff; cursor: pointer; color: #333;">編集</button>
            <button class="btn-memo-action" id="btn-memo-save-${item.id}" onclick="toggleMemoEdit(${item.id}, false)" style="display: ${isEditing ? 'inline-block' : 'none'}; padding: 4px 12px; font-size: 12px; border-radius: 4px; border: none; background: #222; color: #fff; cursor: pointer;">保存</button>
          </div>
        </div>
        <div id="memo-display-${item.id}" style="display: ${isEditing ? 'none' : 'block'}; white-space: pre-wrap; padding: 12px; background: #f9f9f9; border-radius: 6px; font-size: 13px; min-height: 80px; color: #333; margin-top: 10px; border: 1px solid #eee; word-break: break-word; line-height: 1.5;">${escHtml(item.memo) || '<span style="color:#aaa;">(メモなし)</span>'}</div>
        <textarea
          class="memo-textarea"
          placeholder="どのような変更を施したか記入してください。&#10;例：&#10;・フォントを Helvetica Neue に変更&#10;・ロゴ下の余白を +20px に調整&#10;・背景色を #000000 に統一&#10;・Vibram ロゴのサイズを規定通り 30mm 以上に修正"
          oninput="updateMemo(${item.id}, this.value)"
          id="memo-input-${item.id}"
          style="display: ${isEditing ? 'block' : 'none'}; margin-top: 10px;"
        >${escHtml(item.memo)}</textarea>
      </div>
    </div>

    <!-- Approval Row -->
    <div class="approval-section">
      <div class="approval-inner">
        <div class="approval-label">承認アクション：</div>
        <div class="approval-buttons">
          <button
            class="btn-approve btn ${myReview?.status === 'approved' ? 'active' : ''}"
            onclick="approveItem(${item.id})"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            承認
          </button>
          <button
            class="btn-reject btn ${myReview?.status === 'rejected' ? 'active' : ''}"
            onclick="rejectItem(${item.id})"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            非承認
          </button>
        </div>
        <div class="approval-reviews" id="chips-${item.id}">
          ${renderChips(item)}
        </div>
      </div>
    </div>

    <!-- Rejection Comment -->
    <div class="rejection-comment-block ${hasMyRejection ? 'visible' : ''}" id="rejection-block-${item.id}">
      <div class="rejection-comment-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        非承認コメント（${state.currentReviewer}）
      </div>
      <textarea
        class="rejection-comment-input"
        placeholder="非承認の理由・修正指示を入力してください…"
        oninput="updateRejectionComment(${item.id}, this.value)"
        id="rejection-comment-${item.id}"
      >${escHtml(myReview?.comment || '')}</textarea>
    </div>
  `;

  // Setup drag & drop after inserting into DOM
  requestAnimationFrame(() => {
    ['originalImage', 'modifiedImage'].forEach(field => {
      const area = div.querySelector(`[data-field="${field}"]`);
      if (area) setupDropZone(area, item.id, field);
    });
  });

  return div;
}

function renderUploadArea(item, field, label) {
  const hasSrc = !!item[field];
  return `
    <div
      class="upload-area ${hasSrc ? 'has-image' : ''}"
      data-field="${field}"
      onclick="triggerUpload(event, ${item.id}, '${field}')"
    >
      <input
        type="file"
        class="upload-input"
        accept="image/*"
        id="file-${item.id}-${field}"
        onchange="handleFileSelect(${item.id}, '${field}', this.files[0])"
      />
      <div class="upload-placeholder" style="display:${hasSrc ? 'none' : 'flex'};">
        <div class="upload-icon">🖼️</div>
        <div class="upload-text-main">クリックまたはドラッグ&amp;ドロップ</div>
        <div class="upload-text-sub">JPG, PNG, WebP, SVG 対応</div>
      </div>
      <img
        class="upload-preview"
        src="${hasSrc ? escHtml(item[field]) : ''}"
        alt="${label}"
        style="display:${hasSrc ? 'block' : 'none'};"
        onclick="event.stopPropagation(); openLightboxById(${item.id}, '${field}', '${label}')"
      />
      <div class="upload-overlay">
        <button class="upload-overlay-btn" onclick="event.stopPropagation(); openLightboxById(${item.id}, '${field}', '${label}')">拡大</button>
        <button class="upload-overlay-btn" onclick="event.stopPropagation(); triggerUpload(event, ${item.id}, '${field}')">画像を変更</button>
        <button class="upload-overlay-btn danger" onclick="event.stopPropagation(); clearImage(${item.id}, '${field}')">削除</button>
      </div>
    </div>
  `;
}

function triggerUpload(event, id, field) {
  event.stopPropagation();
  const input = document.getElementById(`file-${id}-${field}`);
  if (input) input.click();
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
