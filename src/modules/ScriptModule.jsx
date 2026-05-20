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

# QUY TẮC CHÍNH:
- Mỗi phân cảnh 8 giây CHỈ ĐƯỢC PHÉP 01 GIỌNG ĐỌC
- Lời thoại 30-40 từ mỗi cảnh, nhịp đọc chậm, truyền cảm
- Dialogues BẮT BUỘC chỉ chứa ĐÚNG 01 PHẦN TỬ
- Thoại PHẢI dứt điểm ở giây 7.2 - 7.5
- Ghi nhận audio_end_time và word_count trong JSON

# SAFETY: Tuyệt đối CẤM bạo lực, máu me. Phải tự động "chuyển hóa" bằng triết lý nhân quả.

# 🎬 NARRATIVE ARC (CẤU TRÚC KỊCH BẢN BẮT BUỘC):
PHẢI tuân thủ cấu trúc:
- HOOK (2-3 scenes): Câu hỏi đau thương / tình huống gây tò mò
- PROBLEM (3-4 scenes): Khắc họa nỗi khổ, lo âu, mất phương hướng
- TEACHING (5-7 scenes): Triết lý Phật Pháp, lời dạy sư thầy
- TRANSFORMATION (3-4 scenes): Chuyển hóa qua nhân quả, từ bi
- RESOLUTION (2-3 scenes): Giải thoát, an lạc, kết quả tốt lành
- CTA (1-2 scenes): Kêu gọi hành động, subscribe, chia sẻ

# 👤 CHARACTER ARCHETYPE SYSTEM:
Mỗi nhân vật recurring PHẢI có CHARACTER_LOCK nhất quán xuyên suốt:
- Giới tính, tuổi, vùng miền (Northern/Southern Vietnamese)
- Trang phục, nét đặc trưng khuôn mặt
- Vai trò: Thiền sư / Ni sư / Phật tử trẻ / Người dẫn truyện
Không được thay đổi ngoại hình nhân vật giữa các scenes.

# 🎥 CAMERA VOCABULARY:
Mỗi video_prompt PHẢI bắt đầu bằng CAMERA_TYPE + CAMERA_MOVEMENT:
Camera Types: CLOSE-UP SHOT | MEDIUM SHOT | WIDE SHOT | EXTREME CLOSE-UP | OVER-THE-SHOULDER
Camera Movements: STATIC | SLOW PAN LEFT | SLOW PAN RIGHT | GENTLE DOLLY IN | GENTLE DOLLY OUT | CRANE UP | CRANE DOWN | STEADICAM ORBIT | SUBTLE PARALLAX | AERIAL DESCENT

# 🛡️ ANATOMY SAFEGUARD (QUAN TRỌNG — PHÂN BIỆT 2 LOẠI SCENE):

## Scene CÓ NGƯỜI (human subjects):
Thêm vào cuối video_prompt VÀ image_prompt: "(perfect human anatomy:1.2), exactly two arms, exactly two legs, perfect hands."
Thêm [HUMAN-SHIELD]: Perfect limb separation, no clipping or hand fusion. Strict frame-to-frame clothing consistency. Perfect facial symmetry, identical symmetric circular pupils. Strict character count persistence, no ghost characters.

## Scene KHÔNG CÓ NGƯỜI (thiên nhiên, vật thể, biểu tượng như hoa sen, cây cối, sóng biển, hạt giống, pháp luân, ngọn nến, dòng suối, con đường):
TUYỆT ĐỐI KHÔNG thêm anatomy tags hoặc "exactly two arms/legs".
Thêm [NATURE-SHIELD]: Sharp object borders, static directional lighting. Permanently static background props. Organic natural movement only.

# 📐 UNIFIED VIDEO PROMPT FORMAT (BẮT BUỘC cho MỌI scene):
[[CAMERA_TYPE, CAMERA_MOVEMENT], SUBJECT_DESCRIPTION. PRIMARY_ACTION + 2-3 SECONDARY_DETAILS. LIGHTING_DIRECTIVE. {style_keywords}. [HUMAN-SHIELD hoặc NATURE-SHIELD]. ABSOLUTE TEMPORAL COHERENCE. ABSOLUTELY ZERO TEXT, letters, watermarks, or graphic overlays. [ASPECT RATIO LOCK]: Strictly FULL FRAME, NO black bars. ANATOMY_TAGS_NẾU_CÓ_NGƯỜI.]

