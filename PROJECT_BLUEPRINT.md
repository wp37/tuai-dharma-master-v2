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


---

## 💻 TOÀN BỘ SOURCE CODE (All-in-one Project Source)

Dưới đây là toàn bộ mã nguồn của dự án. Bạn có thể sử dụng nội dung này để clone toàn bộ dự án vào project khác:

### src/App.jsx

`$ext
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ConfigModal from './components/ConfigModal';
import SpyModule from './modules/SpyModule';
import ScriptModule from './modules/ScriptModule';
import StudioModule from './modules/StudioModule';
import SEOModule from './modules/SEOModule';
import { getKeyCount, hasKeys } from './utils/storage';

export default function App() {
  const [tab, setTab] = useState('spy');
  const [configOpen, setConfigOpen] = useState(false);
  const [uiLang, setUiLang] = useState('vi');
  const [keyCount, setKeyCount] = useState(0);
  const [segments, setSegments] = useState([]);
  const [topic, setTopic] = useState('');
  const [initialTopic, setInitialTopic] = useState('');
  const [market, setMarket] = useState('vn_dharma');

  useEffect(() => {
    setKeyCount(getKeyCount());
    if (!hasKeys()) setConfigOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        uiLang={uiLang}
        onToggleLang={() => setUiLang(l => l === 'vi' ? 'en' : 'vi')}
        onOpenConfig={() => setConfigOpen(true)}
        keyCount={keyCount}
      />

      <main className="flex-1 max-w-[1800px] mx-auto w-full p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-70px)] h-auto">
        <Sidebar activeTab={tab} onTabChange={setTab} hasScriptData={segments.length > 0} uiLang={uiLang} />

        <div className="flex-1 bg-[#10141c]/80 rounded-2xl border border-slate-700/30 p-4 md:p-6 md:overflow-y-auto relative min-h-[500px] backdrop-blur-sm">
          <div style={{ display: tab === 'spy' ? 'block' : 'none' }}>
            <SpyModule onUseStrategy={(title) => { setInitialTopic(title); setSegments([]); setTab('script'); }} uiLang={uiLang} />
          </div>
          <div style={{ display: tab === 'script' ? 'block' : 'none' }}>
            <ScriptModule
              onScriptGenerated={(segs, style, t) => { setSegments(segs); if (t) setTopic(t); setTab('studio'); }}
              onAudioRefined={(segs, t) => { setSegments(segs); if (t) setTopic(t); }}
              initialTopic={initialTopic}
              uiLang={uiLang}
              market={market}
              onMarketChange={setMarket}
            />
          </div>
          <div style={{ display: tab === 'studio' ? 'block' : 'none' }}>
            <StudioModule segments={segments} topic={topic} uiLang={uiLang} />
          </div>
          <div style={{ display: tab === 'seo' ? 'block' : 'none' }}>
            <SEOModule initialTopic={initialTopic} uiLang={uiLang} market={market} />
          </div>
        </div>
      </main>

      <footer className="relative border-t border-amber-900/20 py-6 bg-[#0a0e14]">
        <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
          <div className="text-slate-500 text-xs font-light tracking-wide">
            Copyright Â© {new Date().getFullYear()} <span className="text-slate-300 font-bold uppercase ml-1">TUAI</span>.
            <span className="ml-2 text-slate-600">{uiLang === 'vi' ? 'Báº£o lÆ°u má»i quyá»n.' : 'All rights reserved.'}</span>
          </div>
        </div>
      </footer>

      <ConfigModal isOpen={configOpen} onClose={() => { setConfigOpen(false); setKeyCount(getKeyCount()); }} uiLang={uiLang} />
    </div>
  );
}

``n
### src/index.css

`$ext
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0a0e14; }
::-webkit-scrollbar-thumb { background: #3d3520; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #5c5030; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
body { color: #cbd5e1; background-color: #0a0e14; background-image: radial-gradient(at top, #f5a6230a, #0a0e14 60%); min-height: 100vh; margin: 0; padding: 0; font-family: Inter, sans-serif; }
::selection { color: #f1f5f9; background: #f5a62340; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: 1s linear infinite spin; }
@keyframes pulseGlow { 0%, to { filter: drop-shadow(0 0 3px #f5a6234d); } 50% { filter: drop-shadow(0 0 8px #f5a62399); } }
.pulse-glow { animation: 2s ease-in-out infinite pulseGlow; }
@keyframes slideIn { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

``n
### src/main.jsx

`$ext
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

``n
### src/components/ConfigModal.jsx

`$ext
import { useState, useEffect } from 'react';
import { addKey, removeKey, getKeys } from '../utils/storage';
import { showToast } from '../utils/toast';

export default function ConfigModal({ isOpen, onClose, uiLang }) {
  const [keys, setKeys] = useState(getKeys());
  const [newKey, setNewKey] = useState('');

  useEffect(() => { if (isOpen) setKeys(getKeys()); }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    const k = newKey.trim();
    if (!k) return showToast(uiLang === 'vi' ? 'Nháº­p API Key!' : 'Enter API Key!');
    if (!k.startsWith('AIza')) return showToast(uiLang === 'vi' ? 'Key khÃ´ng há»£p lá»‡! (pháº£i báº¯t Ä‘áº§u báº±ng AIza)' : 'Invalid key! (must start with AIza)', 'error');
    const updated = addKey(k);
    setKeys(updated);
    setNewKey('');
    showToast(uiLang === 'vi' ? 'âœ… ÄÃ£ thÃªm API Key!' : 'âœ… API Key added!', 'success');
  };

  const handleRemove = (k) => {
    const updated = removeKey(k);
    setKeys(updated);
    showToast(uiLang === 'vi' ? 'ÄÃ£ xÃ³a key' : 'Key removed', 'info');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#12161e] border border-slate-700/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-gear text-amber-500" /> {uiLang === 'vi' ? 'Cáº¥u HÃ¬nh API Keys' : 'API Keys Config'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl"><i className="fa-solid fa-times" /></button>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-3">
            {uiLang === 'vi' ? 'ThÃªm Google Gemini API Key Ä‘á»ƒ sá»­ dá»¥ng AI. Há»— trá»£ nhiá»u key (round-robin).' : 'Add Google Gemini API Keys for AI. Supports multiple keys (round-robin).'}
          </p>
          <div className="flex gap-2">
            <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="AIzaSy..." onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600" />
            <button onClick={handleAdd} className="px-4 py-2 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-200 font-bold rounded-lg text-sm">
              <i className="fa-solid fa-plus" /> {uiLang === 'vi' ? 'ThÃªm' : 'Add'}
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {keys.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-500 italic text-sm">{uiLang === 'vi' ? 'ChÆ°a cÃ³ API Key nÃ o.' : 'No API Keys added.'}</p>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:text-amber-300 text-sm font-semibold transition-all duration-200">
                <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                {uiLang === 'vi' ? 'Láº¥y API Key táº¡i Ä‘Ã¢y' : 'Get API Key here'}
              </a>
            </div>
          ) : keys.map((k, i) => (
            <div key={i} className="flex items-center justify-between bg-[#0a0e14] p-3 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className="fa-solid fa-key text-amber-500 text-xs" />
                <span className="text-sm text-slate-300 font-mono truncate">{k.slice(0, 10)}...{k.slice(-4)}</span>
              </div>
              <button onClick={() => handleRemove(k)} className="text-red-400 hover:text-red-300 ml-2"><i className="fa-solid fa-trash text-xs" /></button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/30 text-center">
          <span className="text-xs text-slate-500">{keys.length} key(s) {uiLang === 'vi' ? 'Ä‘Ã£ cáº¥u hÃ¬nh' : 'configured'}</span>
        </div>
      </div>
    </div>
  );
}

``n
### src/components/Header.jsx

`$ext
export default function Header({ uiLang, onToggleLang, onOpenConfig, keyCount }) {
  return (
    <header className="bg-[#0a0e14]/95 backdrop-blur-md border-b border-amber-900/20 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-900/30 rounded-xl flex items-center justify-center border border-amber-500/20 pulse-glow">
          <i className="fa-solid fa-om text-amber-400 text-lg" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-black text-white tracking-tight">TUAI <span className="text-amber-400">DHARMA</span> MASTER <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black align-middle">V2</span></h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase hidden md:block">AI Healing Content Suite</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onToggleLang}
          className="px-3 py-1.5 bg-[#12161e] rounded-lg text-xs font-bold text-slate-300 hover:text-white border border-slate-700/30 hover:border-slate-600 transition-all">
          {uiLang === 'vi' ? 'ðŸ‡»ðŸ‡³ VI' : 'ðŸ‡¬ðŸ‡§ EN'}
        </button>
        <button onClick={onOpenConfig}
          className="px-3 py-1.5 bg-amber-900/20 rounded-lg text-xs font-bold text-amber-300 hover:bg-amber-900/30 border border-amber-500/20 flex items-center gap-1.5 transition-all">
          <i className="fa-solid fa-key" />
          <span className="hidden md:inline">{keyCount} Keys</span>
          <span className="md:hidden">{keyCount}</span>
        </button>
      </div>
    </header>
  );
}

``n
### src/components/SceneCard.jsx

`$ext
import { memo } from 'react';
import { showToast } from '../utils/toast';

const SceneCard = memo(({ seg, idx, uiLang }) => (
  <div className="bg-[#12161e] border border-slate-700/30 p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:border-teal-500/30 transition-colors relative">
    {/* Scene info */}
    <div className="w-full sm:w-24 shrink-0 text-center pt-1 border-r border-slate-700/30 pr-2">
      <div className="text-[10px] bg-[#12161e] px-2 py-1 rounded font-bold text-white mb-1">SCENE {seg.scene_number || idx + 1}</div>
      <div className="text-[9px] text-slate-500 font-mono mb-1">{seg.time}</div>
      <div className="text-[9px] text-teal-400 font-bold uppercase break-words">{seg.section}</div>
    </div>

    {/* Content */}
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Visual */}
      <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30 flex flex-col">
        <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mb-1"><i className="fa-solid fa-eye" /> VISUAL</div>
        <p className="text-xs text-slate-300 mb-2 flex-1">{seg.visual_desc_vi || seg.visual_desc}</p>
        {seg.pacing_score !== undefined && (
          <div className="mt-2 bg-black/30 p-2 rounded border border-slate-800 flex items-center gap-2">
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${seg.pacing_score >= 8 ? 'bg-green-900/50 text-green-400' : seg.pacing_score >= 5 ? 'bg-amber-900/50 text-amber-400' : 'bg-red-900/50 text-red-400'}`}>
              PACING: {seg.pacing_score}/10
            </div>
            <div className="text-[9px] text-slate-400 italic flex-1">{seg.pacing_warning || (uiLang === 'vi' ? 'Nhá»‹p Ä‘á»™ á»•n Ä‘á»‹nh' : 'Pacing stable')}</div>
          </div>
        )}
        {seg.sfx_music_suggestion && (
          <div className="mt-2 p-2 rounded bg-blue-900/10 border border-blue-500/20">
            <div className="text-[9px] font-bold text-blue-400 flex items-center gap-1 mb-1"><i className="fa-solid fa-music" /> ASMR / AUDIO FX</div>
            <div className="text-[10px] text-blue-200/80">{seg.sfx_music_suggestion}</div>
          </div>
        )}
        {seg.strategy_note && (
          <div className="mt-2 p-2 rounded bg-amber-900/10 border border-amber-500/20 text-[10px] text-amber-200/80 italic">ðŸ’¡ {seg.strategy_note}</div>
        )}
      </div>

      {/* Voice & Dialogue */}
      <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30">
        <div className="flex justify-between items-center mb-1">
          <div className="text-[10px] text-teal-400 font-bold flex items-center gap-1"><i className="fa-solid fa-microphone-alt" /> VOICE & DIALOGUE</div>
          <button onClick={() => {
            const text = seg.dialogues ? seg.dialogues.map(d => `${d.character_name}: ${d.line}`).join('\n\n') : seg.voice_text || '';
            navigator.clipboard.writeText(text);
            showToast('âœ… Copied!', 'success');
          }} className="text-slate-500 hover:text-white"><i className="fa-regular fa-copy" /></button>
        </div>

        {seg.dialogues && Array.isArray(seg.dialogues) && seg.dialogues.length > 0 ? (
          <div className="space-y-2 mt-2">
            {seg.dialogues.map((d, i) => (
              <div key={i} className="bg-[#0a0e14]/50 rounded p-2 border-l-2 border-amber-500/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-400">{d.character_name}</span>
                  {d.emotion && <span className="text-[9px] text-slate-400 italic">({d.emotion})</span>}
                </div>
                <p className="text-xs text-amber-100 font-medium leading-relaxed">"{d.line}"</p>
                {d.direction && <p className="text-[9px] text-slate-500 mt-1 flex items-center gap-1"><i className="fa-solid fa-video text-slate-600" /> {d.direction}</p>}
              </div>
            ))}
            {seg.voice_text && (
              <div className="mt-3 pt-2 border-t border-slate-700/50">
                <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">{uiLang === 'vi' ? 'Dáº«n truyá»n:' : 'Narration:'}</div>
                <p className="text-xs text-slate-400 italic leading-relaxed text-justify">{seg.voice_text}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-amber-100 font-medium italic leading-relaxed text-justify">"{seg.chapter_voice_block || seg.voice_text || (uiLang === 'vi' ? '(Äá»c tiáº¿p...)' : '(Continue...)')}"</p>
        )}

        {/* Voice Profile */}
        {seg.voice_profile && (
          <div className="mt-2 p-2.5 bg-purple-950/20 rounded-lg border border-purple-500/20 space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-purple-400 flex items-center gap-1"><i className="fa-solid fa-user-tie" /> {seg.voice_profile.speaker}</div>
              <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${seg.voice_profile.state === 'ON-SCREEN' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                {seg.voice_profile.state}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                ['AGE & DETAILS', seg.voice_profile.age || (seg.voice_profile.gender ? seg.voice_profile.gender : 'ChÆ°a rÃµ')],
                ['ACCENT', seg.voice_profile.accent || 'NORTHERN_VIETNAMESE'],
                ['TIMBRE', seg.voice_profile.timbre],
                ['TONE', seg.voice_profile.tone],
                ['SPEED', seg.voice_profile.pacing_speed || seg.voice_profile.pacing],
              ].map(([label, val]) => (
                <div key={label} className="bg-[#0a0e14]/30 rounded p-1.5 border border-purple-900/20">
                  <div className="text-[8px] text-purple-500 font-bold">{label}</div>
                  <div className="text-[9px] text-slate-300">{val}</div>
                </div>
              ))}
            </div>
            {(seg.word_count || seg.audio_end_time) && (
              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-purple-900/30">
                {seg.word_count && <div className="flex items-center gap-1.5 text-[9px]"><span className="text-purple-400/70 font-bold">WORDS:</span><span className="text-purple-200 font-mono">{seg.word_count}</span></div>}
                {seg.audio_end_time && <div className="flex items-center gap-1.5 text-[9px]"><span className="text-purple-400/70 font-bold">END TIME:</span><span className="text-purple-200 font-mono">{seg.audio_end_time}</span></div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
));

SceneCard.displayName = 'SceneCard';
export default SceneCard;

``n
### src/components/Sidebar.jsx

`$ext
const TABS = [
  { id: 'spy', icon: 'fa-eye', num: '1', label_vi: 'TREND SCOUT', sub_vi: 'Chiáº¿n LÆ°á»£c Thá»‹ TrÆ°á»ng', label_en: 'TREND SCOUT', sub_en: 'Market Strategy', color: 'text-red-400' },
  { id: 'script', icon: 'fa-om', num: '2', label_vi: 'STORY WEAVER', sub_vi: 'BiÃªn Ká»‹ch Storyboard', label_en: 'STORY WEAVER', sub_en: 'Script & Storyboard', color: 'text-teal-400' },
  { id: 'studio', icon: 'fa-clapperboard', num: '3', label_vi: 'DHARMA STUDIO', sub_vi: 'XÆ°á»Ÿng Sáº£n Xuáº¥t Video', label_en: 'DHARMA STUDIO', sub_en: 'Video Production', color: 'text-cyan-400' },
  { id: 'seo', icon: 'fa-leaf', num: '4', label_vi: 'VIRAL SEO', sub_vi: 'Tá»‘i Æ¯u Viral & SEO', label_en: 'VIRAL SEO', sub_en: 'SEO & Distribution', color: 'text-amber-400' },
];

export default function Sidebar({ activeTab, onTabChange, hasScriptData, uiLang }) {
  return (
    <nav className="md:w-48 flex md:flex-col gap-1 bg-[#10141c]/80 rounded-2xl border border-slate-700/30 p-2 md:py-4 backdrop-blur-sm overflow-x-auto md:overflow-visible">
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.id === 'studio' && !hasScriptData;
        return (
          <button key={tab.id} onClick={() => !isDisabled && onTabChange(tab.id)} disabled={isDisabled}
            className={`flex-1 md:flex-none flex items-center gap-3 p-2.5 md:p-3 rounded-xl transition-all text-left min-w-[80px]
              ${isActive ? 'bg-slate-800/80 shadow-lg border border-slate-600/30' : 'hover:bg-slate-800/30 border border-transparent'}
              ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-amber-900/40 border border-amber-500/30' : 'bg-slate-800/50 border border-slate-700/30'}`}>
              <i className={`fa-solid ${tab.icon} text-sm ${isActive ? tab.color : 'text-slate-500'}`} />
            </div>
            <div className="hidden md:block min-w-0">
              <div className={`text-[10px] font-black tracking-wide ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {uiLang === 'vi' ? tab.label_vi : tab.label_en}
              </div>
              <div className={`text-[9px] ${isActive ? 'text-slate-400' : 'text-slate-600'} truncate`}>
                {tab.num}. {uiLang === 'vi' ? tab.sub_vi : tab.sub_en}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

``n
### src/config/i18n.js

`$ext
export const UI_STRINGS = {
  vi: {
    spy: { title: 'PhÃ¢n TÃ­ch Video Äá»‘i Thá»§' },
    script: { title: 'BiÃªn Ká»‹ch & XÃ¢y Dá»±ng Storyboard' },
    studio: { title: 'Studio SÃ¡ng Táº¡o' },
    seo: { title: 'Tá»‘i Æ¯u SEO & PhÃ¢n Phá»‘i' },
    common: { copied: 'ÄÃ£ copy thÃ nh cÃ´ng!' },
    nav: { spy: 'GiÃ¡n Äiá»‡p', script: 'Ká»‹ch Báº£n', studio: 'Studio', seo: 'SEO' },
    header: { config: 'Cáº¥u HÃ¬nh', keys: 'Keys' },
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
    { id: 'title_keywords', label: 'TiÃªu Ä‘á» chá»©a tá»« khÃ³a chÃ­nh (Pháº­t PhÃ¡p, Chá»¯a LÃ nh, NhÃ¢n Quáº£...)' },
    { id: 'title_emotion', label: 'TiÃªu Ä‘á» cÃ³ yáº¿u tá»‘ cáº£m xÃºc/gÃ¢y tÃ² mÃ²' },
    { id: 'title_length', label: 'TiÃªu Ä‘á» dÆ°á»›i 60 kÃ½ tá»±' },
    { id: 'thumb_contrast', label: 'Thumbnail cÃ³ Ä‘á»™ tÆ°Æ¡ng pháº£n cao, text rÃµ rÃ ng' },
    { id: 'thumb_face', label: 'Thumbnail cÃ³ khuÃ´n máº·t hoáº·c biá»ƒu tÆ°á»£ng thiÃªng liÃªng' },
  ],
  'Description & Tags': [
    { id: 'desc_hook', label: 'MÃ´ táº£ cÃ³ hook trong 2-3 dÃ²ng Ä‘áº§u' },
    { id: 'desc_keywords', label: 'MÃ´ táº£ chá»©a tá»« khÃ³a tá»± nhiÃªn' },
    { id: 'desc_timestamps', label: 'CÃ³ timestamps/chapters' },
    { id: 'tags_relevant', label: 'Tags phÃ¹ há»£p ngÃ¡ch Pháº­t PhÃ¡p/Chá»¯a LÃ nh' },
  ],
  'Content Quality': [
    { id: 'hook_3s', label: 'Hook máº¡nh trong 3 giÃ¢y Ä‘áº§u' },
    { id: 'retention', label: 'CÃ³ retention hooks má»—i 30-60 giÃ¢y' },
    { id: 'cta_subscribe', label: 'CÃ³ CTA subscribe/like cuá»‘i video' },
    { id: 'end_screen', label: 'ÄÃ£ thiáº¿t láº­p End Screen' },
  ],
  'Audio & Engagement': [
    { id: 'voice_quality', label: 'Giá»ng Ä‘á»c cháº¥t lÆ°á»£ng, truyá»n cáº£m' },
    { id: 'bg_music', label: 'Nháº¡c ná»n thiá»n Ä‘á»‹nh phÃ¹ há»£p' },
    { id: 'pinned_comment', label: 'ÄÃ£ ghim comment tÆ°Æ¡ng tÃ¡c' },
    { id: 'community', label: 'ÄÃ£ Ä‘Äƒng Community Post' },
  ],
};

``n
### src/config/markets.js

`$ext
export const MARKETS = {
  vn_dharma: { id: 'vn_dharma', name: 'Viá»‡t Nam â€” Pháº­t PhÃ¡p & Chá»¯a LÃ nh', flag: 'VN', voice_lang: 'Vietnamese', culture: 'Vietnamese Buddhist tradition, Thiá»n tÃ´ng, Tá»‹nh Äá»™ tÃ´ng' },
  vn_healing: { id: 'vn_healing', name: 'Viá»‡t Nam â€” Chá»¯a LÃ nh TÃ¢m Há»“n', flag: 'VN', voice_lang: 'Vietnamese', culture: 'Vietnamese healing, tÃ¢m linh Viá»‡t Nam' },
  en_us: { id: 'en_us', name: 'English â€” Mindfulness & Healing', flag: 'US', voice_lang: 'English', culture: 'Western mindfulness, meditation, self-help' },
  en_uk: { id: 'en_uk', name: 'English â€” Buddhist Philosophy', flag: 'UK', voice_lang: 'English', culture: 'British Buddhist philosophy, contemplative tradition' },
  th: { id: 'th', name: 'Thailand â€” Theravada Buddhism', flag: 'TH', voice_lang: 'Thai', culture: 'Thai Theravada Buddhism, temple culture, meditation retreats' },
  jp: { id: 'jp', name: 'Japan â€” Zen Buddhism', flag: 'JP', voice_lang: 'Japanese', culture: 'Japanese Zen Buddhism, wabi-sabi, mindfulness' },
  kr: { id: 'kr', name: 'Korea â€” Seon Buddhism', flag: 'KR', voice_lang: 'Korean', culture: 'Korean Seon Buddhism, temple stay culture' },
  in: { id: 'in', name: 'India â€” Original Dharma', flag: 'IN', voice_lang: 'Hindi', culture: 'Indian Buddhist origins, Bodh Gaya, Vipassana' },
  cn: { id: 'cn', name: 'China â€” Chan Buddhism', flag: 'CN', voice_lang: 'Chinese', culture: 'Chinese Chan Buddhism, Pure Land, Tibetan influence' },
};

``n
### src/config/prompts.js

`$ext
export const SPY_PROMPT = `You are a YouTube Content Intelligence Analyst specializing in Dharma / Buddhist Philosophy / Healing / Meditation content.

MISSION: Provide DEEP, ACTIONABLE competitor intelligence for YouTube creators in the Dharma / Healing niche.

ANALYSIS FRAMEWORK:
1. **Revenue Intelligence** - Estimate earnings based on niche CPM rates (Spirituality/Healing/Education niche)
2. **Content Forensics** - Identify what works (Strengths) and what fails (Weaknesses)
3. **Audio Psychology** - Analyze voice, music, ambient sounds, meditation narration
4. **Engagement Signals** - Predict CTR, retention, viral potential
5. **Hook Timeline** - Map retention hooks throughout video
6. **Replication Strategy** - Step-by-step guide to copy success
7. **Retention Curve Analysis** - Predict audience drop-off points and retention patterns
8. **A/B Testing Suggestions** - Propose title/thumbnail variants for optimization
9. **Content Repurposing** - Ideas for Shorts, podcast, blog, social media

REQUIRED JSON OUTPUT:
{
  "meta_seo": {
    "title_structure": "How title is optimized for CTR",
    "thumbnail_tactics": "Visual strategy (golden light, Buddha imagery, text overlay, serene atmosphere)",
    "content_authenticity": "How genuine the spiritual/healing message appears",
    "dharma_factor": "Why this Buddhist/healing topic is compelling"
  },
  "content_quality": {
    "depth_of_teaching": "Quality of spiritual teaching vs superficial content",
    "narrative_flow": "Story structure analysis (karma story / healing journey)",
    "visual_storytelling": "Visual quality, atmosphere, sacred imagery pacing"
  },
  "revenue_analysis": {
    "estimated_cpm": "$6-15 (Spirituality/Healing/Education niche)",
    "estimated_rpm": "$3-8 (after YouTube 45% cut)",
    "total_estimated_earnings": "Based on views",
    "monetization_tier": "Premium/High/Medium/Low",
    "revenue_factors": ["Family-friendly content", "High watch time", "Spiritual audience 25-55"],
    "monetization_opportunities": {
      "affiliate": "Book/meditation app affiliate potential",
      "merchandise": "Spiritual merchandise ideas",
      "membership": "Channel membership tier suggestions",
      "super_thanks": "Super Thanks optimization"
    }
  },
  "strengths": [
    {"point": "Emotional hook in first 3 seconds", "impact": "High", "evidence": "Pain-to-peace transformation"}
  ],
  "weaknesses": [
    {"point": "Weak call-to-action", "impact": "Medium", "fix": "Add clear end screen with subscribe prompt"}
  ],
  "audio_strategy": {
    "voice_analysis": "Warm meditative voice, gentle cadence.",
    "music_style": "Ambient meditation music / tibetan singing bowls / nature sounds.",
    "sound_effects": ["Temple bells", "Water flowing", "Wind chimes"],
    "hook_sounds": "Gentle bell chime at key emotional moment.",
    "frequency_tuning": "432Hz/528Hz healing frequency usage"
  },
  "engagement_signals": {
    "estimated_ctr": "8-14%",
    "retention_score": "High",
    "viral_potential": "Medium-High",
    "comment_sentiment": "Positive/Grateful",
    "share_worthiness": "8/10"
  },
  "retention_curve": {
    "predicted_drop_points": [{"timestamp": "0:30", "reason": "Slow intro without emotional hook", "fix": "Add pain-point question"}],
    "retention_boosters": ["Pattern interrupt at 1:00", "New character introduction at 2:30"],
    "average_view_duration_estimate": "65-75%"
  },
  "hook_timeline": [
    {"timestamp": "0-3s", "hook_type": "Emotional Hook", "description": "Pain point question that resonates deeply"}
  ],
  "audience_insight": {
    "healing_motivation": "How video inspires inner peace and self-reflection",
    "spiritual_desire": "Audience engagement with Buddhist teaching",
    "emotional_factor": "Emotional connection to karma and life lessons",
    "demographics": "Age 25-55, spiritual seekers, meditation practitioners"
  },
  "competitive_edge": "What makes this video unique in the dharma/healing space",
  "replication_strategy": "Step by step guide to replicate success in this niche",
  "ab_test_suggestions": [
    {"element": "Title", "variant_a": "Original title", "variant_b": "Alternative with emotional trigger", "hypothesis": "Why variant B may perform better"},
    {"element": "Thumbnail", "variant_a": "Current approach", "variant_b": "Alternative visual concept", "hypothesis": "CTR improvement prediction"}
  ],
  "content_repurposing": {
    "shorts_ideas": ["30s clip from most emotional moment", "Key teaching in 60s"],
    "podcast_angle": "Extended discussion topic",
    "blog_outline": "Article structure from video content",
    "social_posts": ["Quote card for Instagram", "Thread for X/Twitter"]
  },
  "viral_suggestions": [
    {"hook_title": "Title suggestion", "outline_idea": "Content outline", "healing_twist": "Spiritual/healing angle"}
  ]
}

BE SPECIFIC. USE DATA. PROVIDE ACTIONABLE INSIGHTS.`;

export const SEO_PROMPT = `You are a Dharma Content Strategist and YouTube SEO Expert specializing in Buddhist Philosophy / Karma stories / Healing content.

MISSION: Create COMPLETE SEO package for maximum discoverability and engagement in the spiritual healing niche.

REQUIRED JSON OUTPUT:
{
  "keywords": {
    "primary": ["Loi Phat day", "Chua lanh tam hon"],
    "secondary": ["Nhan qua bao ung", "Thien dinh moi ngay"],
    "long_tail": ["5 loi Phat day giup buong bo phien nao"],
    "competitor_gap": ["Keywords competitors haven't targeted yet"],
    "trending": ["Currently trending related keywords"]
  },
  "trending_score": {
    "topic_heat": "8/10",
    "search_volume_trend": "Rising/Stable/Declining",
    "best_posting_window": "Optimal time to publish",
    "seasonal_relevance": "Lá»… Pháº­t Äáº£n, Vu Lan, Táº¿t..."
  },
  "hashtags": ["#LoiPhatDay", "#ChuaLanh", "#NhanQua", "#ThienDinh", "#BinhYen"],
  "video_description": {
    "hook": "First 2-3 lines that grab attention with emotional healing promise",
    "full_description": "Complete description (300-500 words) emphasizing spiritual journey and healing. Include disclaimer.",
    "timestamps": [
      {"time": "0:00", "label": "Gioi thieu chu de chua lanh"}
    ]
  },
  "viral_titles": [
    "Title option 1 with CAPITALIZED keywords",
    "Title option 2",
    "Title option 3",
    "Title option 4",
    "Title option 5"
  ],
  "thumbnail_suggestions": [
    {
      "concept_name": "TÃªn concept",
      "visual_concept": "MÃ´ táº£ hÃ¬nh áº£nh",
      "text_on_image": "TEXT TRÃŠN áº¢NH (ngáº¯n gá»n 3-5 tá»«, in hoa)",
      "color_psychology": "TÃ´ng mÃ u chá»§ Ä‘áº¡o",
      "ai_image_prompt": "Prompt tiáº¿ng Anh chi tiáº¿t Ä‘á»ƒ táº¡o áº£nh thumbnail 16:9"
    }
  ],
  "cross_platform": {
    "tiktok": {"caption": "Caption for TikTok", "hashtags": ["#tiktok_tags"], "hook_style": "First 3s hook for short-form"},
    "facebook": {"post_text": "Facebook post text", "group_strategy": "Which groups to share in"},
    "instagram": {"caption": "IG caption", "reels_idea": "Reels adaptation", "story_sequence": "Story slides outline"}
  },
  "series_strategy": {
    "series_name": "Suggested series/playlist name",
    "next_episodes": ["Episode 2 topic", "Episode 3 topic", "Episode 4 topic"],
    "playlist_seo": "Playlist description for SEO"
  },
  "posting_schedule": {
    "best_day": "Day of week",
    "best_time": "Time in Vietnam timezone",
    "frequency": "Recommended posting frequency",
    "reasoning": "Why this schedule works for dharma content"
  },
  "engagement_comments": {
    "pinned_comment": "Pin this to top - ask about spiritual journey",
    "discussion_starters": ["Ban co dang cam thay binh yen luc nay?"],
    "call_to_action": "Go 'Nam Mo A Di Da Phat' de gieo duyen lanh",
    "community_post_idea": "Community tab post to promote this video"
  }
}

BE SPECIFIC. PROVIDE ACTIONABLE CONTENT. Generate at least 5 viral titles and 2 thumbnail suggestions.`;

export const STYLE_SUGGEST_PROMPT = (lang) => `
Báº N LÃ€ CHUYÃŠN GIA Äá»€ XUáº¤T PHONG CÃCH NGHá»† THUáº¬T PHáº¬T GIÃO & CHá»®A LÃ€NH (LANGUAGE: ${lang}).
Dá»±a trÃªn chá»§ Ä‘á» ká»‹ch báº£n Pháº­t PhÃ¡p Ä‘Æ°á»£c cung cáº¥p, hÃ£y phÃ¢n tÃ­ch cáº£m xÃºc, bá»‘i cáº£nh vÃ  thÃ´ng Ä‘iá»‡p cá»‘t lÃµi, sau Ä‘Ã³ Ä‘á» xuáº¥t phong cÃ¡ch visual phÃ¹ há»£p nháº¥t tá»« danh sÃ¡ch bÃªn dÆ°á»›i dÆ°á»›i dáº¡ng JSON:
{
  "recommended_style": "style_id",
  "reason": "Giáº£i thÃ­ch táº¡i sao phong cÃ¡ch nÃ y phÃ¹ há»£p vá»›i chá»§ Ä‘á» vÃ  cáº£m xÃºc",
  "mood_keywords": ["tá»« khÃ³a tÃ¢m tráº¡ng phÃ¹ há»£p"],
  "lighting_suggestion": "Äá» xuáº¥t Ã¡nh sÃ¡ng chá»§ Ä‘áº¡o cho toÃ n bá»™ video",
  "color_palette": ["3-4 mÃ u chá»§ Ä‘áº¡o gá»£i Ã½"],
  "alternative_style": "style_id thay tháº¿",
  "alternative_reason": "LÃ½ do thay tháº¿"
}

CÃ¡c style há»£p lá»‡:
- ancient_stone_relic: ThÃ¡nh TÃ­ch Kháº¯c ÄÃ¡ - tÆ°á»£ng Ä‘Ã¡ cá»•, rÃªu phong, Ã¡nh sÃ¡ng huyá»n bÃ­
- molten_gold_nirvana: Niáº¿t BÃ n VÃ ng RÃ²ng - vÃ ng nung cháº£y, hÃ o quang giÃ¡c ngá»™
- cosmic_yin_yang: PhÃ¡p LuÃ¢n ThiÃªn HÃ  - vÅ© trá»¥ Ã¢m dÆ°Æ¡ng, cÃ¢n báº±ng nÄƒng lÆ°á»£ng
- zen_ink_wash: Kinh Diá»‡p Lá»¥c - lÃ¡ bá»“ Ä‘á» xanh, thiÃªn nhiÃªn tÄ©nh láº·ng
- lotus_ice: BÄƒng HÃ³a LiÃªn Hoa - hoa sen bÄƒng giÃ¡, tinh khiáº¿t, trong suá»‘t
- tea_incense: TrÃ  Äáº¡o KhÃ³i Tráº§m - trÃ  Ä‘áº¡o, khÃ³i tráº§m hÆ°Æ¡ng, tÄ©nh táº¡i
- paradise_flowers: Kinh Váº¡n Hoa ThiÃªn Thai - váº¡n hoa thiÃªn thai, cáº£nh tiÃªn, rá»±c rá»¡
- moonlit_lotus: Há»“ Sen TrÄƒng Ngá»c - há»“ sen dÆ°á»›i Ã¡nh trÄƒng ngá»c bÃ­ch
- terracotta_temple: TÆ°á»£ng Äáº¥t Nung Thá»• - tÆ°á»£ng Ä‘áº¥t nung, gá»— má»™c, thiá»n mÃ´n
- shadow_dance: VÅ© Äiá»‡u BÃ³ng Ráº§m - mÃºa bÃ³ng, Ã¡nh sÃ¡ng vÃ  bÃ³ng tá»‘i huyá»n áº£o`;

export const AUDIO_REFINE_PROMPT = `# ðŸ‘‘ MASTER COMMAND V17.0: UNIVERSAL AUDIO RE-ENGINEERING

CHá»ˆ THá»Š Tá»ª CHIEF ARCHITECT (Lá»†NH TINH CHá»ˆNH Äá»˜C Láº¬P & Báº¢O TOÃ€N NGUYÃŠN TRáº NG):
"YÃªu cáº§u thá»±c hiá»‡n hiá»‡u chá»‰nh duy nháº¥t pháº§n Thanh Ã¢m cho [Cáº£nh 1 Ä‘áº¿n Cáº£nh N]. Há»‡ thá»‘ng pháº£i váº­n hÃ nh theo cÆ¡ cháº¿ 'Phong tá»a Tham sá»‘ - TÃ¡i cáº¥u trÃºc Há»“n'."

ðŸ›‘ 1. NGUYÃŠN Táº®C PHONG Tá»ŽA TUYá»†T Äá»I (UNIVERSAL PRESERVATION)
GIá»® NGUYÃŠN 100%: ToÃ n bá»™ tiÃªu Ä‘á» Ä‘á» má»¥c vÃ  ná»™i dung dá»¯ liá»‡u cá»§a Táº¤T Cáº¢ CÃC Má»¤C KHÃ”NG LIÃŠN QUAN Äáº¾N THANH Ã‚M.

ðŸŽ™ï¸ 2. CHá»ˆ THá»Š THANH Ã‚M THIáº¾T QUÃ‚N LUáº¬T (HARDCODED AUDIO)
Chá»‰ thá»±c hiá»‡n thay Ä‘á»•i ná»™i dung cá»§a 3 thÃ nh pháº§n thanh Ã¢m cá»‘t lÃµi theo quy táº¯c thÃ©p:

NguyÃªn táº¯c Äá»™c tÃ´n (100% Single Voice):
* Trong 8 giÃ¢y cá»§a má»—i phÃ¢n cáº£nh, CHá»ˆ DUY NHáº¤T 01 CHá»¦ THá»‚ ÄÆ¯á»¢C PHÃ‰P Cáº¤T TIáº¾NG.

Báº£n Ä‘á»“ Thanh Ã¢m ThÃ­ch á»©ng (Adaptive Blueprint):
- Cháº¥t giá»ng (Timbre), Giá»ng Ä‘iá»‡u (Tone), Nhá»‹p Ä‘iá»‡u (Pacing), Vá»‹ trÃ­ (State: ON-SCREEN/OFF-SCREEN).

Lá»i thoáº¡i Ná»™i lá»±c (voice_text):
* Viáº¿t láº¡i lá»i thoáº¡i sÃºc tÃ­ch, mang Ä‘áº­m báº£n sáº¯c nhÃ¢n váº­t. Dung lÆ°á»£ng: Tuyá»‡t Ä‘á»‘i <40 tá»«.

ðŸŽ­ 3. EMOTIONAL ARC MAPPING (Má»šI V17)
Má»—i scene pháº£i cÃ³ emotional_intensity (1-10) vÃ  emotional_tag:
- 1-3: TÄ©nh láº·ng, chiÃªm nghiá»‡m (CALM)
- 4-6: Gá»£i má»Ÿ, dáº«n dáº¯t (BUILD)
- 7-8: Cao trÃ o cáº£m xÃºc (PEAK)
- 9-10: GiÃ¡c ngá»™, giáº£i thoÃ¡t (TRANSCEND)

ðŸ”‡ 4. SILENCE BEATS (KHOáº¢NG Láº¶NG CHIáº¾N LÆ¯á»¢C)
- ChÃ¨n silence_beat (0.3-0.8s) táº¡i cÃ¡c Ä‘iá»ƒm cáº£m xÃºc chuyá»ƒn giao
- TrÆ°á»›c lá»i dáº¡y quan trá»ng: 0.5s silence
- Sau cÃ¢u há»i tu tá»«: 0.3s silence
- Káº¿t thÃºc Ä‘oáº¡n cao trÃ o: 0.8s silence

ðŸŽµ 5. AUDIO LAYERING (3 Lá»šP Ã‚M THANH)
Má»—i scene pháº£i cÃ³ 3 lá»›p:
- LAYER_1_BED: Nháº¡c ná»n liÃªn tá»¥c (thiá»n, 432Hz, ambient)
- LAYER_2_ENV: Ã‚m thanh mÃ´i trÆ°á»ng ASMR (nÆ°á»›c, giÃ³, chim, chuÃ´ng)
- LAYER_3_PUNCTUATION: Äiá»ƒm nháº¥n cáº£m xÃºc (chuÃ´ng chÃ¹a, mÃµ, tiáº¿ng thá»Ÿ)

ðŸ”„ 6. VOICE TRANSITION RULES
- Chuyá»ƒn tá»« MALE â†’ FEMALE: ChÃ¨n tiáº¿ng chuÃ´ng giÃ³ nháº¹
- Chuyá»ƒn tá»« ON-SCREEN â†’ OFF-SCREEN: Fade nháº¡c ná»n lÃªn 20%
- Chuyá»ƒn section má»›i: Tiáº¿ng chuÃ´ng chÃ¹a hoáº·c tiáº¿ng mÃµ
- Káº¿t thÃºc video: Fade out dáº§n 3 giÃ¢y cuá»‘i

ðŸ“ 7. Äá»ŠNH Dáº NG Äáº¦U RA PHá»” QUÃT (MASTER OUTPUT JSON)
{
  "refined_scenes": [
    {
      "scene_number": 1,
      "voice_profile": {
        "speaker": "TÃªn nhÃ¢n váº­t",
        "gender": "MALE hoáº·c FEMALE",
        "age": "Sá»‘ tuá»•i hoáº·c nhÃ³m tuá»•i",
        "accent": "NORTHERN_VIETNAMESE / SOUTHERN_VIETNAMESE / EN-US / EN-UK",
        "timbre": "Cháº¥t giá»ng",
        "tone": "Giá»ng Ä‘iá»‡u",
        "pacing": "Nhá»‹p Ä‘iá»‡u",
        "pacing_speed": "1.18x",
        "state": "ON-SCREEN hoáº·c OFF-SCREEN"
      },
      "emotional_intensity": 7,
      "emotional_tag": "PEAK",
      "silence_beat": {"position": "before", "duration": "0.5s"},
      "audio_layers": {
        "layer_1_bed": "Nháº¡c thiá»n 432Hz nháº¹ nhÃ ng",
        "layer_2_env": "Tiáº¿ng suá»‘i cháº£y, chim hÃ³t xa xa",
        "layer_3_punctuation": "Tiáº¿ng chuÃ´ng chÃ¹a ngÃ¢n vang"
      },
      "voice_transition": "Fade nháº¡c ná»n, chÃ¨n tiáº¿ng chuÃ´ng giÃ³",
      "sfx_music_suggestion": "Äá» xuáº¥t chi tiáº¿t nháº¡c ná»n vÃ  ASMR/SFX",
      "voice_text": "Lá»i thoáº¡i duy nháº¥t cho scene nÃ y (dÆ°á»›i 40 tá»«)",
      "word_count": 35,
      "audio_end_time": "7.3s"
    }
  ]
}
LÆ¯U Ã JSON: Báº¯t buá»™c tráº£ vá» máº£ng refined_scenes chá»©a Ä‘á»§ sá»‘ lÆ°á»£ng scene cá»§a Ä‘áº§u vÃ o.`;

``n
### src/config/styles.js

`$ext
export const VISUAL_STYLES = [
  { id: 'ancient_stone_relic', name: 'ðŸª¨ ThÃ¡nh TÃ­ch Kháº¯c ÄÃ¡ (Hybrid)', desc: 'TÆ°á»£ng Ä‘Ã¡ cá»•, rÃªu phong, Ã¡nh sÃ¡ng huyá»n bÃ­', prompt_enforce: 'Visual Style: Ancient stone carved relic, moss-covered surfaces, volumetric temple light, weathered sacred textures.' },
  { id: 'molten_gold_nirvana', name: 'âœ¨ Niáº¿t BÃ n VÃ ng RÃ²ng (Hybrid)', desc: 'VÃ ng nung cháº£y, hÃ o quang giÃ¡c ngá»™', prompt_enforce: 'Visual Style: Molten gold liquid metal, divine radiance, nirvana glow, sacred golden illumination.' },
  { id: 'cosmic_yin_yang', name: 'ðŸŒ€ PhÃ¡p LuÃ¢n ThiÃªn HÃ  (Hybrid)', desc: 'VÅ© trá»¥ Ã¢m dÆ°Æ¡ng, cÃ¢n báº±ng nÄƒng lÆ°á»£ng', prompt_enforce: 'Visual Style: Cosmic dharma wheel galaxy, swirling nebula balance, celestial harmony, dark and light duality.' },
  { id: 'zen_ink_wash', name: 'ðŸƒ Kinh Diá»‡p Lá»¥c (Hybrid)', desc: 'LÃ¡ bá»“ Ä‘á» xanh, thiÃªn nhiÃªn tÄ©nh láº·ng', prompt_enforce: 'Visual Style: Sacred green bodhi leaf, nature serenity, zen minimalist, meditative emerald atmosphere.' },
  { id: 'lotus_ice', name: 'â„ï¸ BÄƒng HÃ³a LiÃªn Hoa (Hybrid)', desc: 'Hoa sen bÄƒng giÃ¡, tinh khiáº¿t, trong suá»‘t', prompt_enforce: 'Visual Style: Frozen ice lotus crystal, pure transparent petals, arctic sacred beauty, divine frost illumination.' },
  { id: 'tea_incense', name: 'ðŸ«– TrÃ  Äáº¡o KhÃ³i Tráº§m (Hybrid)', desc: 'TrÃ  Ä‘áº¡o, khÃ³i tráº§m hÆ°Æ¡ng, tÄ©nh táº¡i', prompt_enforce: 'Visual Style: Traditional tea ceremony, agarwood incense smoke wisps, warm amber candlelight, zen wooden interior.' },
  { id: 'paradise_flowers', name: 'ðŸŒº Kinh Váº¡n Hoa ThiÃªn Thai (Hybrid)', desc: 'Váº¡n hoa thiÃªn thai, cáº£nh tiÃªn, rá»±c rá»¡', prompt_enforce: 'Visual Style: Paradise of ten thousand flowers, celestial garden, divine floral abundance, heavenly botanical realm.' },
  { id: 'moonlit_lotus', name: 'ðŸª· Há»“ Sen TrÄƒng Ngá»c (Hybrid)', desc: 'Há»“ sen dÆ°á»›i Ã¡nh trÄƒng ngá»c bÃ­ch', prompt_enforce: 'Visual Style: Moonlit lotus pond, jade moonlight reflection, serene night water garden, sacred pearl luminescence.' },
  { id: 'terracotta_temple', name: 'ðŸº TÆ°á»£ng Äáº¥t Nung Thá»• (Hybrid)', desc: 'TÆ°á»£ng Ä‘áº¥t nung, gá»— má»™c, thiá»n mÃ´n', prompt_enforce: 'Visual Style: Terracotta clay sculpture, rustic earth tones, ancient temple warmth, handcrafted sacred pottery.' },
  { id: 'shadow_dance', name: 'ðŸŽ­ VÅ© Äiá»‡u BÃ³ng Ráº§m (Hybrid)', desc: 'MÃºa bÃ³ng, Ã¡nh sÃ¡ng vÃ  bÃ³ng tá»‘i huyá»n áº£o', prompt_enforce: 'Visual Style: Shadow puppet dance, dramatic light and dark interplay, silhouette spiritual performance, mysterious theatrical sacred art.' },
];

export const DHARMA_TOPICS = [
  { id: 'karma', label: 'âš–ï¸ Luáº­t NhÃ¢n Quáº£ (Karma Law)' },
  { id: 'mindfulness', label: 'ðŸ§˜ Thiá»n Äá»‹nh & TÄ©nh Thá»©c (Mindfulness)' },
  { id: 'compassion', label: 'ðŸ™ Tá»« Bi Há»· Xáº£ (Compassion & Love)' },
  { id: 'letting_go', label: 'ðŸƒ BuÃ´ng Bá» Phiá»n NÃ£o (Letting Go)' },
  { id: 'impermanence', label: 'ðŸŒŠ VÃ´ ThÆ°á»ng & DuyÃªn Sinh (Impermanence)' },
];

export const TOPIC_SUGGESTIONS = {
  karma: ['Lá»i Pháº­t dáº¡y vá» gieo nhÃ¢n gáº·t quáº£ hiá»n lÃ nh', 'CÃ¢u chuyá»‡n quáº£ bÃ¡o nhÃ£n tiá»n cá»§a sá»± háº­n thÃ¹', 'CÃ¡ch chuyá»ƒn hÃ³a nghiá»‡p xáº¥u báº±ng tÃ¬nh yÃªu thÆ°Æ¡ng', 'Háº¡t giá»‘ng lÃ nh sáº½ náº£y máº§m thÃ nh quáº£ ngá»t ngÃ o'],
  mindfulness: ['An trÃº trong giÃ¢y phÃºt hiá»‡n táº¡i tÄ©nh láº·ng', 'Quan sÃ¡t hÆ¡i thá»Ÿ dá»‹u Ãªm xoa dá»‹u lo Ã¢u', 'Thiá»n hÃ nh giá»¯a rá»«ng thÃ´ng ban mai sÆ°Æ¡ng má»', 'Láº¯ng nghe tiáº¿ng chuÃ´ng chÃ¹a vang vá»ng hÆ° khÃ´ng'],
  compassion: ['Bao dung cho lá»—i láº§m cá»§a ngÆ°á»i gieo cay Ä‘áº¯ng', 'Ãnh máº¯t tá»« bi sÆ°á»Ÿi áº¥m tÃ¢m há»“n láº¡nh giÃ¡', 'Ná»¥ cÆ°á»i hÃ²a Ã¡i xua tan bÃ³ng tá»‘i háº­n thÃ¹', 'HÃ nh Ä‘á»™ng nhá» cá»©u giÃºp chÃºng sinh hoáº¡n náº¡n'],
  letting_go: ['BuÃ´ng bá» nhá»¯ng muá»™n phiá»n quÃ¡ khá»© dÄ© vÃ£ng', 'Tha thá»© cho chÃ­nh mÃ¬nh Ä‘á»ƒ sá»‘ng Ä‘á»i an nhiÃªn', 'KhÃ´ng dÃ­nh máº¯c vÃ o danh lá»£i hÆ° áº£o tháº¿ gian', 'Nháº¹ nhÃ ng trÃºt bá» gÃ¡nh náº·ng Æ°u tÆ° cháº¥t chá»“ng'],
  impermanence: ['Nháº­n diá»‡n hoa ná»Ÿ rá»“i tÃ n nhÆ° quy luáº­t tá»± nhiÃªn', 'DuyÃªn Ä‘áº¿n thÃ¬ Ä‘Ã³n nháº­n duyÃªn Ä‘i thÃ¬ má»‰m cÆ°á»i', 'Cuá»™c sá»‘ng nhÆ° dÃ²ng nÆ°á»›c trÃ´i khÃ´ng ngá»«ng biáº¿n Ä‘á»•i', 'Cháº¥p nháº­n vÃ´ thÆ°á»ng Ä‘á»ƒ tháº¥y lÃ²ng bÃ¬nh yÃªn nháº¹ nhÃµm'],
};

``n
### src/modules/ScriptModule.jsx

`$ext
import { useState, useEffect, memo } from 'react';
import { callGemini } from '../utils/api';
import { showToast } from '../utils/toast';
import { MARKETS } from '../config/markets';
import { VISUAL_STYLES, DHARMA_TOPICS, TOPIC_SUGGESTIONS } from '../config/styles';
import { STYLE_SUGGEST_PROMPT, AUDIO_REFINE_PROMPT } from '../config/prompts';
import { UI_STRINGS } from '../config/i18n';
import SceneCard from '../components/SceneCard';

const SCRIPT_SYSTEM_PROMPT = `# SYSTEM ROLE: CREATIVE DIRECTOR FOR DHARMA & HEALING V2.0
Ban la chuyen gia viet kich ban, co nhiem vu sang tao noi dung chua lanh, triet ly nhan sinh, hoac truyen nhan qua Phat Giao mang tinh giao duc cao va an binh.

# TAM NHIN: Giao duc ve luat nhan qua, long tu bi va su tinh thuc, tao ra noi dung chua lanh co kha nang lan truyen (viral) manh me nhung van giu su ton nghiem.

# QUY Táº®C CHÃNH:
- Má»—i phÃ¢n cáº£nh 8 giÃ¢y CHá»ˆ ÄÆ¯á»¢C PHÃ‰P 01 GIá»ŒNG Äá»ŒC
- Lá»i thoáº¡i 30-40 tá»« má»—i cáº£nh, nhá»‹p Ä‘á»c cháº­m, truyá»n cáº£m
- Dialogues Báº®T BUá»˜C chá»‰ chá»©a ÄÃšNG 01 PHáº¦N Tá»¬
- Thoáº¡i PHáº¢I dá»©t Ä‘iá»ƒm á»Ÿ giÃ¢y 7.2 - 7.5
- Ghi nháº­n audio_end_time vÃ  word_count trong JSON

# SAFETY: Tuyá»‡t Ä‘á»‘i Cáº¤M báº¡o lá»±c, mÃ¡u me. Pháº£i tá»± Ä‘á»™ng "chuyá»ƒn hÃ³a" báº±ng triáº¿t lÃ½ nhÃ¢n quáº£.

# ðŸŽ¬ NARRATIVE ARC (Cáº¤U TRÃšC Ká»ŠCH Báº¢N Báº®T BUá»˜C):
PHáº¢I tuÃ¢n thá»§ cáº¥u trÃºc:
- HOOK (2-3 scenes): CÃ¢u há»i Ä‘au thÆ°Æ¡ng / tÃ¬nh huá»‘ng gÃ¢y tÃ² mÃ²
- PROBLEM (3-4 scenes): Kháº¯c há»a ná»—i khá»•, lo Ã¢u, máº¥t phÆ°Æ¡ng hÆ°á»›ng
- TEACHING (5-7 scenes): Triáº¿t lÃ½ Pháº­t PhÃ¡p, lá»i dáº¡y sÆ° tháº§y
- TRANSFORMATION (3-4 scenes): Chuyá»ƒn hÃ³a qua nhÃ¢n quáº£, tá»« bi
- RESOLUTION (2-3 scenes): Giáº£i thoÃ¡t, an láº¡c, káº¿t quáº£ tá»‘t lÃ nh
- CTA (1-2 scenes): KÃªu gá»i hÃ nh Ä‘á»™ng, subscribe, chia sáº»

# ðŸ‘¤ CHARACTER ARCHETYPE SYSTEM:
Má»—i nhÃ¢n váº­t recurring PHáº¢I cÃ³ CHARACTER_LOCK nháº¥t quÃ¡n xuyÃªn suá»‘t:
- Giá»›i tÃ­nh, tuá»•i, vÃ¹ng miá»n (Northern/Southern Vietnamese)
- Trang phá»¥c, nÃ©t Ä‘áº·c trÆ°ng khuÃ´n máº·t
- Vai trÃ²: Thiá»n sÆ° / Ni sÆ° / Pháº­t tá»­ tráº» / NgÆ°á»i dáº«n truyá»‡n
KhÃ´ng Ä‘Æ°á»£c thay Ä‘á»•i ngoáº¡i hÃ¬nh nhÃ¢n váº­t giá»¯a cÃ¡c scenes.

# ðŸŽ¥ CAMERA VOCABULARY:
Má»—i video_prompt PHáº¢I báº¯t Ä‘áº§u báº±ng CAMERA_TYPE + CAMERA_MOVEMENT:
Camera Types: CLOSE-UP SHOT | MEDIUM SHOT | WIDE SHOT | EXTREME CLOSE-UP | OVER-THE-SHOULDER
Camera Movements: STATIC | SLOW PAN LEFT | SLOW PAN RIGHT | GENTLE DOLLY IN | GENTLE DOLLY OUT | CRANE UP | CRANE DOWN | STEADICAM ORBIT | SUBTLE PARALLAX | AERIAL DESCENT

# ðŸ›¡ï¸ ANATOMY SAFEGUARD (QUAN TRá»ŒNG â€” PHÃ‚N BIá»†T 2 LOáº I SCENE):

## Scene CÃ“ NGÆ¯á»œI (human subjects):
ThÃªm vÃ o cuá»‘i video_prompt VÃ€ image_prompt: "(perfect human anatomy:1.2), exactly two arms, exactly two legs, perfect hands."
ThÃªm [HUMAN-SHIELD]: Perfect limb separation, no clipping or hand fusion. Strict frame-to-frame clothing consistency. Perfect facial symmetry, identical symmetric circular pupils. Strict character count persistence, no ghost characters.

## Scene KHÃ”NG CÃ“ NGÆ¯á»œI (thiÃªn nhiÃªn, váº­t thá»ƒ, biá»ƒu tÆ°á»£ng nhÆ° hoa sen, cÃ¢y cá»‘i, sÃ³ng biá»ƒn, háº¡t giá»‘ng, phÃ¡p luÃ¢n, ngá»n náº¿n, dÃ²ng suá»‘i, con Ä‘Æ°á»ng):
TUYá»†T Äá»I KHÃ”NG thÃªm anatomy tags hoáº·c "exactly two arms/legs".
ThÃªm [NATURE-SHIELD]: Sharp object borders, static directional lighting. Permanently static background props. Organic natural movement only.

# ðŸ“ UNIFIED VIDEO PROMPT FORMAT (Báº®T BUá»˜C cho Má»ŒI scene):
[[CAMERA_TYPE, CAMERA_MOVEMENT], SUBJECT_DESCRIPTION. PRIMARY_ACTION + 2-3 SECONDARY_DETAILS. LIGHTING_DIRECTIVE. {style_keywords}. [HUMAN-SHIELD hoáº·c NATURE-SHIELD]. ABSOLUTE TEMPORAL COHERENCE. ABSOLUTELY ZERO TEXT, letters, watermarks, or graphic overlays. [ASPECT RATIO LOCK]: Strictly FULL FRAME, NO black bars. ANATOMY_TAGS_Náº¾U_CÃ“_NGÆ¯á»œI.]

# ðŸ“¸ IMAGE PROMPT (Báº®T BUá»˜C cho Má»ŒI scene â€” KHÃ”NG ÄÆ¯á»¢C Äá»‚ TRá»NG):
Má»—i scene PHáº¢I cÃ³ image_prompt riÃªng biá»‡t, format:
- Bá» camera movement, chá»‰ giá»¯ mÃ´ táº£ tÄ©nh
- Bá» temporal coherence (áº£nh tÄ©nh khÃ´ng cáº§n)
- Bá» AUTO-SHIELD block
- ThÃªm suffix "--no failsafe" cho áº£nh
- ThÃªm "(perfect human anatomy:1.2), exactly two arms, exactly two legs, perfect hands" Náº¾U CÃ“ NGÆ¯á»œI
- KHÃ”NG thÃªm anatomy tags náº¿u lÃ  cáº£nh thiÃªn nhiÃªn/váº­t thá»ƒ
- Format: "[MÃ” Táº¢ CHá»¦ THá»‚]. [Bá»I Cáº¢NH]. [ÃNH SÃNG]. --no failsafe, (perfect human anatomy:1.2), exactly two arms, exactly two legs, perfect hands." (náº¿u cÃ³ ngÆ°á»i)
- Format: "[MÃ” Táº¢ CHá»¦ THá»‚]. [Bá»I Cáº¢NH]. [ÃNH SÃNG]. --no failsafe" (náº¿u khÃ´ng cÃ³ ngÆ°á»i)

# ðŸŽµ SFX/MUSIC TAXONOMY (3 Lá»šP):
Má»—i scene PHáº¢I cÃ³ sfx_music_suggestion vá»›i 3 lá»›p:
- LAYER 1 (Ambient Bed): Nháº¡c thiá»n, táº§n sá»‘ 432Hz/528Hz, ambient drone
- LAYER 2 (Environmental ASMR): NÆ°á»›c cháº£y, giÃ³, chim, chuÃ´ng, mÆ°a, sÃ³ng biá»ƒn
- LAYER 3 (Emotional Punctuation): ChuÃ´ng chÃ¹a, mÃµ, tiáº¿ng thá»Ÿ, im láº·ng chiáº¿n lÆ°á»£c

OUTPUT JSON with: mode_detected, suggested_style, style_reason, character_lock_prompt, script[] with scene_number, time, section, character, dialogues[], voice_profile, voice_text, word_count, audio_end_time, visual_desc_vi, sfx_music_suggestion, pacing_score, pacing_warning, video_prompt, image_prompt, strategy_note, coppa_disclaimer.`;

export default function ScriptModule({ onScriptGenerated, onAudioRefined, initialTopic = '', uiLang, market, onMarketChange }) {
  const [topic, setTopic] = useState(initialTopic);
  const [durationStr, setDurationStr] = useState('1');
  const [style, setStyle] = useState('auto');
  const [dharmaTopic, setDharmaTopic] = useState('karma');
  const [charMode, setCharMode] = useState('dialogue');
  const [loading, setLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [segments, setSegments] = useState([]);
  const [scriptMeta, setScriptMeta] = useState(null);
  const [styleSuggestion, setStyleSuggestion] = useState(null);
  const [loadingStyle, setLoadingStyle] = useState(false);
  const [refining, setRefining] = useState(false);
  const [refineCount, setRefineCount] = useState(0);
  const t = UI_STRINGS[uiLang];

  const loadingMsgs = uiLang === 'vi'
    ? ['Äang phÃ¢n tÃ­ch triáº¿t lÃ½...', 'Äang thiáº¿t láº­p bá»™ lá»c tÃ´n nghiÃªm...', 'Äang dá»‡t há»™i thoáº¡i tÄ©nh táº¡i...', 'Äang tinh chá»‰nh nhá»‹p Ä‘á»™ (Pacing)...']
    : ['Analyzing philosophy...', 'Setting solemn filters...', 'Weaving peaceful dialogues...', 'Refining pacing...'];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) { setMsgIdx(0); timer = setInterval(() => setMsgIdx(i => (i + 1) % loadingMsgs.length), 3000); }
    return () => clearInterval(timer);
  }, [loading, uiLang]);

  useEffect(() => { if (initialTopic) { setTopic(initialTopic); setSegments([]); setScriptMeta(null); } }, [initialTopic]);

  const duration = parseFloat(durationStr) || 1;
  const sceneCount = Math.ceil(Math.max(0.1, duration) * 60 / 8);
  const wordCount = Math.floor(duration * (duration < 3 ? 130 : duration <= 10 ? 140 : 120));

  const suggestStyle = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Nháº­p chá»§ Ä‘á» trÆ°á»›c!' : 'Enter topic first!');
    setLoadingStyle(true);
    try {
      const res = await callGemini(`CHá»¦ Äá»€: "${topic}"\n\nHÃ£y Ä‘á» xuáº¥t phong cÃ¡ch visual phÃ¹ há»£p nháº¥t.`, STYLE_SUGGEST_PROMPT(uiLang));
      setStyleSuggestion(res);
      if (res.recommended_style) {
        setStyle(res.recommended_style);
        showToast(`${uiLang === 'vi' ? 'AI Ä‘á» xuáº¥t' : 'AI Suggests'}: ${VISUAL_STYLES.find(s => s.id === res.recommended_style)?.name || res.recommended_style}`, 'success');
      }
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoadingStyle(false); }
  };

  const generate = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Vui lÃ²ng nháº­p chá»§ Ä‘á»!' : 'Please enter a topic!');
    setSegments([]); setScriptMeta(null); setStyleSuggestion(null); setRefineCount(0); setLoading(true);
    setBatchProgress({ current: 0, total: 0 });
    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mkt = MARKETS[market] || MARKETS.vn_dharma;
      let styleName = styleObj?.name || 'Auto';
      const topicObj = DHARMA_TOPICS.find(dt => dt.id === dharmaTopic);
      const suggestions = TOPIC_SUGGESTIONS[dharmaTopic] || ['Trong chÃ¡nh niá»‡m'];
      const microCtx = suggestions[Math.floor(Math.random() * suggestions.length)];
      styleName += ` - DHARMA TOPIC: ${topicObj?.label}. MICRO-CONTEXT (CRITICAL): ${microCtx}.`;

      const seed = Math.floor(Math.random() * 1000000);
      const characterPrompt = charMode === 'monologue'
        ? `\n\n[CHARACTER MODE: MONOLOGUE (1 NGUOI NÃ“I XUYÃŠN SUá»T)]\n- ToÃ n bá»™ ká»‹ch báº£n CHá»ˆ CÃ“ DUY NHáº¤T 1 nhÃ¢n váº­t/giá»ng Ä‘á»c nÃ³i xuyÃªn suá»‘t toÃ n bá»™ phÃ¢n cáº£nh (vÃ­ dá»¥: NgÆ°á»i dáº«n chuyá»‡n hoáº·c Thiá»n sÆ°).\n- Giá»ng Ä‘á»c mang tÃ­nh Ä‘á»™c thoáº¡i, tá»± sá»±, chiÃªm nghiá»‡m sÃ¢u sáº¯c.\n- Báº¯t buá»™c ghi nháº­n duy nháº¥t 1 nhÃ¢n váº­t trong trÆ°á»ng "character" cá»§a toÃ n bá»™ phÃ¢n cáº£nh.`
        : `\n\n[CHARACTER MODE: DIALOGUE (2 NHÃ‚N Váº¬T THAY PHIÃŠN)]\n- Ká»‹ch báº£n lÃ  cuá»™c Ä‘á»‘i thoáº¡i sinh Ä‘á»™ng hoáº·c luÃ¢n phiÃªn nÃ³i giá»¯a 2 nhÃ¢n váº­t xuyÃªn suá»‘t (vÃ­ dá»¥: Há»c trÃ²/Pháº­t tá»­ tráº» lo Ã¢u vÃ  Thiá»n sÆ°/SÆ° tháº§y tÄ©nh táº¡i).\n- Pháº£i cÃ³ sá»± phÃ¢n chia giá»ng Ä‘á»c rÃµ rÃ ng giá»¯a 2 nhÃ¢n váº­t á»Ÿ cÃ¡c phÃ¢n cáº£nh Ä‘á»ƒ táº¡o cáº¥u trÃºc Ä‘á»‘i thoáº¡i sinh Ä‘á»™ng (vÃ­ dá»¥: Há»c trÃ² há»i á»Ÿ Hook/Problem, SÆ° tháº§y giáº£ng á»Ÿ Teaching/Transformation).`;

      const BATCH_SIZE = 25;
      const totalBatches = Math.ceil(sceneCount / BATCH_SIZE);
      let allSegments = [];
      let currentStyle = '';

      const safeString = (val) => typeof val === 'object' && val !== null ? JSON.stringify(val) : val;

      for (let i = 0; i < totalBatches; i++) {
        setBatchProgress({ current: i + 1, total: totalBatches });
        const startScene = i * BATCH_SIZE + 1;
        const endScene = Math.min((i + 1) * BATCH_SIZE, sceneCount);
        
        const expectedCount = endScene - startScene + 1;
        let batchPrompt = `\n\n[BATCH MODE GENERATION (CRITICAL)]: ÄÃ‚Y LÃ€ PHáº¦N ${i+1}/${totalBatches}. Báº N Báº®T BUá»˜C PHáº¢I Táº O CHÃNH XÃC ${expectedCount} Cáº¢NH (tá»« cáº£nh sá»‘ ${startScene} Ä‘áº¿n cáº£nh sá»‘ ${endScene}) trong tá»•ng sá»‘ ${sceneCount} cáº£nh. VIá»†C Táº O THIáº¾U Cáº¢NH LÃ€ Lá»–I Ráº¤T NGHIÃŠM TRá»ŒNG! Tráº£ vá» máº£ng JSON chá»©a ÄÃšNG ${expectedCount} cáº£nh nÃ y. Má»–I Cáº¢NH PHáº¢I CÃ“ Äáº¦Y Äá»¦ CHI TIáº¾T (Tuyá»‡t Ä‘á»‘i khÃ´ng Ä‘Æ°á»£c viáº¿t táº¯t, khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng trÆ°á»ng dialogues, voice_text, video_prompt, visual_desc_vi).`;

        if (allSegments.length > 0) {
          const lastScenes = allSegments.slice(-3).map(s => ({
            scene_number: s.scene_number,
            section: s.section,
            visual_desc: s.visual_desc_vi || s.visual_desc,
            voice_text: s.voice_text || (s.dialogues && s.dialogues[0] && s.dialogues[0].line) || ''
          }));
          
          batchPrompt += `\n\n[CONTINUITY CONTEXT]: The story has already progressed through the first ${allSegments.length} scenes. Here are the last 3 scenes for context:\n${JSON.stringify(lastScenes, null, 2)}\n\nCRITICAL: You MUST write the next scenes continuing this exact storyline seamlessly starting at Scene ${startScene}. Do NOT repeat these scene contents, move the story forward.`;
        }

        const res = await callGemini(
          `TOPIC: "${topic}"\nDURATION: ${duration}m\nSCENE_COUNT: ${sceneCount}\nTARGET_MARKET: ${mkt.name}\nNATIVE_LANGUAGE: ${mkt.voice_lang}\nCULTURAL_CONTEXT: ${mkt.culture}\nVISUAL_STYLE: ${styleName}\n[ANTI-REPETITION SEED]: ${seed}${characterPrompt}${batchPrompt}\n\nCRITICAL INSTRUCTION:\n1. Write VOICE_TEXT and DIALOGUES in "${mkt.voice_lang}"\n2. DO NOT just translate from Vietnamese.\n3. GENERATE JSON OBJECT.`,
          SCRIPT_SYSTEM_PROMPT
        );

        let segs = res.script || (Array.isArray(res) ? res : []);
        if (!Array.isArray(segs)) segs = [];

        segs = segs.map(s => ({
          ...s,
          visual_desc_vi: safeString(s.visual_desc_vi),
          visual_desc: safeString(s.visual_desc),
          sfx_music_suggestion: safeString(s.sfx_music_suggestion),
          section: safeString(s.section),
          voice_text: safeString(s.voice_text),
          chapter_voice_block: safeString(s.chapter_voice_block),
          pacing_warning: safeString(s.pacing_warning)
        }));

        if (styleObj && styleObj.id !== 'auto' && styleObj.prompt_enforce) {
          segs = segs.map(s => ({
            ...s,
            video_prompt: typeof s.video_prompt === 'string' && s.video_prompt.includes('Visual Style:') ? s.video_prompt : `${safeString(s.video_prompt) || ''} ${styleObj.prompt_enforce}`,
            image_prompt: typeof s.image_prompt === 'string' && s.image_prompt.includes('Visual Style:') ? s.image_prompt : `${safeString(s.image_prompt) || ''} ${styleObj.prompt_enforce}`,
          }));
        }

        if (i === 0) {
          setScriptMeta(res);
          currentStyle = res.suggested_style || '';
        }

        allSegments = [...allSegments, ...segs];
        setSegments([...allSegments]);
      }
      
      onScriptGenerated(allSegments, currentStyle, topic);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); setBatchProgress({ current: 0, total: 0 }); }
  };

  const refineAudio = async () => {
    if (!segments.length) return showToast(uiLang === 'vi' ? 'ChÆ°a cÃ³ ká»‹ch báº£n!' : 'No script!');
    setRefining(true);
    try {
      const input = segments.map(s => ({
        scene_number: s.scene_number, voice_text: s.voice_text || s.chapter_voice_block || '',
        visual_context: s.visual_desc_vi || s.visual_desc || '', section: s.section || '', character: s.character || '', time: s.time || '',
      }));
      const res = await callGemini(
        `Ká»ŠCH Báº¢N Gá»C (${input.length} scenes):\n${JSON.stringify(input, null, 2)}\n\nTINH CHá»ˆNH THANH Ã‚M CHO Táº¤T Cáº¢ ${input.length} SCENES. RESPOND IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.`,
        AUDIO_REFINE_PROMPT
      );
      if (res?.refined_scenes) {
        const updated = segments.map((s, i) => {
          const r = res.refined_scenes.find(r => r.scene_number === s.scene_number) || res.refined_scenes[i];
          return r ? { ...s, voice_text: r.voice_text || s.voice_text, voice_profile: r.voice_profile || null } : s;
        });
        setSegments(updated);
        onAudioRefined?.(updated, topic);
        setRefineCount(c => c + 1);
        showToast(uiLang === 'vi' ? 'ðŸŽ™ï¸ Thanh Ã¢m Ä‘Ã£ Ä‘Æ°á»£c tinh chá»‰nh thÃ nh cÃ´ng!' : 'ðŸŽ™ï¸ Audio refined!', 'success');
      }
    } catch (e) { showToast(`Audio Error: ${e.message}`, 'error'); }
    finally { setRefining(false); }
  };

  const handleOpenProject = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result);
        if (data.segments) {
          setTopic(data.topic || '');
          setSegments(data.segments);
          onScriptGenerated(data.segments, 'auto', data.topic || '');
          showToast(t.common.copied, 'success');
        }
      } catch { showToast('Error reading file', 'error'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><i className="fa-solid fa-om text-teal-500" /> {t.script.title}</span>
          <label className="cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-900/20 text-amber-300 border border-amber-500/30 hover:bg-amber-900/40 transition-all flex items-center gap-2">
            <i className="fa-solid fa-folder-open" /> {uiLang === 'vi' ? 'Má»Ÿ Dá»± Ãn' : 'Open Project'}
            <input type="file" accept=".json" className="hidden" onChange={handleOpenProject} />
          </label>
        </h2>

        <div className="space-y-4">
          {/* Topic input */}
          <div className="relative mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">{uiLang === 'vi' ? 'Chá»§ Äá» Truyá»‡n' : 'Story Topic'}</label>
            <div className="flex gap-2">
              <input value={topic} onChange={e => { setTopic(e.target.value); if (!e.target.value.trim()) { setSegments([]); setScriptMeta(null); } }}
                className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-teal-500/50 placeholder-slate-600"
                placeholder={uiLang === 'vi' ? 'VD: Luáº­t nhÃ¢n quáº£, An trÃº hiá»‡n táº¡i, BuÃ´ng bá» phiá»n nÃ£o...' : 'e.g., Karma law, Living in the present...'} />
              <button onClick={suggestStyle} disabled={loadingStyle || !topic}
                className="px-4 py-2 bg-amber-900/30 hover:bg-amber-800/40 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
                {loadingStyle ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Äang phÃ¢n tÃ­ch...' : 'Analyzing...'}</>
                  : <><i className="fa-solid fa-wand-magic-sparkles" /> {uiLang === 'vi' ? 'AI Äá» Xuáº¥t Style' : 'AI Suggest Style'}</>}
              </button>
            </div>
          </div>

          {/* Duration & Market */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
              <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
                <i className="fa-solid fa-clock text-teal-400" /> {uiLang === 'vi' ? 'THá»œI LÆ¯á»¢NG (PHÃšT)' : 'DURATION (MINS)'}
              </label>
              <div className="flex items-center gap-5">
                <input type="text" inputMode="numeric" value={durationStr} onChange={e => setDurationStr(e.target.value.replace(/[^0-9.]/g, ''))}
                  onBlur={() => { const v = parseFloat(durationStr); setDurationStr(v > 0 ? String(v) : '1'); }}
                  className="w-20 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-2xl font-black text-white text-center outline-none" />
                <div className="flex flex-col gap-1.5 text-xs">
                  <div><span className="text-slate-500">{uiLang === 'vi' ? 'Sá»‘ cáº£nh' : 'Scenes'}:</span> <span className="font-bold text-green-400 text-base">~{sceneCount}</span></div>
                  <div><span className="text-slate-500">Voice:</span> <span className="font-bold text-teal-400 text-base">~{wordCount} {uiLang === 'vi' ? 'tá»«' : 'words'}</span></div>
                </div>
              </div>
            </div>
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                <i className="fa-solid fa-globe text-amber-400" /> {uiLang === 'vi' ? 'THá»Š TRÆ¯á»œNG' : 'MARKET'}
              </label>
              <select value={market} onChange={e => onMarketChange(e.target.value)}
                className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {Object.values(MARKETS).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}
              </select>
            </div>
          </div>

          {/* Dharma topic & Character Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-teal-400 uppercase mb-2 block flex items-center gap-2">
                <i className="fa-solid fa-leaf text-teal-400" /> {uiLang === 'vi' ? 'CHá»ŒN PHÃ‚N NGÃCH PHáº¬T PHÃP' : 'DHARMA SUB-TOPIC'}
              </label>
              <select value={dharmaTopic} onChange={e => setDharmaTopic(e.target.value)}
                className="w-full bg-[#0a0e14] border border-teal-500/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {DHARMA_TOPICS.map(dt => <option key={dt.id} value={dt.id}>{dt.label}</option>)}
              </select>
            </div>

            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                <i className="fa-solid fa-users text-amber-400" /> {uiLang === 'vi' ? 'Sá» LÆ¯á»¢NG NHÃ‚N Váº¬T' : 'NUMBER OF CHARACTERS'}
              </label>
              <div className="flex bg-[#0a0e14] p-1 rounded-lg border border-slate-700/50">
                <button type="button" onClick={() => setCharMode('monologue')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all ${charMode === 'monologue' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border border-transparent text-slate-400 hover:text-slate-200'}`}>
                  <i className="fa-solid fa-user" /> {uiLang === 'vi' ? '1 NhÃ¢n Váº­t (XuyÃªn Suá»‘t)' : '1 Character (Monologue)'}
                </button>
                <button type="button" onClick={() => setCharMode('dialogue')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all ${charMode === 'dialogue' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border border-transparent text-slate-400 hover:text-slate-200'}`}>
                  <i className="fa-solid fa-users" /> {uiLang === 'vi' ? '2 NhÃ¢n Váº­t (Thay PhiÃªn)' : '2 Characters (Dialogue)'}
                </button>
              </div>
            </div>
          </div>

          {/* Visual styles */}
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
              <i className="fa-solid fa-palette text-pink-400" /> {uiLang === 'vi' ? 'PHONG CÃCH NGHá»† THUáº¬T' : 'VISUAL STYLE'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto pr-2">
              <div onClick={() => setStyle('auto')}
                className={`cursor-pointer p-3 rounded-xl border flex items-center justify-center text-center transition-all ${style === 'auto' ? 'bg-pink-900/40 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-white' : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'}`}>
                <div className="text-sm font-bold"><i className="fa-solid fa-wand-magic-sparkles mb-1 block text-lg" /> Auto AI</div>
              </div>
              {VISUAL_STYLES.map(s => (
                <div key={s.id} onClick={() => setStyle(s.id)} title={s.desc}
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${style === s.id ? 'bg-pink-900/40 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)] text-white' : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'}`}>
                  <div className="text-xs font-bold leading-tight">{s.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button onClick={generate} disabled={loading || refining}
            className="w-full py-4 bg-teal-900/50 hover:bg-teal-800/50 border border-teal-500/30 text-teal-100 font-bold rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> {batchProgress.total > 0 ? (uiLang === 'vi' ? `Äang táº¡o pháº§n ${batchProgress.current}/${batchProgress.total}...` : `Generating batch ${batchProgress.current}/${batchProgress.total}...`) : loadingMsgs[msgIdx]}</>
              : <><i className="fa-solid fa-paper-plane" /> {uiLang === 'vi' ? 'KIáº¾N Táº O Ká»ŠCH Báº¢N CHá»®A LÃ€NH' : 'GENERATE HEALING SCRIPT'}</>}
          </button>

          {/* Refine audio button */}
          {segments.length > 0 && (
            <button onClick={refineAudio} disabled={loading || refining}
              className="w-full py-3.5 bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/30 text-purple-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {refining ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Äang tinh chá»‰nh Ã¢m thanh...' : 'Refining audio...'}</>
                : <><i className="fa-solid fa-headphones-simple" /> {uiLang === 'vi' ? 'ðŸŽ™ï¸ TINH CHá»ˆNH THANH Ã‚M (V16.0)' : 'ðŸŽ™ï¸ AUDIO RE-ENGINEERING (V16.0)'}
                  <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-black">+{refineCount}</span></>}
            </button>
          )}
        </div>
      </div>

      {/* Scene cards */}
      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          <div className="flex justify-between items-center px-2">
            <div className="text-xs text-slate-500 font-bold">{uiLang === 'vi' ? `ÄÃ£ táº¡o: ${segments.length} phÃ¢n Ä‘oáº¡n` : `Generated: ${segments.length} segments`}</div>
            <button onClick={() => {
              const text = segments.map(s => s.chapter_voice_block || s.voice_text).join('\n\n');
              navigator.clipboard.writeText(text);
              showToast(t.common.copied, 'success');
            }} className="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200">
              <i className="fa-solid fa-copy" /> {uiLang === 'vi' ? 'Copy Voice ToÃ n Bá»™' : 'Copy Voice All'}
            </button>
          </div>
          {segments.map((seg, i) => <SceneCard key={i} seg={seg} idx={i} uiLang={uiLang} />)}
        </div>
      )}
    </div>
  );
}

``n
### src/modules/SEOModule.jsx

`$ext
import { useState, useEffect } from 'react';
import { callGemini, generateImage } from '../utils/api';
import { showToast } from '../utils/toast';
import { MARKETS } from '../config/markets';
import { SEO_PROMPT } from '../config/prompts';
import { UI_STRINGS, SEO_CHECKLIST } from '../config/i18n';

export default function SEOModule({ market = 'vn_dharma', initialTopic = '', uiLang }) {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState({});
  const [thumbImgs, setThumbImgs] = useState({});
  const t = UI_STRINGS[uiLang];

  useEffect(() => { if (initialTopic) setTopic(initialTopic); }, [initialTopic]);

  const copy = (text) => { navigator.clipboard.writeText(text); showToast(t.common.copied, 'success'); };

  const analyze = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Nháº­p chá»§ Ä‘á» SEO!' : 'Enter SEO topic!');
    setLoading(true);
    try {
      const mkt = MARKETS[market] || MARKETS.vn_dharma;
      setResult(await callGemini(
        `TOPIC: "${topic}"\nTARGET_LANGUAGE: ${mkt.voice_lang}\nTARGET_MARKET: ${mkt.name}\nRESPOND ALL TEXT FIELDS IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.\nGENERATE JSON.`,
        SEO_PROMPT
      ));
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  };

  const genThumb = async (prompt, idx) => {
    setThumbImgs(p => ({ ...p, [idx]: { loading: true } }));
    try {
      const url = await generateImage(prompt, '16:9');
      if (url) { setThumbImgs(p => ({ ...p, [idx]: { url, loading: false } })); showToast('ÄÃ£ táº¡o áº£nh!', 'success'); }
    } catch (e) { setThumbImgs(p => ({ ...p, [idx]: { loading: false } })); showToast(e.message, 'error'); }
  };

  const exportSEO = () => {
    if (!result) return;
    let txt = `=== SEO PACK: ${topic.toUpperCase()} ===\n\n`;
    if (result.keywords) {
      txt += '1. KEYWORDS\n';
      ['primary','secondary','long_tail'].forEach(k => { if (result.keywords[k]) txt += `- ${k}: ${result.keywords[k].join(', ')}\n`; });
    }
    if (result.hashtags) txt += `\n2. HASHTAGS\n${result.hashtags.join(' ')}\n`;
    if (result.viral_titles) { txt += '\n3. TITLES\n'; result.viral_titles.forEach((title,i) => { txt += `${i+1}. ${title}\n`; }); }
    if (result.video_description?.full_description) txt += `\n4. DESCRIPTION\n${result.video_description.full_description}\n`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
    a.download = `${(topic||'seo').replace(/\s+/g,'_')}_seo.txt`; a.click();
    showToast('ÄÃ£ táº£i!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-leaf text-amber-500" /> {t.seo.title}
        </h2>
        <div className="flex gap-2 md:gap-4 mb-6 flex-col sm:flex-row">
          <input value={topic} onChange={e => setTopic(e.target.value)}
            className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600"
            placeholder={uiLang === 'vi' ? 'Nháº­p chá»§ Ä‘á» video chá»¯a lÃ nh...' : 'Enter topic...'} />
          <button onClick={analyze} disabled={loading}
            className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 shrink-0">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang==='vi'?'ÄANG Tá»I Æ¯U...':'OPTIMIZING...'}</>
              : <><i className="fa-solid fa-magic" /> {uiLang==='vi'?'Tá»‘i Æ¯u SEO':'Optimize SEO'}</>}
          </button>
          {result && <button onClick={exportSEO} className="px-4 py-3 bg-teal-900/40 border border-teal-500/30 text-teal-300 font-bold rounded-lg flex items-center gap-2 shrink-0">
            <i className="fa-solid fa-download" /> {uiLang==='vi'?'Táº£i SEO':'Export'}
          </button>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><i className="fa-solid fa-check-square" /> CHECKLIST</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {Object.entries(SEO_CHECKLIST).map(([cat, items]) => (
                <div key={cat} className="bg-[#12161e]/50 rounded-lg p-3 border border-slate-700/30">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">{cat}</div>
                  <div className="space-y-2">
                    {items.map(item => (
                      <label key={item.id} className="flex items-start gap-2 cursor-pointer group" onClick={() => setChecked(p => ({...p, [item.id]: !p[item.id]}))}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${checked[item.id] ? 'bg-amber-500 border-amber-500' : 'border-slate-600 bg-[#0a0e14]'}`}>
                          {checked[item.id] && <i className="fa-solid fa-check text-white text-[10px]" />}
                        </div>
                        <span className={`text-xs ${checked[item.id] ? 'text-slate-500 line-through' : 'text-slate-400 group-hover:text-white'}`}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? <>
              {result.keywords && (
                <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase">ðŸ”‘ KEYWORDS</h4>
                  {['primary','secondary','long_tail'].map(k => Array.isArray(result.keywords[k]) && (
                    <div key={k} className="mb-2">
                      <div className="text-[10px] text-slate-400 mb-1 font-bold">{k}</div>
                      <div className="flex flex-wrap gap-1">{result.keywords[k].map((w,i) => <span key={i} className="bg-amber-900/20 text-amber-200 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/20">{w}</span>)}</div>
                    </div>
                  ))}
                </div>
              )}
              {Array.isArray(result.hashtags) && (
                <div className="bg-teal-900/10 border border-teal-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-teal-400 mb-3 uppercase">#ï¸âƒ£ HASHTAGS</h4>
                  <div className="flex flex-wrap gap-2">{result.hashtags.map((h,i) => <button key={i} onClick={() => copy(h)} className="bg-teal-900/20 text-teal-300 px-3 py-1 rounded-lg text-sm border border-teal-500/20 hover:bg-teal-900/30">{h}</button>)}</div>
                  <button onClick={() => copy(result.hashtags.join(' '))} className="mt-2 text-xs text-teal-400 hover:underline"><i className="fa-solid fa-copy" /> Copy All</button>
                </div>
              )}
              {Array.isArray(result.viral_titles) && (
                <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase">âš¡ VIRAL TITLES</h4>
                  <div className="space-y-2">{result.viral_titles.map((title,i) => (
                    <div key={i} className="flex justify-between items-center bg-[#0a0e14] p-2 rounded border border-slate-700/30">
                      <span className="text-sm text-white font-medium flex-1">{i+1}. {title}</span>
                      <button onClick={() => copy(title)} className="text-slate-500 hover:text-white ml-2"><i className="fa-solid fa-copy" /></button>
                    </div>
                  ))}</div>
                </div>
              )}
              {result.video_description?.full_description && (
                <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-green-400 mb-3 uppercase">ðŸ“ DESCRIPTION</h4>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{result.video_description.full_description}</p>
                  <button onClick={() => copy(result.video_description.full_description)} className="mt-2 text-xs text-green-400 hover:underline"><i className="fa-solid fa-copy" /> Copy</button>
                </div>
              )}
              {Array.isArray(result.thumbnail_suggestions) && (
                <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-purple-400 mb-3 uppercase"><i className="fa-solid fa-image" /> THUMBNAIL</h4>
                  <div className="space-y-4">{result.thumbnail_suggestions.map((th,i) => (
                    <div key={i} className="bg-[#0a0e14]/80 p-4 rounded-lg border border-purple-500/20">
                      <h5 className="text-sm font-bold text-white mb-2">{th.concept_name}</h5>
                      <div className="text-xs space-y-1 mb-3">
                        <div><span className="text-purple-400 font-bold">Text:</span> <span className="text-white bg-red-900/30 px-2 py-0.5 rounded font-black border border-red-500/30">{th.text_on_image}</span></div>
                        <div><span className="text-purple-400 font-bold">Visual:</span> <span className="text-slate-300">{th.visual_concept}</span></div>
                      </div>
                      {thumbImgs[i]?.url ? <img src={thumbImgs[i].url} className="w-full rounded-lg border border-purple-500/30 aspect-video object-cover" />
                        : <button onClick={() => genThumb(th.ai_image_prompt, i)} disabled={thumbImgs[i]?.loading}
                          className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-300 font-bold rounded-lg text-xs flex items-center justify-center gap-2 disabled:opacity-50">
                          {thumbImgs[i]?.loading ? <><i className="fa-solid fa-sync animate-spin" /> Äang Váº½...</> : <><i className="fa-solid fa-palette" /> Váº½ áº¢nh AI</>}
                        </button>}
                    </div>
                  ))}</div>
                </div>
              )}
            </> : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/20 border border-slate-700/30 border-dashed rounded-xl">
                <i className="fa-solid fa-seedling mb-2 opacity-50" />
                <p className="text-sm">{uiLang === 'vi' ? 'Nháº­p chá»§ Ä‘á» Ä‘á»ƒ phÃ¢n tÃ­ch' : 'Enter topic to analyze'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

``n
### src/modules/SpyModule.jsx

`$ext
import { useState } from 'react';
import { callGemini, fetchYouTubeData } from '../utils/api';
import { showToast } from '../utils/toast';
import { SPY_PROMPT } from '../config/prompts';
import { UI_STRINGS } from '../config/i18n';

export default function SpyModule({ onUseStrategy, uiLang }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const t = UI_STRINGS[uiLang];

  const analyze = async () => {
    if (!url) return showToast(uiLang === 'vi' ? 'Nháº­p link YouTube!' : 'Enter YouTube link!');
    setResult(null); setVideoInfo(null); setLoading(true);
    try {
      const info = await fetchYouTubeData(url);
      setVideoInfo(info);
      let prompt = `URL: ${url}\nMETADATA: Title="${info.title}", Channel="${info.author}"`;
      if (info.fullData) prompt += `\nDESCRIPTION: ${info.description}\nTAGS: ${info.tags}\nSTATS: ${info.viewCount} views, ${info.likeCount} likes.`;
      prompt += `\nANALYZE DHARMA / HEALING / BUDDHIST CONTENT. RESPOND ALL TEXT FIELDS IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.`;
      setResult(await callGemini(prompt, SPY_PROMPT));
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  };

  const impactClass = (impact) => {
    const l = (impact || '').toLowerCase();
    return l.includes('high') ? 'text-red-400 font-bold' : l.includes('medium') ? 'text-yellow-400' : 'text-green-400';
  };

  const tierClass = (tier) => {
    const l = (tier || '').toLowerCase();
    return l.includes('premium') ? 'bg-green-900/20 border-green-500/30 text-green-300'
      : l.includes('high') ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300'
      : 'bg-red-900/20 border-red-500/30 text-red-300';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-[slideIn_0.4s_ease-out]">
      <div className="bg-[#12161e] border border-slate-700/30 p-6 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-brands fa-youtube text-red-500" /> {t.spy.title}
        </h2>
        <div className="flex gap-2 mb-4">
          <input value={url} onChange={e => { setUrl(e.target.value); if (!e.target.value.trim()) { setResult(null); setVideoInfo(null); } }}
            placeholder={uiLang === 'vi' ? 'DÃ¡n link Video/KÃªnh Chá»¯a LÃ nh, Pháº­t PhÃ¡p, Thiá»n Äá»‹nh...' : 'Paste YouTube link...'}
            className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-xl p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600" />
          <button onClick={() => { setUrl(''); setResult(null); setVideoInfo(null); }}
            className="p-3 bg-[#12161e] rounded-xl hover:bg-[#1e2230] border border-slate-700/30">
            <i className="fa-solid fa-trash text-slate-400" />
          </button>
        </div>
        <button onClick={analyze} disabled={loading}
          className="w-full py-4 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
          {loading ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'ÄANG QUÃ‰T...' : 'SCANNING...'}</>
            : <><i className="fa-solid fa-eye" /> {uiLang === 'vi' ? 'PHÃ‚N TÃCH INSIGHT' : 'ANALYZE INSIGHT'}</>}
        </button>
      </div>

      {videoInfo && result && (
        <div className="space-y-6 pb-10">
          {/* Video Info */}
          <div className="bg-[#12161e] border border-slate-700/30 p-4 rounded-xl flex gap-4 items-start flex-col sm:flex-row shadow-lg">
            {videoInfo.thumb && <img src={videoInfo.thumb} className="w-full sm:w-48 rounded-lg shadow-lg border border-slate-700/30 object-cover aspect-video" />}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white leading-tight mb-2">{videoInfo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1 text-amber-200"><i className="fa-solid fa-user" /> {videoInfo.author}</span>
                {videoInfo.fullData && <span className="flex items-center gap-1 text-green-200"><i className="fa-solid fa-eye" /> {videoInfo.viewCount} views</span>}
              </div>
            </div>
          </div>

          {/* Revenue */}
          {result.revenue_analysis && (
            <div className="bg-gradient-to-br from-green-900/10 to-amber-900/10 border border-green-500/20 rounded-xl p-5">
              <h4 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2 uppercase"><i className="fa-solid fa-dollar-sign" /> ðŸ’° REVENUE ANALYSIS</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                {['estimated_cpm', 'estimated_rpm', 'total_estimated_earnings'].map(k => (
                  <div key={k} className="bg-[#0a0e14]/30 p-3 rounded border border-green-500/10">
                    <div className="text-[10px] text-green-300 mb-1">{k.replace(/_/g, ' ').replace(/estimated /i, '')}</div>
                    <div className={`text-lg font-bold ${k.includes('earnings') ? 'text-green-400' : 'text-white'}`}>{result.revenue_analysis[k] || 'N/A'}</div>
                  </div>
                ))}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tierClass(result.revenue_analysis.monetization_tier)}`}>
                {result.revenue_analysis.monetization_tier}
              </span>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(result.strengths) && result.strengths.length > 0 && (
              <div className="bg-[#12161e] p-5 rounded-xl border border-amber-500/20">
                <h4 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2"><i className="fa-solid fa-check-circle" /> âš¡ STRENGTHS</h4>
                <div className="space-y-3">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="bg-amber-900/10 p-3 rounded border border-amber-500/20">
                      <div className="text-xs text-white font-medium mb-1">{s.point}</div>
                      <div className="text-[10px]"><span className="text-slate-500">Impact:</span> <span className={impactClass(s.impact)}>{s.impact}</span></div>
                      {s.evidence && <div className="text-[10px] text-slate-400 mt-1 italic">ðŸ’¡ {s.evidence}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(result.weaknesses) && result.weaknesses.length > 0 && (
              <div className="bg-[#12161e] p-5 rounded-xl border border-red-500/20">
                <h4 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2"><i className="fa-solid fa-exclamation-triangle" /> âš ï¸ WEAKNESSES</h4>
                <div className="space-y-3">
                  {result.weaknesses.map((w, i) => (
                    <div key={i} className="bg-red-900/10 p-3 rounded border border-red-500/20">
                      <div className="text-xs text-white font-medium mb-1">{w.point}</div>
                      <div className="text-[10px]"><span className="text-slate-500">Impact:</span> <span className={impactClass(w.impact)}>{w.impact}</span></div>
                      {w.fix && <div className="text-[10px] text-green-300 bg-green-900/10 p-2 rounded border border-green-500/20 mt-2">âœ… Fix: {w.fix}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio Strategy */}
          {result.audio_strategy && (
            <div className="bg-gradient-to-br from-teal-900/10 to-amber-900/10 border border-teal-500/20 rounded-xl p-5">
              <h4 className="text-sm font-bold text-teal-400 mb-4 uppercase"><i className="fa-solid fa-music" /> ðŸŽµ AUDIO STRATEGY</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['voice_analysis', 'music_style', 'hook_sounds'].map(k => (
                  <div key={k} className="bg-[#0a0e14]/30 p-3 rounded border border-teal-500/10">
                    <div className="text-[10px] text-teal-300 mb-1 font-bold">{k.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-slate-300">{result.audio_strategy[k] || 'N/A'}</div>
                  </div>
                ))}
                <div className="bg-[#0a0e14]/30 p-3 rounded border border-teal-500/10">
                  <div className="text-[10px] text-teal-300 mb-1 font-bold">Sound Effects</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(result.audio_strategy.sound_effects) ? result.audio_strategy.sound_effects.map((e, i) => (
                      <span key={i} className="bg-teal-900/20 text-teal-300 px-2 py-0.5 rounded text-[10px] border border-teal-500/20">{e}</span>
                    )) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Viral Suggestions */}
          {Array.isArray(result.viral_suggestions) && result.viral_suggestions.length > 0 && (
            <div className="bg-gradient-to-r from-amber-900/5 to-teal-900/5 p-5 rounded-xl border border-amber-500/20">
              <h3 className="text-sm font-bold text-amber-400 mb-4 uppercase">
                <i className="fa-solid fa-lightbulb" /> {uiLang === 'vi' ? 'TIÃŠU Äá»€ VIRAL Gá»¢I Ã' : 'VIRAL TITLES SUGGESTIONS'}
              </h3>
              <div className="space-y-3">
                {result.viral_suggestions.map((v, i) => (
                  <div key={i} className="bg-[#12161e]/80 p-4 rounded-lg border border-slate-700/30 hover:border-amber-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-900/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">OPTION {i + 1}</span>
                        <h4 className="text-sm font-bold text-white">{v.hook_title}</h4>
                      </div>
                      <div className="text-xs text-slate-400 pl-1 border-l-2 border-slate-700">ðŸ’¡ {v.outline_idea}</div>
                    </div>
                    <button onClick={() => onUseStrategy?.(v.hook_title)}
                      className="shrink-0 bg-amber-900/30 hover:bg-amber-800/40 text-amber-300 border border-amber-500/30 px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-all hover:scale-105">
                      <i className="fa-solid fa-bolt" /> {uiLang === 'vi' ? 'KÃCH HOáº T' : 'ACTIVATE'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

``n
### src/modules/StudioModule.jsx

`$ext
import { useState, useEffect, useRef } from 'react';
import { generateImage } from '../utils/api';
import { showToast } from '../utils/toast';

function dl(content, name, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name; a.click();
}

export default function StudioModule({ segments, topic = '', uiLang }) {
  const [mode, setMode] = useState('video');
  const [imgs, setImgs] = useState({});
  const [gen, setGen] = useState(null);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    if (!menu) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menu]);

  const copy = t => { navigator.clipboard.writeText(t); showToast('âœ… Copied!', 'success'); };

  const doGen = async (i) => {
    if (gen !== null) return;
    setGen(i);
    try {
      const s = segments[i];
      const p = (mode === 'video' ? s.video_prompt : s.image_prompt) + (mode === 'video' ? ', 8k, cinematic' : ', masterpiece, 8k');
      const url = await generateImage(p, mode === 'video' ? '16:9' : '1:1');
      if (url) setImgs(v => ({ ...v, [`${i}_${mode}`]: url }));
      else showToast(uiLang === 'vi' ? 'Lá»—i Safety/API' : 'Safety/API Error', 'error');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setGen(null); }
  };

  const getTimestamp = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
  };
  const slug = (topic||'script').replace(/\s+/g,'_');

  const expCSV = () => {
    let c = '\uFEFFScene,Time,Section,Character,Voice,Speaker,Gender,Age,Accent,Timbre,Tone,Pacing,Speed,Words,End Time,State,Audio SFX ASMR Music,Video Prompt,Image Prompt\n';
    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      c += `${i+1},"${s.time||''}","${s.section||''}","${(s.character||'').replace(/"/g,'""')}","${(s.voice_text||'').replace(/"/g,'""')}","${(vp.speaker||s.character||'').replace(/"/g,'""')}","${vp.gender||''}","${vp.age||''}","${vp.accent||''}","${vp.timbre||''}","${vp.tone||''}","${vp.pacing||''}","${vp.pacing_speed||''}","${s.word_count||''}","${s.audio_end_time||''}","${vp.state||''}","${(s.sfx_music_suggestion||'').replace(/"/g,'""')}","${(s.video_prompt||'').replace(/"/g,'""')}","${(s.image_prompt||'').replace(/"/g,'""')}"\n`;
    });
    dl(c, `${slug}_kich_ban_${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
    setMenu(false);
  };

  const expJSON = () => {
    dl(JSON.stringify({ version: '2.0', topic, segments }, null, 2), `${slug}_${getTimestamp()}.json`, 'application/json');
    setMenu(false); showToast('âœ… Exported!', 'success');
  };

  const expPromptVideoCSV = () => {
    let c = '\uFEFFScene,Video Prompt\n';
    segments.forEach((s, i) => { c += `${i+1},"${(s.video_prompt||'').replace(/"/g,'""')}"\n`; });
    dl(c, `${slug}_prompt_video_${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
    setMenu(false);
  };

  const expPromptImageCSV = () => {
    let c = '\uFEFFScene,Image Prompt\n';
    segments.forEach((s, i) => { c += `${i+1},"${(s.image_prompt||'').replace(/"/g,'""')}"\n`; });
    dl(c, `${slug}_prompt_image_${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
    setMenu(false);
  };

  const expPromptVideoTXT = () => {
    const txt = segments.map(s => s.video_prompt || '').join('\n\n');
    dl(txt, `${slug}_prompt_video_${getTimestamp()}.txt`, 'text/plain;charset=utf-8;');
    setMenu(false);
  };

  const expPromptImageTXT = () => {
    const txt = segments.map(s => s.image_prompt || '').join('\n\n');
    dl(txt, `${slug}_prompt_image_${getTimestamp()}.txt`, 'text/plain;charset=utf-8;');
    setMenu(false);
  };

  if (!segments.length) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-slate-500 italic">{uiLang === 'vi' ? 'ChÆ°a cÃ³ dá»¯ liá»‡u ká»‹ch báº£n. HÃ£y táº¡o ká»‹ch báº£n trÆ°á»›c.' : 'No script data. Create a script first.'}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-[slideIn_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-clapperboard text-cyan-500"/>
          {uiLang === 'vi' ? 'Studio SÃ¡ng Táº¡o' : 'Creative Studio'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#12161e] rounded p-1 border border-slate-700/30">
            {['video','image'].map(m=>(
              <button key={m} onClick={()=>setMode(m)} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 ${mode===m?(m==='video'?'bg-cyan-900/50 text-cyan-100':'bg-purple-900/50 text-purple-100')+' shadow':'text-slate-400 hover:text-white'}`}>
                <i className={`fa-solid fa-${m==='video'?'video':'image'}`}/> {m==='video'?'VIDEO':(uiLang === 'vi' ? 'áº¢NH' : 'IMAGE')}
              </button>
            ))}
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={()=>setMenu(!menu)} className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 bg-green-900/40 text-green-300 border border-green-500/20">
              <i className="fa-solid fa-download"/> {uiLang === 'vi' ? 'Táº£i' : 'Export'} â–¾
            </button>
            {menu&&<div className="absolute right-0 top-full mt-2 w-52 bg-[#12161e] border border-slate-700/30 rounded-xl shadow-xl z-50 overflow-hidden">
              <button onClick={expJSON} className="w-full text-left px-4 py-2.5 text-xs text-amber-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-code text-amber-500"/>{uiLang === 'vi' ? 'Táº£i Dá»± Ãn (.json)' : 'Project (.json)'}</button>
              <button onClick={expCSV} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500"/>{uiLang === 'vi' ? 'Excel Ká»‹ch Báº£n' : 'Excel Script'}</button>
              <button onClick={expPromptVideoCSV} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500"/>{uiLang === 'vi' ? 'Excel Prompt Video' : 'Excel Video Prompts'}</button>
              <button onClick={expPromptImageCSV} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500"/>{uiLang === 'vi' ? 'Excel Prompt áº¢nh' : 'Excel Image Prompts'}</button>
              <button onClick={expPromptVideoTXT} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-lines text-blue-400"/>{uiLang === 'vi' ? 'TXT Prompt Video' : 'TXT Video Prompts'}</button>
              <button onClick={expPromptImageTXT} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 flex items-center gap-2"><i className="fa-solid fa-file-lines text-blue-400"/>{uiLang === 'vi' ? 'TXT Prompt áº¢nh' : 'TXT Image Prompts'}</button>
            </div>}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pb-10">
        {segments.map((seg, i) => {
          const prompt = mode==='video'?seg.video_prompt:seg.image_prompt;
          const img = imgs[`${i}_${mode}`];
          return (
            <div key={i} className="bg-[#12161e] border border-slate-700/30 p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start hover:border-slate-600 transition-colors">
              <div className={`px-3 py-1.5 rounded text-xs font-bold text-white shadow-lg ${mode==='video'?'bg-cyan-900/50':'bg-purple-900/50'}`}>SCENE {i+1}</div>
              <div className="flex-1 w-full">
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{mode==='video'?'ðŸŽ¬ VIDEO PROMPT':'ðŸ–¼ï¸ IMAGE PROMPT'}</div>
                <div className="relative group">
                  <p className="text-xs text-slate-300 font-mono mb-3 bg-[#0a0e14]/50 p-3 rounded border border-slate-700/30 leading-relaxed pr-10">{prompt||'No prompt'}</p>
                  <button onClick={()=>copy(prompt||'')} className="absolute top-2 right-2 p-1.5 bg-[#12161e] text-slate-300 rounded hover:bg-blue-900/50 border border-slate-700/30"><i className="fa-solid fa-copy"/></button>
                </div>
                <button onClick={()=>doGen(i)} disabled={gen!==null} className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1 disabled:opacity-50 ${mode==='video'?'bg-cyan-900/20 text-cyan-400 border-cyan-500/20':'bg-purple-900/20 text-purple-400 border-purple-500/20'}`}>
                  {gen===i
                    ?<><i className="fa-solid fa-sync animate-spin"/> {uiLang === 'vi' ? 'Äang táº¡o...' : 'Generating...'}</>
                    :<><i className="fa-solid fa-magic"/> {uiLang === 'vi' ? (mode==='video'?'Táº¡o Video':'Táº¡o áº¢nh') : (mode==='video'?'Generate Video':'Generate Image')}</>}
                </button>
              </div>
              <div className={`w-full sm:w-64 bg-[#0a0e14] rounded border border-slate-700/30 overflow-hidden shrink-0 flex items-center justify-center ${mode==='video'?'aspect-video':'aspect-square'}`}>
                {img?<div className="relative group w-full h-full"><img src={img} className="w-full h-full object-cover"/><div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[8px] font-black text-amber-400">TUAI STUDIO V2</div></div>
                :<div className="text-center p-4"><i className={`fa-solid fa-${mode==='video'?'film':'image'} text-2xl mb-2 opacity-50`}/><div className="text-[10px] text-slate-500">{uiLang === 'vi' ? 'ChÆ°a cÃ³' : 'Empty'}</div></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

``n
### src/utils/api.js

`$ext
import { getNextKey, getKeyCount, markKeyExhausted, getWorkingKey } from './storage';

// â”€â”€â”€ Model fallback chain â”€â”€â”€
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

// â”€â”€â”€ Error classification â”€â”€â”€
const QUOTA_KEYWORDS = ['quota', 'rate limit', 'rate-limit', 'resource exhausted', 'exceeded', '429', 'too many requests'];
const OVERLOAD_KEYWORDS = ['high demand', 'overloaded', 'temporarily unavailable', 'service unavailable', '503', 'capacity', 'try again later'];
const AUTH_KEYWORDS = ['api key', 'invalid', 'unauthorized', '401', '403', 'permission denied'];

function classifyError(message, httpStatus) {
  const lower = (message || '').toLowerCase();
  if (httpStatus === 503 || OVERLOAD_KEYWORDS.some(k => lower.includes(k))) return 'overload';
  if (httpStatus === 429 || QUOTA_KEYWORDS.some(k => lower.includes(k))) return 'quota';
  if (AUTH_KEYWORDS.some(k => lower.includes(k))) return 'auth';
  return 'unknown';
}

function friendlyError(rawMessage, type) {
  switch (type) {
    case 'quota':
      return 'â³ API Ä‘Ã£ háº¿t quota (giá»›i háº¡n miá»…n phÃ­). Vui lÃ²ng chá» vÃ i phÃºt hoáº·c thÃªm API Key má»›i trong Cáº¥u HÃ¬nh.';
    case 'overload':
      return 'ðŸ”„ Server AI Ä‘ang quÃ¡ táº£i. Há»‡ thá»‘ng Ä‘Ã£ thá»­ nhiá»u model nhÆ°ng Ä‘á»u báº­n. Vui lÃ²ng thá»­ láº¡i sau 1-2 phÃºt.';
    case 'auth':
      return 'ðŸ”‘ API Key khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n. Kiá»ƒm tra láº¡i trong Cáº¥u HÃ¬nh.';
    default:
      if (rawMessage && rawMessage.length > 150) {
        return 'âŒ Lá»—i API: ' + rawMessage.substring(0, 120) + '...';
      }
      return 'âŒ ' + (rawMessage || 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh');
  }
}

// â”€â”€â”€ Sleep helper â”€â”€â”€
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// â”€â”€â”€ Retry helper with key rotation, model fallback & exponential backoff â”€â”€â”€
async function withKeyRetry(apiCall) {
  const count = getKeyCount();
  if (count === 0) throw new Error('ðŸ”‘ ChÆ°a cÃ³ API Key! Vui lÃ²ng thÃªm key trong âš™ï¸ Cáº¥u HÃ¬nh.');

  const maxAttempts = Math.min(count * 2, 6);
  let lastError;
  let lastErrorType = 'unknown';

  for (let i = 0; i < maxAttempts; i++) {
    const key = getWorkingKey();
    if (!key) break;

    try {
      const result = await apiCall(key);
      return result;
    } catch (e) {
      lastError = e;
      lastErrorType = e._errorType || classifyError(e.message);

      if (lastErrorType === 'overload') {
        // Server overloaded â€” exponential backoff, do NOT mark key as exhausted
        if (i < maxAttempts - 1) {
          await sleep(Math.min(2000 * Math.pow(2, i), 15000));
        }
        continue;
      }

      if (lastErrorType === 'quota') {
        markKeyExhausted(key);
        if (i < maxAttempts - 1) {
          await sleep(500 + i * 300);
        }
        continue;
      }

      if (lastErrorType === 'auth') {
        markKeyExhausted(key);
        continue;
      }

      // Unknown errors â€” small backoff
      if (i < maxAttempts - 1) {
        await sleep(1000 * (i + 1));
        continue;
      }
    }
  }

  const friendly = friendlyError(lastError?.message, lastErrorType);
  const error = new Error(friendly);
  error.errorType = lastErrorType;
  throw error;
}

// â”€â”€â”€ Single Gemini API call (one model, one key) â”€â”€â”€
async function callGeminiOnce(key, model, userPrompt, systemPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 65536,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `API Error: ${res.status}`;
    const error = new Error(msg);
    error._httpStatus = res.status;
    error._errorType = classifyError(msg, res.status);
    throw error;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('KhÃ´ng nháº­n Ä‘Æ°á»£c pháº£n há»“i tá»« AI.');

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1].trim());
    throw new Error('KhÃ´ng thá»ƒ phÃ¢n tÃ­ch JSON tá»« AI.');
  }
}

// â”€â”€â”€ Gemini AI Text Generation (with model fallback chain) â”€â”€â”€
export async function callGemini(userPrompt, systemPrompt) {
  return withKeyRetry(async (key) => {
    let lastError;
    for (const model of GEMINI_MODELS) {
      try {
        return await callGeminiOnce(key, model, userPrompt, systemPrompt);
      } catch (e) {
        lastError = e;
        const errorType = e._errorType || classifyError(e.message, e._httpStatus);
        // Only fallback to next model on overload/503, not on auth or other errors
        if (errorType === 'overload') {
          await sleep(1000);
          continue;
        }
        throw e; // re-throw quota, auth, or other errors immediately
      }
    }
    throw lastError;
  });
}

// â”€â”€â”€ YouTube Metadata Fetch â”€â”€â”€
export async function fetchYouTubeData(url) {
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;

  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.title) {
      const result = {
        title: data.title,
        author: data.author_name || 'Unknown',
        thumb: data.thumbnail_url || '',
        fullData: false,
      };

      if (videoId) {
        const key = getWorkingKey();
        if (key) {
          try {
            const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${key}`);
            const ytData = await ytRes.json();
            if (ytData.items?.[0]) {
              const item = ytData.items[0];
              result.description = item.snippet?.description || '';
              result.tags = (item.snippet?.tags || []).join(', ');
              result.viewCount = item.statistics?.viewCount || '0';
              result.likeCount = item.statistics?.likeCount || '0';
              result.fullData = true;
            }
          } catch { /* fallback to basic data */ }
        }
      }
      return result;
    }
  } catch { /* continue */ }

  throw new Error('KhÃ´ng thá»ƒ láº¥y thÃ´ng tin video. Kiá»ƒm tra láº¡i link YouTube.');
}

// â”€â”€â”€ Image Generation (Gemini Imagen) â”€â”€â”€
export async function generateImage(prompt, aspectRatio = '16:9') {
  return withKeyRetry(async (key) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${key}`;
    const body = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio,
        safetyFilterLevel: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `Image API Error: ${res.status}`;
      const error = new Error(msg);
      error._httpStatus = res.status;
      error._errorType = classifyError(msg, res.status);
      throw error;
    }

    const data = await res.json();
    const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) return null;
    return `data:image/png;base64,${b64}`;
  });
}

``n
### src/utils/storage.js

`$ext
const STORAGE_KEY = 'TUAI_DHARMA_MASTER_V2_KEYS';
const EXHAUSTED_KEY = 'TUAI_EXHAUSTED_KEYS';
const COOLDOWN_MS = 60_000; // 1 minute cooldown per key
let _keyIndex = 0;

export function getKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveKeys(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function addKey(key) {
  const keys = getKeys();
  if (!keys.includes(key)) { keys.push(key); saveKeys(keys); }
  // Clear exhaustion status for newly added key
  clearKeyExhaustion(key);
  return keys;
}

export function removeKey(key) {
  const keys = getKeys().filter(k => k !== key);
  saveKeys(keys);
  clearKeyExhaustion(key);
  _keyIndex = 0;
  return keys;
}

export function getKeyCount() { return getKeys().length; }

export function getNextKey() {
  const keys = getKeys();
  if (keys.length === 0) return null;
  const key = keys[_keyIndex % keys.length];
  _keyIndex = (_keyIndex + 1) % keys.length;
  return key;
}

// â”€â”€â”€ Exhaustion tracking (temporary cooldown) â”€â”€â”€
function getExhaustedMap() {
  try {
    const raw = localStorage.getItem(EXHAUSTED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveExhaustedMap(map) {
  localStorage.setItem(EXHAUSTED_KEY, JSON.stringify(map));
}

export function markKeyExhausted(key) {
  const map = getExhaustedMap();
  map[key] = Date.now();
  saveExhaustedMap(map);
}

function clearKeyExhaustion(key) {
  const map = getExhaustedMap();
  delete map[key];
  saveExhaustedMap(map);
}

function isKeyExhausted(key) {
  const map = getExhaustedMap();
  const ts = map[key];
  if (!ts) return false;
  // Auto-clear after cooldown
  if (Date.now() - ts > COOLDOWN_MS) {
    clearKeyExhaustion(key);
    return false;
  }
  return true;
}

/**
 * Get a working key (not currently in cooldown).
 * Falls back to round-robin if all keys are exhausted.
 */
export function getWorkingKey() {
  const keys = getKeys();
  if (keys.length === 0) return null;

  // First pass: find a key not in cooldown
  for (let i = 0; i < keys.length; i++) {
    const idx = (_keyIndex + i) % keys.length;
    if (!isKeyExhausted(keys[idx])) {
      _keyIndex = (idx + 1) % keys.length;
      return keys[idx];
    }
  }

  // All exhausted, fallback to round-robin anyway
  const key = keys[_keyIndex % keys.length];
  _keyIndex = (_keyIndex + 1) % keys.length;
  return key;
}

// Backward compatibility â€” now uses round-robin instead of random
export function getRandomKey() { return getNextKey(); }

export function hasKeys() { return getKeys().length > 0; }

``n
### src/utils/toast.js

`$ext
let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:420px;width:calc(100vw - 40px);';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  const colors = {
    success: 'background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;',
    error: 'background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.35);color:#fca5a5;',
    info: 'background:rgba(245,166,35,0.15);border:1px solid rgba(245,166,35,0.3);color:#fcd34d;',
    warning: 'background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.35);color:#fde68a;',
  };

  // Truncate extremely long messages
  let displayMsg = message;
  if (displayMsg && displayMsg.length > 200) {
    displayMsg = displayMsg.substring(0, 180) + '...';
  }

  // Longer display for errors
  const displayDuration = type === 'error' ? Math.max(duration, 5000) : duration;

  toast.style.cssText = `${colors[type] || colors.info}padding:14px 20px;border-radius:12px;font-size:13px;line-height:1.5;font-family:Inter,sans-serif;font-weight:500;backdrop-filter:blur(16px);pointer-events:auto;animation:slideIn 0.3s ease-out;max-width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.4);word-wrap:break-word;overflow-wrap:break-word;cursor:pointer;transition:opacity 0.3s;`;
  toast.textContent = displayMsg;
  
  // Click to dismiss
  toast.addEventListener('click', () => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, displayDuration);
}

``n
### package.json

`$ext
{
  "name": "tuai-dharma-master-v2",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^6.0.0"
  }
}

``n
### vite.config.js

`$ext
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

``n
### index.html

`html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <meta name="description" content="TUAI DHARMA MASTER - AI-Powered Buddhist & Healing Content Creation Suite. Ká»‹ch báº£n Pháº­t giÃ¡o, chá»¯a lÃ nh vÃ  triáº¿t lÃ½ nhÃ¢n sinh." />
    <meta name="theme-color" content="#0a0e14" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>ðŸª·</text></svg>">
    <title>TUAI DHARMA MASTER - AI Healing Content Suite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            animation: {
              'fade-in': 'fadeIn 0.5s ease-out',
              'slide-in': 'slideIn 0.5s cubic-bezier(0.22,1,0.36,1)',
            },
            keyframes: {
              fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
              slideIn: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
            }
          }
        }
      }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script type="module" crossorigin src="/assets/index-CJY1-Pj6.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-DGRUSy59.css">
</head>
<body>
    <div id="root"></div>
</body>
</html>

``n

