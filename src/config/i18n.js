export const UI_STRINGS = {
  vi: {
    spy: { title: 'Phân Tích Video Đối Thủ' },
    script: { title: 'Biên Kịch & Xây Dựng Storyboard' },
    studio: { title: 'Studio Sáng Tạo' },
    seo: { title: 'Tối Ưu SEO & Phân Phối' },
    common: { copied: 'Đã copy thành công!' },
    nav: { spy: 'Gián Điệp', script: 'Kịch Bản', studio: 'Studio', seo: 'SEO' },
    header: { config: 'Cấu Hình', keys: 'Keys' },
  },
  en: {
    spy: { title: 'Competitor Video Analysis' },
    script: { title: 'Scripting & Storyboard Builder' },
    studio: { title: 'Creative Studio' },
    seo: { title: 'SEO Optimization & Distribution' },
    common: { copied: 'Copied successfully!' },
    nav: { spy: 'Spy', script: 'Script', studio: 'Studio', seo: 'SEO' },
    header: { config: 'Config', keys: 'Keys' },
  },
};

export const SEO_CHECKLIST = {
  'Title & Thumbnail': [
    { id: 'title_keywords', label: 'Tiêu đề chứa từ khóa chính (Phật Pháp, Chữa Lành, Nhân Quả...)' },
    { id: 'title_emotion', label: 'Tiêu đề có yếu tố cảm xúc/gây tò mò' },
    { id: 'title_length', label: 'Tiêu đề dưới 60 ký tự' },
    { id: 'thumb_contrast', label: 'Thumbnail có độ tương phản cao, text rõ ràng' },
    { id: 'thumb_face', label: 'Thumbnail có khuôn mặt hoặc biểu tượng thiêng liêng' },
  ],
  'Description & Tags': [
    { id: 'desc_hook', label: 'Mô tả có hook trong 2-3 dòng đầu' },
    { id: 'desc_keywords', label: 'Mô tả chứa từ khóa tự nhiên' },
    { id: 'desc_timestamps', label: 'Có timestamps/chapters' },
    { id: 'tags_relevant', label: 'Tags phù hợp ngách Phật Pháp/Chữa Lành' },
  ],
  'Content Quality': [
    { id: 'hook_3s', label: 'Hook mạnh trong 3 giây đầu' },
    { id: 'retention', label: 'Có retention hooks mỗi 30-60 giây' },
    { id: 'cta_subscribe', label: 'Có CTA subscribe/like cuối video' },
    { id: 'end_screen', label: 'Đã thiết lập End Screen' },
  ],
  'Audio & Engagement': [
    { id: 'voice_quality', label: 'Giọng đọc chất lượng, truyền cảm' },
    { id: 'bg_music', label: 'Nhạc nền thiền định phù hợp' },
    { id: 'pinned_comment', label: 'Đã ghim comment tương tác' },
    { id: 'community', label: 'Đã đăng Community Post' },
  ],
};