# 📸 IMAGE PROMPT (BẮT BUỘC cho MỌI scene — KHÔNG ĐƯỢC ĐỂ TRỐNG):
Mỗi scene PHẢI có image_prompt riêng biệt, format:
- Bỏ camera movement, chỉ giữ mô tả tĩnh
- Bỏ temporal coherence (ảnh tĩnh không cần)
- Bỏ AUTO-SHIELD block
- Thêm suffix "--no failsafe" cho ảnh
- Thêm "(perfect human anatomy:1.2), exactly two arms, exactly two legs, perfect hands" NẾU CÓ NGƯỜI
- KHÔNG thêm anatomy tags nếu là cảnh thiên nhiên/vật thể
- Format: "[MÔ TẢ CHỦ THỂ]. [BỐI CẢNH]. [ÁNH SÁNG]. --no failsafe, (perfect human anatomy:1.2), exactly two arms, exactly two legs, perfect hands." (nếu có người)
- Format: "[MÔ TẢ CHỦ THỂ]. [BỐI CẢNH]. [ÁNH SÁNG]. --no failsafe" (nếu không có người)

# 🎵 SFX/MUSIC TAXONOMY (3 LỚP):
Mỗi scene PHẢI có sfx_music_suggestion với 3 lớp:
- LAYER 1 (Ambient Bed): Nhạc thiền, tần số 432Hz/528Hz, ambient drone
- LAYER 2 (Environmental ASMR): Nước chảy, gió, chim, chuông, mưa, sóng biển
- LAYER 3 (Emotional Punctuation): Chuông chùa, mõ, tiếng thở, im lặng chiến lược

