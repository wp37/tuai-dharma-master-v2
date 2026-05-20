# 🏗️ TUAI DHARMA MASTER V2 — Project Blueprint

> **Mục đích**: Tài liệu giải mã toàn bộ cấu trúc dự án, cho phép clone sang bất kỳ niche nào (Motivation, Education, Health, Business...) chỉ cần thay đổi config.

---

## 📁 Cấu Trúc Thư Mục

```
phatphap/
├── index.html                    # Entry point - CDN Tailwind + FontAwesome
├── package.json                  # Dependencies: React 19, Vite
├── vite.config.js                # Vite + React plugin
│
├── src/
│   ├── main.jsx                  # React root mount
│   ├── index.css                 # Global CSS: scrollbar, animations
│   ├── App.jsx                   # ★ TRUNG TÂM: Tab routing + State
│   │
│   ├── components/               # ── UI Components (Tái sử dụng) ──
│   │   ├── Header.jsx            # Logo, Language toggle, Key count
│   │   ├── Sidebar.jsx           # 4-tab navigation
│   │   ├── ConfigModal.jsx       # API Key CRUD modal
│   │   └── SceneCard.jsx         # Scene display (visual + voice + profile)
│   │
│   ├── modules/                  # ── Feature Modules (Nghiệp vụ chính) ──
│   │   ├── SpyModule.jsx         # Tab 1: YouTube competitor analysis
│   │   ├── ScriptModule.jsx      # Tab 2: AI script generator
│   │   ├── StudioModule.jsx      # Tab 3: Prompt viewer + Image gen
│   │   └── SEOModule.jsx         # Tab 4: SEO optimization suite
│   │
│   ├── config/                   # ── Cấu hình (THAY ĐỔI KHI CLONE) ──
│   │   ├── markets.js            # Target markets / languages
│   │   ├── styles.js             # Visual styles + Topics + Suggestions
│   │   ├── prompts.js            # AI system prompts (SPY, SEO, STYLE, AUDIO)
│   │   └── i18n.js               # UI strings (VI/EN) + SEO Checklist
│   │
│   └── utils/                    # ── Tiện ích (KHÔNG CẦN THAY ĐỔI) ──
│       ├── api.js                # Gemini AI + YouTube + Imagen APIs
│       ├── storage.js            # localStorage key management
│       └── toast.js              # Toast notification system
```

---

## 🧬 GIẢI MÃ TỪNG FILE

---

### 1. `index.html` — Entry Point

**Vai trò**: Tải CDN, định nghĩa design tokens, mount React app.

```
Tailwind CDN → Custom config (colors, fonts, animations)
FontAwesome CDN → Icons
Google Fonts (Inter) → Typography
<div id="root"> → React mount point
```

**Khi clone**: Thay đổi `<title>`, `<meta>`, `theme-color`, font family nếu cần.

---

### 2. `src/App.jsx` — Trung Tâm Điều Khiển

**Vai trò**: Quản lý state toàn cục + tab routing bằng `display:none`.

```
State chính:
├── tab          → 'spy' | 'script' | 'studio' | 'seo'
├── uiLang       → 'vi' | 'en'
├── segments[]   → Mảng scene từ ScriptModule
├── topic        → Chủ đề hiện tại
└── configOpen   → Mở/đóng ConfigModal

Luồng dữ liệu:
SpyModule → (onUseStrategy) → setTopic → ScriptModule
ScriptModule → (onScriptGenerated) → setSegments → StudioModule
ScriptModule → (onAudioRefined) → setSegments (cập nhật)
```

**Pattern `display:none`**: Tất cả 4 module render cùng lúc, chỉ ẩn/hiện bằng CSS. Giữ state khi chuyển tab — KHÔNG unmount.

**Khi clone**: Thêm/bớt tab, thay đổi luồng dữ liệu.

---

### 3. `src/components/Header.jsx` — Thanh Header

**Vai trò**: Hiển thị branding, nút chuyển ngôn ngữ, nút mở Config.

```
┌──────────────────────────────────────────┐
│ [OM] TUAI DHARMA MASTER [V2]  | VI | 🔑 │
│       AI Healing Content Suite           │
└──────────────────────────────────────────┘
```

**Khi clone**: Thay tên app, icon, tagline.

---

### 4. `src/components/Sidebar.jsx` — Navigation

**Vai trò**: 4 tab dọc (desktop) / ngang (mobile).

```
TABS = [
  { id, icon, num, label_vi, sub_vi, label_en, sub_en, color }
]
```

**Logic**:
- `isActive` → highlight tab hiện tại
- `isDisabled` → Studio bị khóa khi chưa có script data
- Responsive: icon-only trên mobile, full label trên desktop

**Khi clone**: Thay tên tab, icon, màu sắc, thêm/bớt tab.

---

### 5. `src/components/ConfigModal.jsx` — API Key Manager

**Vai trò**: CRUD cho Gemini API keys trong localStorage.

