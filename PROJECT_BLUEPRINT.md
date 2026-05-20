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
│   │   ├── ScriptModule.jsx      # Tab 2: AI script generator (V2.0)
│   │   ├── StudioModule.jsx      # Tab 3: Prompt viewer + Image gen + 6 Export types
│   │   └── SEOModule.jsx         # Tab 4: SEO optimization suite
│   │
│   ├── config/                   # ── Cấu hình (THAY ĐỔI KHI CLONE) ──
│   │   ├── markets.js            # Target markets / languages
│   │   ├── styles.js             # Visual styles + Topics + Suggestions
│   │   ├── prompts.js            # AI system prompts (SPY, SEO, STYLE, AUDIO V17)
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
  revenue_analysis  → CPM, RPM, Earnings, Tier + Monetization Opportunities
  strengths[]       → Point, Impact, Evidence
  weaknesses[]      → Point, Impact, Fix
  audio_strategy    → Voice, Music, SFX, Hooks, Frequency Tuning
  retention_curve   → Drop-off points, Retention boosters  ← MỚI V2
  ab_test_suggestions → Title/Thumbnail A/B variants       ← MỚI V2
  content_repurposing → Shorts, Podcast, Blog, Social      ← MỚI V2
  viral_suggestions → Hook titles + outlines
}
```

**Khi clone**: Thay SPY_PROMPT cho niche mới (Education, Tech, Business...).

---

### 8. `src/modules/ScriptModule.jsx` — Tab 2: Story Weaver ★ CORE (V2.0)

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
2. callGemini(prompt, SCRIPT_SYSTEM_PROMPT V2.0)
3. Post-process: inject style prompt_enforce
4. Display scenes via SceneCard

Outputs:
├── segments[]    → Mảng scene objects
├── scriptMeta    → Metadata từ AI
└── Pass to → StudioModule, SEOModule

Tính năng phụ:
├── AI Style Suggest → callGemini(STYLE_SUGGEST_PROMPT) — ĐÃ FIX STYLE IDs
├── Audio Refine V17 → callGemini(AUDIO_REFINE_PROMPT V17.0)
├── Open Project     → Import .json
└── Copy Voice All   → Clipboard
```

**Nâng cấp V2.0 (SCRIPT_SYSTEM_PROMPT):**

| Tính năng | V1 | V2 |
|-----------|----|----|
| Anatomy Safeguard | Inject vào MỌI scene (kể cả hoa sen, sóng biển) | Phân biệt HUMAN-SHIELD vs NATURE-SHIELD |
| Video Prompt Format | 2 format không nhất quán | Unified format `[[CAMERA_TYPE, MOVEMENT], ...]` |
| Image Prompt | Để trống cho nhiều scenes | BẮT BUỘC cho MỌI scene |
| Camera Movement | Chỉ có shot type | Shot type + Movement (PAN, DOLLY, CRANE...) |
| Narrative Arc | Không có cấu trúc | 6 sections: HOOK→PROBLEM→TEACHING→TRANSFORMATION→RESOLUTION→CTA |
| Character System | Không nhất quán | CHARACTER_LOCK xuyên suốt |
| SFX/Music | Mô tả chung | 3 lớp: Ambient Bed + ASMR + Emotional Punctuation |

**Công thức tính**:
- `sceneCount = ceil(duration * 60 / 8)` — mỗi scene 8 giây
- `wordCount = duration * 130~140` — tùy độ dài

**Khi clone**: Thay SCRIPT_SYSTEM_PROMPT, visual styles, topics.

---

### 9. `src/modules/StudioModule.jsx` — Tab 3: Dharma Studio (V2.0)

**Vai trò**: Xem prompt + tạo ảnh AI + xuất file (6 loại).

```
Modes: VIDEO (16:9) | IMAGE (1:1)

Tính năng:
├── Xem prompt từng scene (video_prompt / image_prompt)
├── Copy prompt → clipboard
├── Generate Image → Imagen 3.0 API
│
└── 📦 EXPORT SYSTEM (6 loại file):
    ├── 1. Tải Dự Án (.json)     → Full project file (import lại được)
    ├── 2. Excel Kịch Bản (.csv) → 19 columns đầy đủ (Scene→Image Prompt)
    ├── 3. Excel Prompt Video     → CSV: Scene + Video Prompt
    ├── 4. Excel Prompt Ảnh       → CSV: Scene + Image Prompt
    ├── 5. TXT Prompt Video       → Plain text, mỗi prompt cách 1 dòng trống
    └── 6. TXT Prompt Ảnh         → Plain text, mỗi prompt cách 1 dòng trống

Filename Format: {topic_slug}_{type}_{DD-MM-YYYY_HHMM}.{ext}
Ví dụ: luat_nhan_qua_prompt_video_20-05-2026_0925.csv
```

