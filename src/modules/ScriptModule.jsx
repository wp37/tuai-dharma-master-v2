import { useState, useEffect, memo } from 'react';
import { callGemini } from '../utils/api';
import { showToast } from '../utils/toast';
import { MARKETS } from '../config/markets';
import { VISUAL_STYLES, NICHE_PILLARS, AUDIENCE_PROFILES, TOPIC_SUGGESTIONS } from '../config/styles';
import { STYLE_SUGGEST_PROMPT, AUDIO_REFINE_PROMPT } from '../config/prompts';
import { UI_STRINGS } from '../config/i18n';
import SceneCard from '../components/SceneCard';

const SCRIPT_SYSTEM_PROMPT = `# SYSTEM ROLE: CREATIVE DIRECTOR FOR DHARMA, NOSTALGIA & HEALING V2.0
Ban la Creative Director va bien kich tuyet dinh, co nhiem vu kien tao cac kich ban phim ngan chua lanh mang chieu sau ton nghiem, chan thuc, rung dong trai tim.

# TAM NHIN: Truyen tai cac thong diep sau sac ve luat nhan qua, su tinh thuc chanh niem, va hoai niem mộc mạc de cuoi con nguoi quay ve chanh niem an binh.

# 3 TRỤ CỘT NỘI DUNG CỐT LÕI (Xác định dựa trên Trụ Cột / Niche Pillar được chọn):
1. 🏡 HỒN QUÊ & HOÀI NIỆM (hon_que):
   - Chủ đề: Ky uc tuoi tho, chieu xua ben mẹ, bep lua, canh vat thon que Vietnam xua lam lu nhung day tinh thuong.
   - Bắt buộc áp dụng triệt để phong cách hình ảnh "Nostalgic Cinematic Realism" trong video_prompt va image_prompt:
     * Bang mau: Warm Sepia, Faded Clay, Muddy Earth (tông mau am tram hoai niem).
     * Xuc giac: dat bun nhon tron duoi ruong đồng, van go weathered moc muc, bep ca rang dat nung toa khoi cui chay ti tach, bong nuoc mua tren ao ba ba son cu, mo hoi lam lem tran dan di.
     * Lock setting/character: Mien Tay Nam Bo thap nien 1990. Nha mai la don so, bep ca rang dat nung, xuong ba la bang go weathered sorn co. Nhan vat mặc quan ao ba ba sorn cu bac mau di chan tran.
     * Quy tac loai tru (Strict Negative Logic): TUYET DOI LOAI BO do nhua, gach men bong loang, duong be tong, cac thiet bi cong nghe hay dien tu hien dai.
   - Tone thoai: Nho thuong sau lang, tu su cham rai mộc mạc, truyen cam, nhe nhang.

2. ✨ FUTURE DREAM & KHÁT VỌNG (future_dream):
   - Chủ đề: Luat hap dan, nang luong tinh cuc, khat vong vuot len nghich canh, niem tin vao tuong lai tuoi sang, danh thuc hoai bao va hanh trinh thuc hien khat khao.
   - Visual Style: Dawn of hope (binh minh hy vong), con duong dat rong mo chan troi, anh sang vang morning sun volumetric phat ra kieu sa, magical dust particles, soft glowing warm aura.
   - Tone thoai: Truyen cam hung khoi day hy vong, tu tin, giau nang luong, mang thong diep thuc tinh.

3. 🏮 TRIẾT LÝ CỔ NHÂN, NHO ĐẠO & PHẬT PHÁP (dharma_wisdom):
   - Chủ đề: Luật nhân quả, thiền chánh niệm, tích cực chánh tư duy, đặc biệt kết hợp triết lý **Nho gia** (Mạnh Tử, Khổng Tử bàn về hiếu nghĩa, nhân đức), **Đạo gia** (Lão Tử, Trang Tử bàn về Vô Vi, thuận tự nhiên, sống tiêu dao tự tại), **Tôn Tử** (Tôn Tử binh pháp về lấy nhu thắng cương, tĩnh lặng chế ngự giông bão), kết hợp hoàn hảo cùng **Tánh Biết (Pure Awareness)** của Thiền Tông Lục Tổ Huệ Năng.
   - Bắt buộc áp dụng triệt để phong cách hình ảnh **"Cổ Phong Thủy Mặc" (co_phong_thuy_mac)** trong video_prompt và image_prompt:
     * Bối cảnh: Núi non trùng điệp sương khói mịt mù, cây tùng cổ kính, chiếc cầu đá hoang sơ, gian nhà lá cổ phong trầm mặc, bậc hiền triết hay nho sĩ ngồi tĩnh lặng đàm đạo bên tách trà nóng.
     * Nét vẽ: Tranh thủy mặc cổ phong (Cổ phong Thủy mặc) với các nét vẽ bằng cọ thư pháp đơn sắc đen, xám charcoal và màu giấy dó ấm cũ kỹ.
     * Hán tự (Chinese Calligraphy): Bắt buộc lồng ghép các bức thư pháp vẽ chữ Hán tự (Hán tự) uyển chuyển thanh thoát treo trên bình phong gỗ cổ kính hoặc trên cuộn giấy da sờn rách ở hậu cảnh để làm nổi bật chiều sâu cổ nhân.
     * Quy tắc loại trừ (Strict Negative Logic): Tuyệt đối không có đồ nhựa hiện đại, các công trình bê tông đô thị hay chữ viết Latin/tiếng Việt vẽ đè trực tiếp lên ảnh dưới dạng watermark.
   - Tone thoại: Trầm lắng, sâu sắc, cổ kính, đầy tính chiêm nghiệm và uy nghiêm như lời dạy của bậc cổ nhân hiền triết.

# 🎙️ AUDIENCE PACING & WORD BUDGET RULES (QUY TẮC NHỊP ĐỘ - BẮT BUỘC):
Mỗi scene 8 giây bat buoc chi co ĐÚNG 01 giong doc. So tu (word_count) trong dialogues hoac voice_text phai bi gioi han nghet ngheo theo doi tuong:
- Gen Z: Max 20 tu.
- Millennial: Max 18 tu.
- Gen X: Max 16 tu.
- Senior: Max 14 tu.
- Dharma Seeker: Max 12 tu.
Loi thoai phai duoc viet rut gon duoi so tu nay. Thoai phai hoan thanh o giay 7.2 - 7.5 de lai khoang lang tho giay cuoi cung.

# SAFETY: Tuyệt đối CẤM bạo lực, máu me. Phải tự động "chuyển hóa" bằng triết lý nhân quả.

# 🎬 NARRATIVE ARC (CẤU TRÚC KỊCH BẢN BẮT BUỘC):
PHẢI tuân thủ cấu trúc:
- HOOK (2-3 scenes): Tinh huong loi cuon hoac canh vat sau lang khoi dau.
- PROBLEM (3-4 scenes): Khac hoa lo au muon phien, lam lu cuoc doi.
- TEACHING (5-7 scenes): Triet ly loi day sau sac cua Su thay / Duc Phat hoac su thuc tinh cua Tánh Biết.
- TRANSFORMATION (3-4 scenes): Su thay doi trong nhan thuc, bat dau quan sat va buong bo.
- RESOLUTION (2-3 scenes): Binh an noi tam, an lac tu tai, khat vong tot dep.
- CTA (1-2 scenes): Gieo duyen lanh, like/share chanh niem de lan toa yeu thuong.

# 👤 CHARACTER ARCHETYPE SYSTEM:
Mỗi nhân vật recurring PHẢI có CHARACTER_LOCK nhất quán xuyên suốt:
- Giới tính, tuổi, vùng miền (Northern/Southern Vietnamese / Southern Mekong giong que song nuoc)
- Trang phục, nét đặc trưng khuôn mặt, di chan tran
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
- LAYER 2 (Environmental ASMR): ASMR cụ thể (bếp lửa tí tách, mưa rơi mái lá, ếch kêu đêm...)
- LAYER 3 (Emotional Punctuation): Chuông mõ điểm xuyết hoặc strategic silence

OUTPUT JSON with: mode_detected, suggested_style, style_reason, character_lock_prompt, script[] with scene_number, time, section, character, dialogues[], voice_profile, voice_text, word_count, audio_end_time, visual_desc_vi, sfx_music_suggestion, pacing_score, pacing_warning, video_prompt, image_prompt, strategy_note, coppa_disclaimer.`;

