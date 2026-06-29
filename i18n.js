const translations = {
  ja: {
    app_title: "Brand Compliance Dashboard",
    app_subtitle: "ブランド基準チェック・承認システム",
    status_pending: "確認待ち",
    status_approved: "承認済",
    status_rejected: "非承認",
    btn_add_item: "新しいアイテムを追加",
    btn_export: "エクスポート",
    filter_status: "ステータス：",
    filter_store: "店舗：",
    search_placeholder: "アイテムを検索...",
    empty_title: "アイテムがありません",
    empty_sub: "「新しいアイテムを追加」ボタンでチェックを開始してください",
    label_original: "オリジナル画像",
    label_modified: "修正後画像",
    label_memo: "変更内容メモ",
    memo_placeholder: "どのような変更を施したか記入してください。\n例：\n・フォントを Helvetica Neue に変更\n・ロゴ下の余白を +20px に調整\n・背景色を #000000 に統一\n・Vibram ロゴのサイズを規定通り 30mm 以上に修正",
    memo_empty: "(メモなし)",
    btn_edit: "編集",
    btn_save: "保存",
    upload_instruction: "クリックまたはドラッグ＆ドロップで複数追加",
    upload_formats: "JPG, PNG, WebP, SVG, MP4 対応",
    upload_instruction_single: "クリックまたはドラッグ＆ドロップ",
    btn_expand: "拡大",
    btn_delete_img: "×",
    action_approval: "承認アクション：",
    btn_approve: "✓ 承認",
    btn_reject: "✕ 非承認",
    alert_delete_item: "このアイテムを削除しますか？",
    toast_deleted: "アイテムを削除しました",
    toast_select_file: "画像または動画ファイルを選択してください",
    toast_uploading: "アップロード中...",
    toast_upload_success: "アップロード完了",
    toast_upload_fail: "アップロードに失敗しました",
    toast_csv_success: "CSVをダウンロードしました",
    modal_reject_reason: "非承認理由",
    modal_reject_desc: "差し戻しの理由や、修正してほしい箇所を入力してください",
    modal_reject_placeholder: "例：ロゴのサイズが小さすぎます。規定の30mm以上に修正してください。",
    modal_cancel: "キャンセル",
    modal_confirm_reject: "非承認として送信",
    review_status_approved: "承認しました",
    review_status_rejected: "非承認にしました",
    review_reason: "理由",
    title_placeholder: "ブロック名や場所を入力...",
    tooltip_delete_item: "削除",
    tooltip_cant_move: "画像設定済みのため移動できません",
    store_barefoot: "BAREFOOT PARK",
    store_kvillage: "K VILLAGE",
    store_others: "OTHERS",
    lightbox_original: "オリジナル",
    lightbox_modified: "修正後",
    action_by: "の承認アクション",
    category_default: "BAREFOOT PARK"
  },
  en: {
    app_title: "Brand Compliance Dashboard",
    app_subtitle: "Brand Standards Check & Approval System",
    status_pending: "Pending",
    status_approved: "Approved",
    status_rejected: "Rejected",
    btn_add_item: "Add New Item",
    btn_export: "Export",
    filter_status: "Status:",
    filter_store: "Store:",
    search_placeholder: "Search items...",
    empty_title: "No items found",
    empty_sub: "Click 'Add New Item' to start checking",
    label_original: "Original Image",
    label_modified: "Modified Image",
    label_memo: "Change Notes",
    memo_placeholder: "Please describe the changes made.\nExample:\n- Changed font to Helvetica Neue\n- Adjusted padding under logo to +20px\n- Unified background color to #000000\n- Fixed Vibram logo size to 30mm+",
    memo_empty: "(No notes)",
    btn_edit: "Edit",
    btn_save: "Save",
    upload_instruction: "Click or drag & drop to add multiple",
    upload_formats: "Supports JPG, PNG, WebP, SVG, MP4",
    upload_instruction_single: "Click or drag & drop",
    btn_expand: "Expand",
    btn_delete_img: "×",
    action_approval: "Approval Action:",
    btn_approve: "✓ Approve",
    btn_reject: "✕ Reject",
    alert_delete_item: "Are you sure you want to delete this item?",
    toast_deleted: "Item deleted",
    toast_select_file: "Please select an image or video file",
    toast_uploading: "Uploading...",
    toast_upload_success: "Upload complete",
    toast_upload_fail: "Upload failed",
    toast_csv_success: "CSV downloaded",
    modal_reject_reason: "Reason for Rejection",
    modal_reject_desc: "Please provide the reason for rejection or required changes",
    modal_reject_placeholder: "Example: The logo size is too small. Please adjust to 30mm or larger.",
    modal_cancel: "Cancel",
    modal_confirm_reject: "Submit Rejection",
    review_status_approved: "Approved",
    review_status_rejected: "Rejected",
    review_reason: "Reason",
    title_placeholder: "Enter block name or location...",
    tooltip_delete_item: "Delete",
    tooltip_cant_move: "Cannot move because images are already set",
    store_barefoot: "BAREFOOT PARK",
    store_kvillage: "K VILLAGE",
    store_others: "OTHERS",
    lightbox_original: "Original",
    lightbox_modified: "Modified",
    action_by: "'s action",
    category_default: "BAREFOOT PARK"
  },
  th: {
    app_title: "Brand Compliance Dashboard",
    app_subtitle: "ระบบตรวจสอบและอนุมัติมาตรฐานแบรนด์",
    status_pending: "รอดำเนินการ",
    status_approved: "อนุมัติแล้ว",
    status_rejected: "ไม่อนุมัติ",
    btn_add_item: "เพิ่มรายการใหม่",
    btn_export: "ส่งออก",
    filter_status: "สถานะ:",
    filter_store: "ร้านค้า:",
    search_placeholder: "ค้นหารายการ...",
    empty_title: "ไม่พบรายการ",
    empty_sub: "คลิก 'เพิ่มรายการใหม่' เพื่อเริ่มการตรวจสอบ",
    label_original: "ภาพต้นฉบับ",
    label_modified: "ภาพที่แก้ไขแล้ว",
    label_memo: "บันทึกการเปลี่ยนแปลง",
    memo_placeholder: "โปรดอธิบายการเปลี่ยนแปลงที่เกิดขึ้น\nตัวอย่าง:\n- เปลี่ยนฟอนต์เป็น Helvetica Neue\n- ปรับระยะห่างใต้โลโก้ +20px\n- เปลี่ยนสีพื้นหลังเป็น #000000\n- แก้ไขขนาดโลโก้ Vibram เป็น 30mm ขึ้นไป",
    memo_empty: "(ไม่มีบันทึก)",
    btn_edit: "แก้ไข",
    btn_save: "บันทึก",
    upload_instruction: "คลิกหรือลากและวางเพื่อเพิ่มหลายไฟล์",
    upload_formats: "รองรับ JPG, PNG, WebP, SVG, MP4",
    upload_instruction_single: "คลิกหรือลากและวาง",
    btn_expand: "ขยาย",
    btn_delete_img: "×",
    action_approval: "การอนุมัติ:",
    btn_approve: "✓ อนุมัติ",
    btn_reject: "✕ ไม่อนุมัติ",
    alert_delete_item: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?",
    toast_deleted: "ลบรายการเรียบร้อยแล้ว",
    toast_select_file: "โปรดเลือกไฟล์ภาพหรือวิดีโอ",
    toast_uploading: "กำลังอัปโหลด...",
    toast_upload_success: "อัปโหลดสำเร็จ",
    toast_upload_fail: "อัปโหลดล้มเหลว",
    toast_csv_success: "ดาวน์โหลด CSV แล้ว",
    modal_reject_reason: "เหตุผลที่ไม่อนุมัติ",
    modal_reject_desc: "โปรดระบุเหตุผลที่ไม่อนุมัติหรือสิ่งที่ต้องแก้ไข",
    modal_reject_placeholder: "ตัวอย่าง: ขนาดโลโก้เล็กเกินไป โปรดปรับเป็น 30mm ขึ้นไป",
    modal_cancel: "ยกเลิก",
    modal_confirm_reject: "ยืนยันไม่อนุมัติ",
    review_status_approved: "อนุมัติแล้ว",
    review_status_rejected: "ไม่อนุมัติ",
    review_reason: "เหตุผล",
    title_placeholder: "ระบุชื่อบล็อกหรือตำแหน่ง...",
    tooltip_delete_item: "ลบ",
    tooltip_cant_move: "ไม่สามารถย้ายได้เนื่องจากมีการตั้งค่ารูปภาพแล้ว",
    store_barefoot: "BAREFOOT PARK",
    store_kvillage: "K VILLAGE",
    store_others: "OTHERS",
    lightbox_original: "ภาพต้นฉบับ",
    lightbox_modified: "ภาพที่แก้ไขแล้ว",
    action_by: " การดำเนินการ",
    category_default: "BAREFOOT PARK"
  }
};

let currentLanguage = localStorage.getItem('appLanguage') || 'ja';

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  localStorage.setItem('appLanguage', lang);
  applyTranslations();
  
  // Custom event to notify other scripts that language changed (so they can re-render)
  window.dispatchEvent(new Event('languageChanged'));
}

function t(key) {
  return translations[currentLanguage][key] || translations['ja'][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    
    if (el.tagName === 'INPUT' && el.type === 'text') {
      if (el.classList.contains('filter-search')) {
        el.placeholder = t(key);
      } else {
        el.value = t(key);
      }
    } else {
      el.textContent = t(key);
    }
  });

  // Update active states on language buttons
  document.querySelectorAll('.lang-selector-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === currentLanguage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Initial apply
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
});
