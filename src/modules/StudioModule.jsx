import { useState } from 'react';
import { generateImage } from '../utils/api';
import { showToast } from '../utils/toast';

function dl(content, name, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name; a.click();
}

export default function StudioModule({ segments, topic = '' }) {
  const [mode, setMode] = useState('video');
  const [imgs, setImgs] = useState({});
  const [gen, setGen] = useState(null);
  const [menu, setMenu] = useState(false);

  const copy = t => { navigator.clipboard.writeText(t); showToast('✅ Copied!', 'success'); };

  const doGen = async (i) => {
    if (gen !== null) return;
    setGen(i);
    try {
      const s = segments[i];
      const p = (mode === 'video' ? s.video_prompt : s.image_prompt) + (mode === 'video' ? ', 8k, cinematic' : ', masterpiece, 8k');
      const url = await generateImage(p, mode === 'video' ? '16:9' : '1:1');
      if (url) setImgs(v => ({ ...v, [`${i}_${mode}`]: url }));
      else showToast('Lỗi Safety/API', 'error');
    } catch (e) { showToast(e.message, 'error'); }
    finally { setGen(null); }
  };

  const expCSV = () => {
    let c = '\uFEFFScene,Time,Section,Voice,Video Prompt,Image Prompt\n';
    segments.forEach((s, i) => { c += `${i+1},"${s.time}","${s.section}","${(s.voice_text||'').replace(/"/g,'""')}","${(s.video_prompt||'').replace(/"/g,'""')}","${(s.image_prompt||'').replace(/"/g,'""')}"\n`; });
    dl(c, `${(topic||'script').replace(/\s+/g,'_')}_export.csv`, 'text/csv;charset=utf-8;');
    setMenu(false);
  };

  const expJSON = () => {
    dl(JSON.stringify({ version: '1.0', topic, segments }, null, 2), `${(topic||'project').replace(/\s+/g,'_')}.json`, 'application/json');
    setMenu(false); showToast('✅ Exported!', 'success');
  };

  if (!segments.length) return <div className="h-full flex items-center justify-center"><p className="text-slate-500 italic">Chưa có dữ liệu kịch bản. Hãy tạo kịch bản trước.</p></div>;

  return (
    <div className="flex flex-col h-full animate-[slideIn_0.4s_ease-out]">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fa-solid fa-clapperboard text-cyan-500"/> Studio Sáng Tạo</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#12161e] rounded p-1 border border-slate-700/30">
            {['video','image'].map(m=>(
              <button key={m} onClick={()=>setMode(m)} className={`px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 ${mode===m?(m==='video'?'bg-cyan-900/50 text-cyan-100':'bg-purple-900/50 text-purple-100')+' shadow':'text-slate-400 hover:text-white'}`}>
                <i className={`fa-solid fa-${m==='video'?'video':'image'}`}/> {m==='video'?'VIDEO':'ẢNH'}
              </button>
            ))}
          </div>
          <div className="relative">
            <button onClick={()=>setMenu(!menu)} className="px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 bg-green-900/40 text-green-300 border border-green-500/20">
              <i className="fa-solid fa-download"/> Tải ▾
            </button>
            {menu&&<div className="absolute right-0 top-full mt-2 w-44 bg-[#12161e] border border-slate-700/30 rounded-xl shadow-xl z-50">
              <button onClick={expJSON} className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-slate-800/20 border-b border-slate-700/30"><i className="fa-solid fa-file-code text-amber-500 mr-2"/>Dự Án (.json)</button>
              <button onClick={expCSV} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/20"><i className="fa-solid fa-file-excel text-green-500 mr-2"/>Excel Kịch Bản</button>
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
                  {gen===i?<><i className="fa-solid fa-sync animate-spin"/> Đang tạo...</>:<><i className="fa-solid fa-magic"/> Tạo {mode==='video'?'Video':'Ảnh'}</>}
                </button>
              </div>
              <div className={`w-full sm:w-64 bg-[#0a0e14] rounded border border-slate-700/30 overflow-hidden shrink-0 flex items-center justify-center ${mode==='video'?'aspect-video':'aspect-square'}`}>
                {img?<div className="relative group w-full h-full"><img src={img} className="w-full h-full object-cover"/><div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[8px] font-black text-amber-400">TUAI STUDIO V2</div></div>
                :<div className="text-center p-4"><i className={`fa-solid fa-${mode==='video'?'film':'image'} text-2xl mb-2 opacity-50`}/><div className="text-[10px] text-slate-500">Chưa có</div></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