export default function ScriptModule({ onScriptGenerated, onAudioRefined, initialTopic = '', uiLang, market, onMarketChange }) {
  const [topic, setTopic] = useState(initialTopic);
  const [durationStr, setDurationStr] = useState('1');
  const [style, setStyle] = useState('auto');
  const [dharmaTopic, setDharmaTopic] = useState('dharma_wisdom');
  const [audienceProfile, setAudienceProfile] = useState('millennial');
  const [charMode, setCharMode] = useState('dialogue');
  const [contentContext, setContentContext] = useState('');
  const [genMode, setGenMode] = useState('creative');
  const [competitorScript, setCompetitorScript] = useState('');
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
    if (genMode === 'competitor' && !competitorScript.trim()) {
      return showToast(uiLang === 'vi' ? 'Vui lòng nhập kịch bản đối thủ!' : 'Please enter competitor script!');
    }
    setSegments([]); setScriptMeta(null); setStyleSuggestion(null); setRefineCount(0); setLoading(true);
    setBatchProgress({ current: 0, total: 0 });
    try {
      const styleObj = VISUAL_STYLES.find(s => s.id === style);
      const mkt = MARKETS[market] || MARKETS.vn_dharma;
      let styleName = styleObj?.name || 'Auto';
      const topicObj = NICHE_PILLARS.find(dt => dt.id === dharmaTopic);
      const suggestions = TOPIC_SUGGESTIONS[dharmaTopic] || ['Trong chánh niệm'];
      const microCtx = suggestions[Math.floor(Math.random() * suggestions.length)];
      styleName += ` - NICHE PILLAR: ${topicObj?.label}. MICRO-CONTEXT (CRITICAL): ${microCtx}.`;

      const activeProfile = AUDIENCE_PROFILES.find(ap => ap.id === audienceProfile) || AUDIENCE_PROFILES[1];
      const pacingPrompt = `\n\n[AUDIENCE PACING CONSTRAINT (CRITICAL)]: Target Audience is ${activeProfile.label}. Maximum words per 8s scene MUST be strictly under ${activeProfile.maxWords} words. Pacing speed should be matching ${activeProfile.wpm} WPM. Write short, powerful voice lines.`;

      const seed = Math.floor(Math.random() * 1000000);
      const characterPrompt = charMode === 'monologue'
        ? `\n\n[CHARACTER MODE: MONOLOGUE (1 NGUOI NÓI XUYÊN SUỐT)]\n- Toàn bộ kịch bản CHỈ CÓ DUY NHẤT 1 nhân vật/giọng đọc nói xuyên suốt toàn bộ phân cảnh (ví dụ: Người dẫn chuyện hoặc Sư thầy).\n- Giọng đọc mang tính độc thoại, tự sự, chiêm nghiệm sâu sắc.\n- Bắt buộc ghi nhận duy nhất 1 nhân vật trong trường "character" của toàn bộ phân cảnh.`
        : `\n\n[CHARACTER MODE: DIALOGUE (2 NHÂN VẬT THAY PHIÊN)]\n- Kịch bản là cuộc đối thoại sinh động hoặc luân phiên nói giữa 2 nhân vật xuyên suốt (ví dụ: Người trẻ đang trăn trở, ưu tư hoài niệm và Sư thầy chỉ dạy Tánh Biết hoặc triết lý nhân sinh).\n- Phải có sự phân chia giọng đọc rõ ràng giữa 2 nhân vật ở các phân cảnh để tạo cấu trúc đối thoại sinh động (ví dụ: Người trẻ trăn trở ở Hook/Problem, Sư thầy khuyên bảo ở Teaching/Transformation).`;

      const modeInstruction = genMode === 'creative' 
        ? `\n\n[GENERATION_MODE: SÁNG TẠO (CREATIVE)]: Hãy tự do sáng tạo kịch bản nguyên bản, mới lạ, sâu sắc và đầy cảm xúc dựa trên chủ đề.` 
        : `\n\n[GENERATION_MODE: BÁM SÁT KỊCH BẢN ĐỐI THỦ (FOLLOW COMPETITOR)]: Hãy phân tích chặt chẽ cấu trúc phân đoạn, thời lượng, mạch logic, cách đặt câu hỏi hook đầu video, các mốc chuyển cảnh và cách phân bổ thời lượng của kịch bản gốc của đối thủ dưới đây:\n\n--- KỊCH BẢN ĐỐI THỦ ---\n${competitorScript}\n---------------------\n\nHãy mô phỏng chính xác cấu trúc và nhịp điệu trên, nhưng viết lại nội dung mới mẻ, mang chiều sâu triết lý cao nhất dựa trên chủ đề mới.`;

      const contextBlock = contentContext.trim() ? `\n\n[CONTENT_CONTEXT (Nội dung/bối cảnh do user cung cấp)]:\nHãy dựa vào đây làm nguồn tư liệu chính để viết kịch bản, giữ đúng tinh thần và ý nghĩa của nội dung gốc:\n---\n${contentContext.trim()}\n---` : '';

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
        let batchPrompt = `\n\n[BATCH MODE GENERATION (CRITICAL)]: ĐÂY LÀ PHẦN ${i+1}/${totalBatches}. BẠN BẮT BUỘC PHẢI TẠO CHÍNH XÁC ${expectedCount} CẢNH (từ cảnh số ${startScene} đến cảnh số ${endScene}) trong tổng số ${sceneCount} cảnh. VIỆC TẠO THIẾU CẢNH LÀ LỖI RẤT NGHIÊM TRỌNG! Trả về mảng JSON chứa ĐÚNG ${expectedCount} cảnh này. MỖI CẢNH PHẢI CÓ ĐẦY ĐỦ CHI TIẾT (Tuyệt đối không được viết tắt, không được để trống trường dialogues, voice_text, video_prompt, visual_desc_vi).`;

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
          `TOPIC: "${topic}"\nDURATION: ${duration}m\nSCENE_COUNT: ${sceneCount}\nTARGET_MARKET: ${mkt.name}\nNATIVE_LANGUAGE: ${mkt.voice_lang}\nCULTURAL_CONTEXT: ${mkt.culture}\nVISUAL_STYLE: ${styleName}${pacingPrompt}\n[ANTI-REPETITION SEED]: ${seed}${characterPrompt}${modeInstruction}${contextBlock}${batchPrompt}\n\nCRITICAL INSTRUCTION:\n1. Write VOICE_TEXT and DIALOGUES in "${mkt.voice_lang}"\n2. BẮT BUỘC số lượng từ của mỗi phân cảnh KHÔNG VƯỢT QUÁ ${activeProfile.maxWords} từ để khớp nhịp đọc WPM.\n3. DO NOT just translate from Vietnamese.\n4. GENERATE JSON OBJECT.`,
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
    if (!segments.length) return showToast(uiLang === 'vi' ? 'Chưa có kịch bản!' : 'No script!');
    setRefining(true);
    try {
      const activeProfile = AUDIENCE_PROFILES.find(ap => ap.id === audienceProfile) || AUDIENCE_PROFILES[1];
      const input = segments.map(s => ({
        scene_number: s.scene_number, voice_text: s.voice_text || s.chapter_voice_block || '',
        visual_context: s.visual_desc_vi || s.visual_desc || '', section: s.section || '', character: s.character || '', time: s.time || '',
      }));
      const res = await callGemini(
        `KỊCH BẢN GỐC (${input.length} scenes):\n${JSON.stringify(input, null, 2)}\n\nTINH CHỈNH THANH ÂM CHO TẤT CẢ ${input.length} SCENES. Đối tượng nhịp độ mục tiêu: ${activeProfile.label} - Giới hạn từ nghiêm ngặt: ${activeProfile.maxWords} từ/cảnh. RESPOND IN ${uiLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.`,
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

          {/* === NỘI DUNG / BỐI CẢNH === */}
          <div className="mb-6">
            <textarea
              value={contentContext}
              onChange={e => setContentContext(e.target.value)}
              className="w-full bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600 transition-colors min-h-[100px] resize-y leading-relaxed"
              placeholder={uiLang === 'vi' ? "Dán nội dung bài viết, trích đoạn kinh điển, câu chuyện, hoặc bối cảnh bạn muốn AI dựa vào để viết kịch bản..." : "Paste article content, quotes, stories you want the AI to base the script on..."}
            />
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <i className="fa-solid fa-info-circle" /> {uiLang === 'vi' ? 'Nhập nội dung gốc để AI viết kịch bản sát ý hơn. Để trống nếu muốn AI tự sáng tạo.' : 'Enter original content for a more accurate script. Leave empty for AI creativity.'}
            </div>
          </div>

          {/* === GENERATION MODE === */}
          <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 mb-6">
            <label className="text-xs font-bold text-amber-400 uppercase mb-3 block flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles" /> {uiLang === 'vi' ? 'ĐỊNH HƯỚNG NỘI DUNG SÁNG TẠO' : 'CREATIVE DIRECTION'}
            </label>
            <div className="grid grid-cols-2 gap-3 mb-1">
              <button 
                type="button"
                onClick={() => setGenMode('creative')}
                className={`p-3 rounded-lg border text-center transition-all font-bold text-[11px] flex items-center justify-center gap-2 ${
                  genMode === 'creative' 
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                    : 'bg-[#0a0e14] border-slate-700/50 text-slate-400 hover:bg-[#10141c] hover:text-white'
                }`}
              >
                <i className="fa-solid fa-compass text-[13px]" /> {uiLang === 'vi' ? 'Sáng Tạo Mới' : 'Creative'}
              </button>
              <button 
                type="button"
                onClick={() => setGenMode('competitor')}
                className={`p-3 rounded-lg border text-center transition-all font-bold text-[11px] flex items-center justify-center gap-2 ${
                  genMode === 'competitor' 
                    ? 'bg-violet-950/30 border-violet-500/50 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]' 
                    : 'bg-[#0a0e14] border-slate-700/50 text-slate-400 hover:bg-[#10141c] hover:text-white'
                }`}
              >
                <i className="fa-solid fa-copy text-[13px]" /> {uiLang === 'vi' ? 'Bám Sát Đối Thủ' : 'Follow Competitor'}
              </button>
            </div>
            {genMode === 'competitor' && (
              <div className="space-y-1.5 animate-[fadeIn_0.3s_ease-out] mt-3">
                <label className="text-[10px] font-bold text-violet-400 uppercase block">{uiLang === 'vi' ? 'Dán Kịch Bản Gốc / Transcript Đối Thủ' : 'Paste Competitor Script/Transcript'}</label>
                <textarea 
                  value={competitorScript} 
                  onChange={e => setCompetitorScript(e.target.value)} 
                  className="w-full bg-[#0a0e14] border border-violet-500/30 rounded-lg p-3 text-xs text-white outline-none focus:border-violet-500/50 placeholder-slate-600 min-h-[100px] resize-none"
                  placeholder={uiLang === 'vi' ? "Dán kịch bản video viral của đối thủ vào đây. AI sẽ bóc tách cấu trúc để tạo ra kịch bản mới cho bạn..." : "Paste viral competitor script. AI will analyze its structure to generate yours..."}
                />
              </div>
            )}
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

          {/* Niche Pillar & Character Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#10141c] border border-teal-500/20 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-teal-400 uppercase mb-2 block flex items-center gap-2">
                <i className="fa-solid fa-leaf text-teal-400" /> {uiLang === 'vi' ? 'CHỌN TRỤ CỘT NỘI DUNG' : 'SELECT CONTENT PILLAR'}
              </label>
              <select value={dharmaTopic} onChange={e => setDharmaTopic(e.target.value)}
                className="w-full bg-[#0a0e14] border border-teal-500/50 rounded-lg p-3 text-sm text-white outline-none cursor-pointer">
                {NICHE_PILLARS.map(dt => <option key={dt.id} value={dt.id}>{dt.label}</option>)}
              </select>
            </div>

            <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                <i className="fa-solid fa-users text-amber-400" /> {uiLang === 'vi' ? 'SỐ LƯỢNG NHÂN VẬT' : 'NUMBER OF CHARACTERS'}
              </label>
              <div className="flex bg-[#0a0e14] p-1 rounded-lg border border-slate-700/50">
                <button type="button" onClick={() => setCharMode('monologue')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all ${charMode === 'monologue' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border border-transparent text-slate-400 hover:text-slate-200'}`}>
                  <i className="fa-solid fa-user" /> {uiLang === 'vi' ? '1 Nhân Vật (Xuyên Suốt)' : '1 Character (Monologue)'}
                </button>
                <button type="button" onClick={() => setCharMode('dialogue')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all ${charMode === 'dialogue' ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border border-transparent text-slate-400 hover:text-slate-200'}`}>
                  <i className="fa-solid fa-users" /> {uiLang === 'vi' ? '2 Nhân Vật (Thay Phiên)' : '2 Characters (Dialogue)'}
                </button>
              </div>
            </div>
          </div>

          {/* Audience pacing profile selector */}
          <div className="bg-[#10141c] border border-cyan-500/20 rounded-xl p-4">
            <label className="text-xs font-bold text-cyan-400 uppercase mb-3 block flex items-center gap-2">
              <i className="fa-solid fa-gauge-high text-cyan-400" /> {uiLang === 'vi' ? 'HỒ SƠ ĐỐI TƯỢNG & NHỊP ĐỘ' : 'AUDIENCE PROFILE & PACING'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {AUDIENCE_PROFILES.map(ap => (
                <div key={ap.id} onClick={() => setAudienceProfile(ap.id)} title={ap.desc}
                  className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between transition-all ${audienceProfile === ap.id ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white font-bold' : 'bg-[#0a0e14] border-slate-700/50 hover:border-slate-500 text-slate-400'}`}>
                  <div className="text-xs leading-tight mb-1">{ap.label}</div>
                  <div className="text-[10px] opacity-75">{uiLang === 'vi' ? `Tối đa ${ap.maxWords} từ` : `Max ${ap.maxWords} words`}</div>
                </div>
              ))}
            </div>
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
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> {batchProgress.total > 0 ? (uiLang === 'vi' ? `Đang tạo phần ${batchProgress.current}/${batchProgress.total}...` : `Generating batch ${batchProgress.current}/${batchProgress.total}...`) : loadingMsgs[msgIdx]}</>
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
          {segments.map((seg, i) => <SceneCard key={i} seg={seg} idx={i} uiLang={uiLang} audienceProfile={audienceProfile} />)}
        </div>
      )}
    </div>
  );
}