```
Tính năng:
├── Thêm key (validate prefix 'AIza')
├── Xóa key
├── Hiển thị danh sách (masked: AIzaSy...VYk)
└── Round-robin khi có nhiều key
```

**Khi clone**: KHÔNG cần thay đổi. Universal cho mọi project dùng Gemini.

---

### 6. `src/components/SceneCard.jsx` — Scene Display

**Vai trò**: Hiển thị 1 phân cảnh với visual + voice + profile.

```
┌─────────┬──────────────┬───────────────┐
│ SCENE 1 │ 👁 VISUAL    │ 🎤 VOICE      │
│ 00:00   │ Mô tả hình   │ Dialogue      │
│ HOOK    │ Pacing: 8/10 │ Voice Profile │
│         │ SFX/Music    │ Words: 39     │
└─────────┴──────────────┴───────────────┘
```

**Khi clone**: Có thể thêm field mới (subtitle, camera angle...).

---

### 7. `src/modules/SpyModule.jsx` — Tab 1: Trend Scout

**Vai trò**: Phân tích video YouTube competitor.

```
Input:  YouTube URL
Process: fetchYouTubeData() → callGemini(SPY_PROMPT)
Output: {
  revenue_analysis  → CPM, RPM, Earnings, Tier
  strengths[]       → Point, Impact, Evidence
  weaknesses[]      → Point, Impact, Fix
  audio_strategy    → Voice, Music, SFX, Hooks
  viral_suggestions → Hook titles + outlines
}
```

**Khi clone**: Thay SPY_PROMPT cho niche mới (Education, Tech, Business...).

---

### 8. `src/modules/ScriptModule.jsx` — Tab 2: Story Weaver ★ CORE

**Vai trò**: Tạo kịch bản AI với style selection, market targeting.

```
Inputs:
├── topic         → Chủ đề tự do
├── durationStr   → Thời lượng (phút) - text input natural
├── market        → Thị trường mục tiêu
├── dharmaTopic   → Phân ngách nội dung
└── style         → Phong cách visual (10 styles + auto)

Process:
1. Build prompt with topic + duration + market + style + seed
2. callGemini(prompt, SCRIPT_SYSTEM_PROMPT)
3. Post-process: inject style prompt_enforce
4. Display scenes via SceneCard

Outputs:
├── segments[]    → Mảng scene objects
├── scriptMeta    → Metadata từ AI
└── Pass to → StudioModule, SEOModule

Tính năng phụ:
├── AI Style Suggest → callGemini(STYLE_SUGGEST_PROMPT)
├── Audio Refine V16 → callGemini(AUDIO_REFINE_PROMPT)
├── Open Project     → Import .json
└── Copy Voice All   → Clipboard
```

**Công thức tính**:
- `sceneCount = ceil(duration * 60 / 8)` — mỗi scene 8 giây
- `wordCount = duration * 130~140` — tùy độ dài

**Khi clone**: Thay SCRIPT_SYSTEM_PROMPT, visual styles, topics.

---

### 9. `src/modules/StudioModule.jsx` — Tab 3: Dharma Studio

**Vai trò**: Xem prompt + tạo ảnh AI + xuất file.

```
Modes: VIDEO (16:9) | IMAGE (1:1)

Tính năng:
├── Xem prompt từng scene
├── Copy prompt → clipboard
├── Generate Image → Imagen 3.0 API
├── Export JSON (project file)
└── Export CSV (script data)
```

**Khi clone**: Thay watermark text, thêm format export.

---

### 10. `src/modules/SEOModule.jsx` — Tab 4: Viral SEO

**Vai trò**: Tối ưu SEO cho YouTube video.

```
Input:  Topic + Market
Output: {
  keywords      → Primary, Secondary, Long-tail
  hashtags      → Platform-optimized
  viral_titles  → CTR-optimized titles
  description   → Full video description
  thumbnail_suggestions → AI image prompts
  engagement_comments   → Pin comment, CTA
}

Tính năng phụ:
├── SEO Checklist    → Tick-off verification
├── Thumbnail Gen    → Imagen 3.0
├── Copy individual  → Clipboard
└── Export TXT       → Full SEO package
```

**Khi clone**: Thay SEO_PROMPT, checklist items.

---

### 11. `src/config/markets.js` — Thị Trường

```javascript
{ id, name, flag, voice_lang, culture }
// 9 markets: VN (x2), US, UK, TH, JP, KR, IN, CN
```

**Khi clone**: Thay markets phù hợp niche. VD: Education → thêm markets giáo dục.

---

### 12. `src/config/styles.js` — Visual Styles + Topics

```javascript
VISUAL_STYLES = [{ id, name, desc, prompt_enforce }]  // 10 styles
DHARMA_TOPICS = [{ id, label }]                       // 5 topics
TOPIC_SUGGESTIONS = { topic_id: [suggestions...] }    // Micro-context
```

**Khi clone**: ĐÂY LÀ FILE QUAN TRỌNG NHẤT. Thay toàn bộ styles/topics cho niche mới.

---

### 13. `src/config/prompts.js` — AI Prompts