OUTPUT JSON with: mode_detected, suggested_style, style_reason, character_lock_prompt, script[] with scene_number, time, section, character, dialogues[], voice_profile, voice_text, word_count, audio_end_time, visual_desc_vi, sfx_music_suggestion, pacing_score, pacing_warning, video_prompt, image_prompt, strategy_note, coppa_disclaimer.`;

export default function ScriptModule({ onScriptGenerated, onAudioRefined, initialTopic = '', uiLang, market, onMarketChange }) {
  const [topic, setTopic] = useState(initialTopic);
  const [durationStr, setDurationStr] = useState('1');
  const [style, setStyle] = useState('auto');
  const [dharmaTopic, setDharmaTopic] = useState('karma');
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState([]);
  const [scriptMeta, setScriptMeta] = useState(null);
  const [styleSuggestion, setStyleSuggestion] = useState(null);
  const [loadingStyle, setLoadingStyle] = useState(false);
  const [refining, setRefining] = useState(false);
  const [refineCount, setRefineCount] = useState(0);
  const t = UI_STRINGS[uiLang];

  const loadingMsgs = uiLang === 'vi'
    ? ['Đang phân tích triết lý...', 'Đang thiết lập bộ lọc tôn nghiêm...', 'Đang dệt hội thoại tĩnh tại...', 'Đang tinh chỉnh nhịp độ (Pacing)...']
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
    if (!topic) return showToast(uiLang === 'vi' ? 'Nhập chủ đề trước!' : 'Enter topic first!');
    setLoadingStyle(true);
    try {
      const res = await callGemini(`CHỦ ĐỀ: "${topic}"\n\nHãy đề xuất phong cách visual phù hợp nhất.`, STYLE_SUGGEST_PROMPT(uiLang));
      setStyleSuggestion(res);
      if (res.recommended_style) {
        setStyle(res.recommended_style);
        showToast(`${uiLang === 'vi' ? 'AI đề xuất' : 'AI Suggests'}: ${VISUAL_STYLES.find(s => s.id === res.recommended_style)?.name || res.recommended_style}`, 'success');
      }
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoadingStyle(false); }
  };

  const generate = async () => {
    if (!topic) return showToast(uiLang === 'vi' ? 'Vui lòng nhập chủ đề!' : 'Please enter a topic!');
    setSegments([]); setScriptMeta(null); setStyleSuggestion(null); setRefineCount(0); setLoading(true);
    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mkt = MARKETS[market] || MARKETS.vn_dharma;
      let styleName = styleObj?.name || 'Auto';
      const topicObj = DHARMA_TOPICS.find(dt => dt.id === dharmaTopic);
      const suggestions = TOPIC_SUGGESTIONS[dharmaTopic] || ['Trong chánh niệm'];
      const microCtx = suggestions[Math.floor(Math.random() * suggestions.length)];
      styleName += ` - DHARMA TOPIC: ${topicObj?.label}. MICRO-CONTEXT (CRITICAL): ${microCtx}.`;

      const seed = Math.floor(Math.random() * 1000000);
      const res = await callGemini(
        `TOPIC: "${topic}"\nDURATION: ${duration}m\nSCENE_COUNT: ${sceneCount}\nTARGET_MARKET: ${mkt.name}\nNATIVE_LANGUAGE: ${mkt.voice_lang}\nCULTURAL_CONTEXT: ${mkt.culture}\nVISUAL_STYLE: ${styleName}\n[ANTI-REPETITION SEED]: ${seed}\n\nCRITICAL INSTRUCTION:\n1. Write VOICE_TEXT and DIALOGUES in "${mkt.voice_lang}"\n2. DO NOT just translate from Vietnamese.\n3. GENERATE JSON OBJECT.`,
        SCRIPT_SYSTEM_PROMPT
      );

      let segs = res.script || (Array.isArray(res) ? res : []);
      if (styleObj && styleObj.id !== 'auto' && styleObj.prompt_enforce) {
        segs = segs.map(s => ({
          ...s,
          video_prompt: s.video_prompt?.includes('Visual Style:') ? s.video_prompt : `${s.video_prompt} ${styleObj.prompt_enforce}`,
          image_prompt: s.image_prompt?.includes('Visual Style:') ? s.image_prompt : `${s.image_prompt} ${styleObj.prompt_enforce}`,
        }));
      }
      setScriptMeta(res);
      setSegments(segs);
      onScriptGenerated(segs, res.suggested_style || '', topic);
    } catch (e) { showToast(e.message, 'error'); }
    finally { setLoading(false); }
  };

  const refineAudio = async () => {
    if (!segments.length) return showToast(uiLang === 'vi' ? 'Chưa có kịch bản!' : 'No script!');
    setRefining(true);
    try {
      const input = segments.map(s => ({
        scene_number: s.scene_number, voice_text: s.voice_text || s.chapter_voice_block || '',
        visual_context: s.visual_desc_vi || s.visual_desc || '', section: s.section || '', character: s.character || '', time: s.time || '',
      }));
      const res = await callGemini(
        `KỊCH BẢN GỐC (${input.length} scenes):\n${JSON.stringify(input, null, 2)}\n\nTINH CHỈNH THANH ÂM CHO TẤT CẢ ${input.length} SCENES. RESPOND IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.`,
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
        showToast(uiLang === 'vi' ? '🎙️ Thanh âm đã được tinh chỉnh thành công!' : '🎙️ Audio refined!', 'success');
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
            <i className="fa-solid fa-folder-open" /> {uiLang === 'vi' ? 'Mở Dự Án' : 'Open Project'}
            <input type="file" accept=".json" className="hidden" onChange={handleOpenProject} />
          </label>
        </h2>

        <div className="space-y-4">
          {/* Topic input */}
          <div className="relative mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">{uiLang === 'vi' ? 'Chủ Đề Truyện' : 'Story Topic'}</label>
            <div className="flex gap-2">
              <input value={topic} onChange={e => { setTopic(e.target.value); if (!e.target.value.trim()) { setSegments([]); setScriptMeta(null); } }}
                className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-teal-500/50 placeholder-slate-600"
                placeholder={uiLang === 'vi' ? 'VD: Luật nhân quả, An trú hiện tại, Buông bỏ phiền não...' : 'e.g., Karma law, Living in the present...'} />
              <button onClick={suggestStyle} disabled={loadingStyle || !topic}
                className="px-4 py-2 bg-amber-900/30 hover:bg-amber-800/40 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shrink-0">
                {loadingStyle ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Đang phân tích...' : 'Analyzing...'}</>
                  : <><i className="fa-solid fa-wand-magic-sparkles" /> {uiLang === 'vi' ? 'AI Đề Xuất Style' : 'AI Suggest Style'}</>}
              </button>
            </div>
          </div>

          {/* Duration & Market */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
              <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
                <i className="fa-solid fa-clock text-teal-400" /> {uiLang === 'vi' ? 'THỜI LƯỢNG (PHÚT)' : 'DURATION (MINS)'}
              </label>
              <div className="flex items-center gap-5">
                <input type="text" inputMode="numeric" value={durationStr} onChange={e => setDurationStr(e.target.value.replace(/[^0-9.]/g, ''))}
                  onBlur={() => { const v = parseFloat(durationStr); setDurationStr(v > 0 ? String(v) : '1'); }}
                  className="w-20 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-2xl font-black text-white text-center outline-none" />
                <div className="flex flex-col gap-1.5 text-xs">
                  <div><span className="text-slate-500">{uiLang === 'vi' ? 'Số cảnh' : 'Scenes'}:</span> <span className="font-bold text-green-400 text-base">~{sceneCount}</span></div>
                  <div><span className="text-slate-500">Voice:</span> <span className="font-bold text-teal-400 text-base">~{wordCount} {uiLang === 'vi' ? 'từ' : 'words'}</span></div>
                </div>
              </div>
            </div>
            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                <i className="fa-solid fa-globe text-amber-400" /> {uiLang === 'vi' ? 'THỊ TRƯỜNG' : 'MARKET'}
              </label>
              <select value={market} onChange={e => onMarketChange(e.target.value)}
                className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {Object.values(MARKETS).map(m => <option key={m.id} value={m.id}>{m.flag} {m.name}</option>)}
              </select>
            </div>
          </div>

          {/* Dharma topic */}
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <label className="text-xs font-bold text-teal-400 uppercase mb-2 block flex items-center gap-2">
              <i className="fa-solid fa-leaf text-teal-400" /> {uiLang === 'vi' ? 'CHỌN PHÂN NGÁCH PHẬT PHÁP' : 'DHARMA SUB-TOPIC'}
            </label>
            <select value={dharmaTopic} onChange={e => setDharmaTopic(e.target.value)}
              className="w-full bg-[#0a0e14] border border-teal-500/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
              {DHARMA_TOPICS.map(dt => <option key={dt.id} value={dt.id}>{dt.label}</option>)}
            </select>
          </div>

          {/* Visual styles */}
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
              <i className="fa-solid fa-palette text-pink-400" /> {uiLang === 'vi' ? 'PHONG CÁCH NGHỆ THUẬT' : 'VISUAL STYLE'}
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
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> {loadingMsgs[msgIdx]}</>
              : <><i className="fa-solid fa-paper-plane" /> {uiLang === 'vi' ? 'KIẾN TẠO KỊCH BẢN CHỮA LÀNH' : 'GENERATE HEALING SCRIPT'}</>}
          </button>

          {/* Refine audio button */}
          {segments.length > 0 && (
            <button onClick={refineAudio} disabled={loading || refining}
              className="w-full py-3.5 bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/30 text-purple-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {refining ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang === 'vi' ? 'Đang tinh chỉnh âm thanh...' : 'Refining audio...'}</>
                : <><i className="fa-solid fa-headphones-simple" /> {uiLang === 'vi' ? '🎙️ TINH CHỈNH THANH ÂM (V16.0)' : '🎙️ AUDIO RE-ENGINEERING (V16.0)'}
                  <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded font-black">+{refineCount}</span></>}
            </button>
          )}
        </div>
      </div>

      {/* Scene cards */}
      {segments.length > 0 && (
        <div className="space-y-4 pb-10">
          <div className="flex justify-between items-center px-2">
            <div className="text-xs text-slate-500 font-bold">{uiLang === 'vi' ? `Đã tạo: ${segments.length} phân đoạn` : `Generated: ${segments.length} segments`}</div>
            <button onClick={() => {
              const text = segments.map(s => s.chapter_voice_block || s.voice_text).join('\n\n');
              navigator.clipboard.writeText(text);
              showToast(t.common.copied, 'success');
            }} className="text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 bg-white text-black hover:bg-slate-200">
              <i className="fa-solid fa-copy" /> {uiLang === 'vi' ? 'Copy Voice Toàn Bộ' : 'Copy Voice All'}
            </button>
          </div>
          {segments.map((seg, i) => <SceneCard key={i} seg={seg} idx={i} uiLang={uiLang} />)}
        </div>
      )}
    </div>
  );
}
