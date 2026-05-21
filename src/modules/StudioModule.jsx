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

  const copy = t => { navigator.clipboard.writeText(t); showToast('✅ Copied!', 'success'); };

  const doGen = async (i) => {
    if (gen !== null) return;
    setGen(i);
    try {
      const s = segments[i];
      const p = (mode === 'video' ? s.video_prompt : s.image_prompt) + (mode === 'video' ? ', 8k, cinematic' : ', masterpiece, 8k');
      const url = await generateImage(p, mode === 'video' ? '16:9' : '1:1');
      if (url) setImgs(v => ({ ...v, [`${i}_${mode}`]: url }));
      else showToast(uiLang === 'vi' ? 'Lỗi Safety/API' : 'Safety/API Error', 'error');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setGen(null); }
  };

  const getTimestamp = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
  };
  const slug = (topic||'script').replace(/\s+/g,'_');

  const expCSV = () => {
    let c = '\uFEFFScene,Time,Section,Character,Voice,Speaker,Gender,Age,Accent,Timbre,Tone,Pacing,Speed,Words,End Time,State,Audio Layer 1 Bed,Audio Layer 2 Env,Audio Layer 3 Punc,Audio SFX ASMR Music,Video Prompt,Image Prompt\n';
    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      const l1 = s.audio_layers?.layer_1_bed || '';
      const l2 = s.audio_layers?.layer_2_env || '';
      const l3 = s.audio_layers?.layer_3_punctuation || '';
      const voice = s.dialogues && s.dialogues.length > 0
        ? s.dialogues.map(d => `${d.character_name}: ${d.line}`).join(' | ')
        : s.voice_text || s.chapter_voice_block || '';

      c += `${i+1},"${s.time||''}","${s.section||''}","${(s.character||'').replace(/"/g,'""')}","${voice.replace(/"/g,'""')}","${(vp.speaker||s.character||'').replace(/"/g,'""')}","${vp.gender||''}","${vp.age||''}","${vp.accent||''}","${vp.timbre||''}","${vp.tone||''}","${vp.pacing||''}","${vp.pacing_speed||''}","${s.word_count||''}","${s.audio_end_time||''}","${vp.state||''}","${l1.replace(/"/g,'""')}","${l2.replace(/"/g,'""')}","${l3.replace(/"/g,'""')}","${(s.sfx_music_suggestion||'').replace(/"/g,'""')}","${(s.video_prompt||'').replace(/"/g,'""')}","${(s.image_prompt||'').replace(/"/g,'""')}"\n`;
    });
    dl(c, `${slug}_kich_ban_${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
    setMenu(false);
  };

  const expJSON = () => {
    dl(JSON.stringify({ version: '2.0', topic, segments }, null, 2), `${slug}_${getTimestamp()}.json`, 'application/json');
    setMenu(false); showToast('✅ Exported!', 'success');
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

  // Sound Design Sheet Exports
  const expSoundCSV = () => {
    let c = '\uFEFFScene,Time,Speaker,Voice Text,Layer 1 (Bed),Layer 2 (ASMR Env),Layer 3 (Punctuation),Suggested Audio SFX\n';
    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      const layer1 = s.audio_layers?.layer_1_bed || '';
      const layer2 = s.audio_layers?.layer_2_env || '';
      const layer3 = s.audio_layers?.layer_3_punctuation || '';
      const voice = s.dialogues && s.dialogues.length > 0
        ? s.dialogues.map(d => `${d.character_name}: ${d.line}`).join(' | ')
        : s.voice_text || s.chapter_voice_block || '';

      c += `${i+1},"${s.time||''}","${(vp.speaker||s.character||'Dẫn chuyện').replace(/"/g,'""')}","${voice.replace(/"/g,'""')}","${layer1.replace(/"/g,'""')}","${layer2.replace(/"/g,'""')}","${layer3.replace(/"/g,'""')}","${(s.sfx_music_suggestion||'').replace(/"/g,'""')}"\n`;
    });
    dl(c, `${slug}_phoi_am_3_lop_${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
    setMenu(false);
  };

  const expSoundTXT = () => {
    let txt = `=======================================================\n`;
    txt += `🎵 BẢN HƯỚNG DẪN PHỐI ÂM 3 LỚP (SOUND DESIGN SHEET)\n`;
    txt += `Chủ đề: ${topic || 'Không tên'}\n`;
    txt += `Thời gian xuất: ${new Date().toLocaleString()}\n`;
    txt += `=======================================================\n\n`;

    segments.forEach((s, i) => {
      const vp = s.voice_profile || {};
      const voice = s.dialogues && s.dialogues.length > 0
        ? s.dialogues.map(d => `${d.character_name}: "${d.line}"`).join('\n   ')
        : `"${s.voice_text || s.chapter_voice_block || ''}"`;

      txt += `🎬 PHÂN CẢNH ${i+1} [Thời gian: ${s.time || '8s'} | Phân đoạn: ${s.section || 'N/A'}]\n`;
      txt += `-------------------------------------------------------\n`;
      txt += `🎙️ GIỌNG ĐỌC (VOICE & DIALOGUE):\n`;
      txt += `   - Nhân vật/Giọng: ${vp.speaker || s.character || 'Dẫn chuyện'}\n`;
      txt += `   - Đặc điểm: Giới tính: ${vp.gender || 'N/A'} | Tuổi: ${vp.age || 'N/A'} | Vùng miền: ${vp.accent || 'N/A'}\n`;
      txt += `   - Chất giọng: ${vp.timbre || 'N/A'} | Cảm xúc: ${vp.tone || 'N/A'} | Tốc độ: ${vp.pacing_speed || vp.pacing || 'Normal'}\n`;
      txt += `   - Lời thoại:\n   ${voice}\n\n`;

      txt += `🔊 PHỐI ÂM 3 LỚP (3-LAYER SOUND DESIGN):\n`;
      if (s.audio_layers) {
        txt += `   🔹 Layer 1 (Bed - Nhạc nền): ${s.audio_layers.layer_1_bed || 'Nhạc thiền ambient/quê hương nhẹ nhàng'}\n`;
        txt += `   🔹 Layer 2 (Env - ASMR môi trường): ${s.audio_layers.layer_2_env || 'Môi trường ASMR'}\n`;
        txt += `   🔹 Layer 3 (Punc - Chuông mõ điểm nhấn): ${s.audio_layers.layer_3_punctuation || 'Chuông mõ thiền vị'}\n`;
      } else {
        txt += `   🔹 Gợi ý âm thanh chung: ${s.sfx_music_suggestion || 'N/A'}\n`;
      }
      txt += `   🔹 Kết thúc thoại ở: ${s.audio_end_time || 'N/A'}\n\n`;

      txt += `🖼️ BỐI CẢNH HÌNH ẢNH (VISUAL):\n`;
      txt += `   - Mô tả: ${s.visual_desc_vi || s.visual_desc || 'N/A'}\n`;
      txt += `=======================================================\n\n`;
    });

    dl(txt, `${slug}_phoi_am_3_lop_${getTimestamp()}.txt`, 'text/plain;charset=utf-8;');
    setMenu(false);
  };

  if (!segments.length) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-slate-500 italic">{uiLang === 'vi' ? 'Chưa có dữ liệu kịch bản. Hãy tạo kịch bản trước.' : 'No script data. Create a script first.'}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-[slideIn_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-clapperboard text-cyan-500"/>
          {uiLang === 'vi' ? 'Studio Sáng Tạo' : 'Creative Studio'}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#12161e] rounded p-1 border border-slate-700/30">
            {['video','image'].map(m=>(
              <button key={m} onClick={()=>setMode(m)} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 ${mode===m?(m==='video'?'bg-cyan-900/50 text-cyan-100':'bg-purple-900/50 text-purple-100')+' shadow':'text-slate-400 hover:text-white'}`}>
                <i className={`fa-solid fa-${m==='video'?'video':'image'}`}/> {m==='video'?'VIDEO':(uiLang === 'vi' ? 'ẢNH' : 'IMAGE')}
              </button>
            ))}
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={()=>setMenu(!menu)} className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 bg-green-900/40 text-green-300 border border-green-500/20">
              <i className="fa-solid fa-download"/> {uiLang === 'vi' ? 'Tải' : 'Export'} ▾
            </button>
            {menu&&<div className="absolute right-0 top-full mt-2 w-64 bg-[#12161e] border border-slate-700/30 rounded-xl shadow-xl z-50 overflow-hidden">
              <button onClick={expJSON} className="w-full text-left px-4 py-2.5 text-xs text-amber-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-code text-amber-500"/>{uiLang === 'vi' ? 'Tải Dự Án (.json)' : 'Project (.json)'}</button>
              <button onClick={expCSV} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500"/>{uiLang === 'vi' ? 'Excel Kịch Bản (Bao gồm phối âm)' : 'Excel Script'}</button>
              
              <button onClick={expSoundCSV} className="w-full text-left px-4 py-2.5 text-xs text-cyan-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-table-cells text-cyan-400"/>{uiLang === 'vi' ? 'Excel Phối Âm 3 Lớp' : 'Excel Sound Design'}</button>
              <button onClick={expSoundTXT} className="w-full text-left px-4 py-2.5 text-xs text-cyan-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-lines text-cyan-400"/>{uiLang === 'vi' ? 'TXT Phối Âm 3 Lớp' : 'TXT Sound Design'}</button>

              <button onClick={expPromptVideoCSV} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500"/>{uiLang === 'vi' ? 'Excel Prompt Video' : 'Excel Video Prompts'}</button>
              <button onClick={expPromptImageCSV} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-excel text-green-500"/>{uiLang === 'vi' ? 'Excel Prompt Ảnh' : 'Excel Image Prompts'}</button>
              <button onClick={expPromptVideoTXT} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 border-b border-slate-700/30 flex items-center gap-2"><i className="fa-solid fa-file-lines text-blue-400"/>{uiLang === 'vi' ? 'TXT Prompt Video' : 'TXT Video Prompts'}</button>
              <button onClick={expPromptImageTXT} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800/30 flex items-center gap-2"><i className="fa-solid fa-file-lines text-blue-400"/>{uiLang === 'vi' ? 'TXT Prompt Ảnh' : 'TXT Image Prompts'}</button>
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
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{mode==='video'?'🎬 VIDEO PROMPT':'🖼️ IMAGE PROMPT'}</div>
                <div className="relative group">
                  <p className="text-xs text-slate-300 font-mono mb-3 bg-[#0a0e14]/50 p-3 rounded border border-slate-700/30 leading-relaxed pr-10">{prompt||'No prompt'}</p>
                  <button onClick={()=>copy(prompt||'')} className="absolute top-2 right-2 p-1.5 bg-[#12161e] text-slate-300 rounded hover:bg-blue-900/50 border border-slate-700/30"><i className="fa-solid fa-copy"/></button>
                </div>
                <button onClick={()=>doGen(i)} disabled={gen!==null} className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1 disabled:opacity-50 ${mode==='video'?'bg-cyan-900/20 text-cyan-400 border-cyan-500/20':'bg-purple-900/20 text-purple-400 border-purple-500/20'}`}>
                  {gen===i
                    ?<><i className="fa-solid fa-sync animate-spin"/> {uiLang === 'vi' ? 'Đang tạo...' : 'Generating...'}</>
                    :<><i className="fa-solid fa-magic"/> {uiLang === 'vi' ? (mode==='video'?'Tạo Video':'Tạo Ảnh') : (mode==='video'?'Generate Video':'Generate Image')}</>}
                </button>
              </div>
              <div className={`w-full sm:w-64 bg-[#0a0e14] rounded border border-slate-700/30 overflow-hidden shrink-0 flex items-center justify-center ${mode==='video'?'aspect-video':'aspect-square'}`}>
                {img?<div className="relative group w-full h-full"><img src={img} className="w-full h-full object-cover"/><div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[8px] font-black text-amber-400">TUAI STUDIO V2</div></div>
                :<div className="text-center p-4"><i className={`fa-solid fa-${mode==='video'?'film':'image'} text-2xl mb-2 opacity-50`}/><div className="text-[10px] text-slate-500">{uiLang === 'vi' ? 'Chưa có' : 'Empty'}</div></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