```javascript
SPY_PROMPT           → Phân tích competitor
SEO_PROMPT           → Tối ưu SEO
STYLE_SUGGEST_PROMPT → AI đề xuất style
AUDIO_REFINE_PROMPT  → Tinh chỉnh thanh âm V16.0
```

**Khi clone**: Thay toàn bộ prompts cho niche mới. Giữ format JSON output.

---

### 14. `src/config/i18n.js` — Đa Ngôn Ngữ

```javascript
UI_STRINGS = {
  vi: { spy: {...}, script: {...}, seo: {...}, common: {...} },
  en: { spy: {...}, script: {...}, seo: {...}, common: {...} }
}
SEO_CHECKLIST = { category: [{ id, label }] }
```

**Khi clone**: Thay label text, checklist items.

---

### 15. `src/utils/api.js` — API Layer (UNIVERSAL)

```javascript
callGemini(prompt, systemInstruction)
  → POST generativelanguage.googleapis.com
  → Model: gemini-2.5-flash
  → Auto-parse JSON from response
  → Round-robin key selection

fetchYouTubeData(url)
  → Try: youtube.googleapis.com (with API key)
  → Fallback: noembed.com (no key needed)

generateImage(prompt, aspectRatio)
  → POST imagen-3.0-generate-002
  → Returns base64 → blob URL
```

**Khi clone**: KHÔNG CẦN THAY ĐỔI. Universal cho mọi project.

---

### 16. `src/utils/storage.js` — Key Storage (UNIVERSAL)

```javascript
STORAGE_KEY = 'TUAI_DHARMA_MASTER_V2_KEYS'  // Thay khi clone
getKeys() / addKey(k) / removeKey(k)
getKeyCount() / hasKeys() / getNextKey()     // Round-robin
```

**Khi clone**: Chỉ thay `STORAGE_KEY` string.

---

### 17. `src/utils/toast.js` — Notifications (UNIVERSAL)

```javascript
showToast(message, type)  // type: 'info' | 'success' | 'error'
// Auto-dismiss after 3s, stacking support
```

**Khi clone**: KHÔNG CẦN THAY ĐỔI.

---

## 🔄 CLONE CHECKLIST

Khi muốn clone sang niche mới, thay đổi theo thứ tự:

| # | File | Thay đổi gì | Mức độ |
|---|------|-------------|--------|
| 1 | `config/styles.js` | Visual styles, topics, suggestions | 🔴 BẮT BUỘC |
| 2 | `config/prompts.js` | Tất cả AI prompts | 🔴 BẮT BUỘC |
| 3 | `config/i18n.js` | UI labels, checklist | 🟡 NÊN LÀM |
| 4 | `config/markets.js` | Target markets | 🟡 NÊN LÀM |
| 5 | `components/Header.jsx` | App name, tagline | 🟡 NÊN LÀM |
| 6 | `components/Sidebar.jsx` | Tab names, icons | 🟡 NÊN LÀM |
| 7 | `index.html` | Title, meta, colors | 🟡 NÊN LÀM |
| 8 | `utils/storage.js` | STORAGE_KEY string | 🟢 NHỎ |
| 9 | `modules/StudioModule.jsx` | Watermark text | 🟢 NHỎ |
| 10 | `package.json` | Package name | 🟢 NHỎ |

**KHÔNG cần thay đổi**: `api.js`, `toast.js`, `App.jsx` (cấu trúc), `ConfigModal.jsx`, `SceneCard.jsx`

---

## 🚀 Quick Start

```bash
# 1. Clone thư mục
cp -r phatphap/ new-project/

# 2. Cài dependencies
cd new-project && npm install

# 3. Chạy dev server
npm run dev
# → http://localhost:5173/

# 4. Build production
npm run build
# → dist/ folder ready for deploy
```

---

## 🚀 Deploy to GitHub + Vercel

```powershell
# 1. Init git và commit
git init
git add -A
git commit -m "Initial release"

# 2. Tạo repo GitHub và push (cần gh CLI)
gh repo create <tên-repo> --public --source=. --push

# 3. Deploy lên Vercel (auto-detect Vite)
npx -y vercel --yes --prod

# 4. Sau khi thay đổi code → push update
git add -A
git commit -m "Update: mô tả thay đổi"
git push origin master
# Vercel tự động re-deploy khi push GitHub ✅
```

### Live URLs (hiện tại)
- **GitHub**: https://github.com/wp37/tuai-dharma-master-v2
- **Vercel**: https://phatphap-six.vercel.app
- **Local**: http://localhost:5173/

---

## 📊 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Bundler | Vite | 6.x |
| Styling | Tailwind CSS | CDN |
| Icons | FontAwesome | 6.x CDN |
| Font | Inter | Google Fonts |
| AI Text | Gemini 2.5 Flash | API |
| AI Image | Imagen 3.0 | API |
| State | React useState | Built-in |
| Storage | localStorage | Built-in |
| Navigation | display:none pattern | CSS |
| Hosting | Vercel | Free tier |
| Source | GitHub | Public repo |