**Excel Kịch Bản CSV — 19 Columns:**
```
Scene | Time | Section | Character | Voice | Speaker | Gender | Age |
Accent | Timbre | Tone | Pacing | Speed | Words | End Time | State |
Audio SFX ASMR Music | Video Prompt | Image Prompt
```

**Khi clone**: Thay watermark text, thêm format export.

---

### 10. `src/modules/SEOModule.jsx` — Tab 4: Viral SEO (V2.0)

**Vai trò**: Tối ưu SEO cho YouTube video.

```
Input:  Topic + Market
Output: {
  keywords         → Primary, Secondary, Long-tail + Competitor Gap + Trending  ← MỚI
  trending_score   → Topic heat, Search volume, Best posting window             ← MỚI
  hashtags         → Platform-optimized
  viral_titles     → 5 CTR-optimized titles (tăng từ 2)
  description      → Full video description + timestamps
  thumbnail_suggestions → AI image prompts (2 concepts)
  cross_platform   → TikTok, Facebook, Instagram optimization                  ← MỚI
  series_strategy  → Playlist name + next episodes + SEO                        ← MỚI
  posting_schedule → Best day/time + frequency + reasoning                      ← MỚI
  engagement_comments → Pin comment, CTA, community post                        ← MỚI
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

**10 Visual Styles:**
| ID | Tên | Mô tả |
|----|-----|-------|
| ancient_stone_relic | 🪨 Thánh Tích Khắc Đá | Tượng đá cổ, rêu phong, ánh sáng huyền bí |
| molten_gold_nirvana | ✨ Niết Bàn Vàng Ròng | Vàng nung chảy, hào quang giác ngộ |
| cosmic_yin_yang | 🌀 Pháp Luân Thiên Hà | Vũ trụ âm dương, cân bằng năng lượng |
| zen_ink_wash | 🍃 Kinh Diệp Lục | Lá bồ đề xanh, thiên nhiên tĩnh lặng |
| lotus_ice | ❄️ Băng Hóa Liên Hoa | Hoa sen băng giá, tinh khiết |
| tea_incense | 🫖 Trà Đạo Khói Trầm | Trà đạo, khói trầm hương, tĩnh tại |
| paradise_flowers | 🌺 Kinh Vạn Hoa Thiên Thai | Vạn hoa thiên thai, cảnh tiên |
| moonlit_lotus | 🪷 Hồ Sen Trăng Ngọc | Hồ sen ánh trăng ngọc bích |
| terracotta_temple | 🏺 Tượng Đất Nung Thổ | Đất nung, gỗ mộc, thiền môn |
| shadow_dance | 🎭 Vũ Điệu Bóng Rầm | Múa bóng, ánh sáng bóng tối huyền ảo |

**Khi clone**: ĐÂY LÀ FILE QUAN TRỌNG NHẤT. Thay toàn bộ styles/topics cho niche mới.

---

### 13. `src/config/prompts.js` — AI Prompts (V2.0)

```javascript
SPY_PROMPT           → Phân tích competitor + Retention Curve + A/B Testing + Content Repurposing
SEO_PROMPT           → Tối ưu SEO + Cross-Platform + Series Strategy + Posting Schedule
STYLE_SUGGEST_PROMPT → AI đề xuất style (ĐÃ FIX STYLE IDs khớp styles.js) + Mood/Lighting/Color
AUDIO_REFINE_PROMPT  → Tinh chỉnh thanh âm V17.0 + Emotional Arc + Silence Beats + Audio Layering
```

**Nâng cấp V2.0:**

| Prompt | V1 | V2 |
|--------|----|----|
| SPY | 6 analysis sections | 9 sections + monetization + repurposing |
| SEO | Keywords + Titles + Description | + Cross-platform + Series + Schedule + Trending |
| STYLE | 6 style IDs SAI | 10 style IDs ĐÚNG + mood/lighting/color |
| AUDIO | V16 - 3 sections | V17 - 7 sections + emotional arc + silence beats + 3-layer audio |

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
| 3 | `modules/ScriptModule.jsx` | SCRIPT_SYSTEM_PROMPT | 🔴 BẮT BUỘC |
| 4 | `config/i18n.js` | UI labels, checklist | 🟡 NÊN LÀM |
| 5 | `config/markets.js` | Target markets | 🟡 NÊN LÀM |
| 6 | `components/Header.jsx` | App name, tagline | 🟡 NÊN LÀM |
| 7 | `components/Sidebar.jsx` | Tab names, icons | 🟡 NÊN LÀM |
| 8 | `index.html` | Title, meta, colors | 🟡 NÊN LÀM |
| 9 | `utils/storage.js` | STORAGE_KEY string | 🟢 NHỎ |
| 10 | `modules/StudioModule.jsx` | Watermark text | 🟢 NHỎ |
| 11 | `package.json` | Package name | 🟢 NHỎ |

**KHÔNG cần thay đổi**: `api.js`, `toast.js`, `App.jsx` (cấu trúc), `ConfigModal.jsx`, `SceneCard.jsx`

---

## 📦 EXPORT SYSTEM (6 Loại File)

| # | Tên | Format | Nội dung | Icon |
|---|-----|--------|----------|------|
| 1 | Tải Dự Án | `.json` | Full project (import lại được) | 📄 amber |
| 2 | Excel Kịch Bản | `.csv` | 19 columns đầy đủ | 📊 green |
| 3 | Excel Prompt Video | `.csv` | Scene + Video Prompt | 📊 green |
| 4 | Excel Prompt Ảnh | `.csv` | Scene + Image Prompt | 📊 green |
| 5 | TXT Prompt Video | `.txt` | Plain text prompts | 📝 blue |
| 6 | TXT Prompt Ảnh | `.txt` | Plain text prompts | 📝 blue |

**Filename Convention**: `{topic_slug}_{type}_{DD-MM-YYYY_HHMM}.{ext}`

---

## 🛡️ PROMPT ANATOMY SAFEGUARD SYSTEM

### Vấn đề V1 đã fix:
- ❌ V1: `(perfect human anatomy:1.2)` inject vào cảnh sóng biển, hoa sen, hạt giống → AI tạo hình quái dị
- ✅ V2: Phân biệt HUMAN-SHIELD vs NATURE-SHIELD

### Quy tắc V2:
```
Scene CÓ NGƯỜI → [HUMAN-SHIELD] + "(perfect human anatomy:1.2), exactly two arms..."
Scene KHÔNG CÓ NGƯỜI → [NATURE-SHIELD] + KHÔNG có anatomy tags
```

### Ví dụ:
```
✅ ĐÚNG (cảnh có người):
[[CLOSE-UP SHOT, GENTLE DOLLY IN], An elderly monk sits in meditation...
[HUMAN-SHIELD]. (perfect human anatomy:1.2), exactly two arms, exactly two legs...]

✅ ĐÚNG (cảnh thiên nhiên):
[[WIDE SHOT, SLOW PAN LEFT], A crystal-clear stream flows through forest...
[NATURE-SHIELD]. Sharp object borders, organic natural movement only.]

❌ SAI (V1 - đã fix):
A beautiful lotus flower (perfect human anatomy:1.2), exactly two arms, exactly two legs...
```

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
|-------|-----------| --------|
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

---

## 📝 Changelog

### V2.0 (20-05-2026)
- ✅ **SCRIPT_SYSTEM_PROMPT V2.0**: Anatomy Safeguard, Narrative Arc, Character Lock, Camera Vocabulary
- ✅ **SPY_PROMPT**: +Retention Curve, +A/B Testing, +Content Repurposing, +Monetization
- ✅ **SEO_PROMPT**: +Cross-Platform, +Series Strategy, +Posting Schedule, +Trending Score
- ✅ **STYLE_SUGGEST_PROMPT**: Fix 6 style IDs sai → 10 IDs đúng, +Mood/Lighting/Color
- ✅ **AUDIO_REFINE V17.0**: +Emotional Arc, +Silence Beats, +3-Layer Audio, +Voice Transitions
- ✅ **Export System**: 2 → 6 loại file (JSON, Excel Kịch Bản, Excel/TXT Prompt Video/Ảnh)
- ✅ **Excel Kịch Bản**: 6 → 19 columns (thêm voice profile, SFX, timing)
- ✅ **Filename Convention**: Thêm timestamp `{topic}_{type}_{DD-MM-YYYY_HHMM}.{ext}`
