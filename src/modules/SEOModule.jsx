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
    if (!topic) return showToast(uiLang === 'vi' ? 'Nhập chủ đề SEO!' : 'Enter SEO topic!');
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
      if (url) { setThumbImgs(p => ({ ...p, [idx]: { url, loading: false } })); showToast('Đã tạo ảnh!', 'success'); }
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
    if (result.viral_titles) { txt += '\n3. TITLES\n'; result.viral_titles.forEach((t,i) => { txt += `${i+1}. ${t}\n`; }); }
    if (result.video_description?.full_description) txt += `\n4. DESCRIPTION\n${result.video_description.full_description}\n`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
    a.download = `${(topic||'seo').replace(/\s+/g,'_')}_seo.txt`; a.click();
    showToast('Đã tải!', 'success');
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
            placeholder={uiLang === 'vi' ? 'Nhập chủ đề video chữa lành...' : 'Enter topic...'} />
          <button onClick={analyze} disabled={loading}
            className="px-6 py-3 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-100 font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 shrink-0">
            {loading ? <><i className="fa-solid fa-sync animate-spin" /> {uiLang==='vi'?'ĐANG TỐI ƯU...':'OPTIMIZING...'}</>
              : <><i className="fa-solid fa-magic" /> {uiLang==='vi'?'Tối Ưu SEO':'Optimize SEO'}</>}
          </button>
          {result && <button onClick={exportSEO} className="px-4 py-3 bg-teal-900/40 border border-teal-500/30 text-teal-300 font-bold rounded-lg flex items-center gap-2 shrink-0">
            <i className="fa-solid fa-download" /> {uiLang==='vi'?'Tải SEO':'Export'}
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
                  <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase">🔑 KEYWORDS</h4>
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
                  <h4 className="text-xs font-bold text-teal-400 mb-3 uppercase">#️⃣ HASHTAGS</h4>
                  <div className="flex flex-wrap gap-2">{result.hashtags.map((h,i) => <button key={i} onClick={() => copy(h)} className="bg-teal-900/20 text-teal-300 px-3 py-1 rounded-lg text-sm border border-teal-500/20 hover:bg-teal-900/30">{h}</button>)}</div>
                  <button onClick={() => copy(result.hashtags.join(' '))} className="mt-2 text-xs text-teal-400 hover:underline"><i className="fa-solid fa-copy" /> Copy All</button>
                </div>
              )}
              {Array.isArray(result.viral_titles) && (
                <div className="bg-[#10141c] border border-slate-700/30 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-amber-400 mb-3 uppercase">⚡ VIRAL TITLES</h4>
                  <div className="space-y-2">{result.viral_titles.map((t,i) => (
                    <div key={i} className="flex justify-between items-center bg-[#0a0e14] p-2 rounded border border-slate-700/30">
                      <span className="text-sm text-white font-medium flex-1">{i+1}. {t}</span>
                      <button onClick={() => copy(t)} className="text-slate-500 hover:text-white ml-2"><i className="fa-solid fa-copy" /></button>
                    </div>
                  ))}</div>
                </div>
              )}
              {result.video_description?.full_description && (
                <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-green-400 mb-3 uppercase">📝 DESCRIPTION</h4>
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
                          {thumbImgs[i]?.loading ? <><i className="fa-solid fa-sync animate-spin" /> Đang Vẽ...</> : <><i className="fa-solid fa-palette" /> Vẽ Ảnh AI</>}
                        </button>}
                    </div>
                  ))}</div>
                </div>
              )}
            </> : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/20 border border-slate-700/30 border-dashed rounded-xl">
                <i className="fa-solid fa-seedling mb-2 opacity-50" />
                <p className="text-sm">{uiLang === 'vi' ? 'Nhập chủ đề để phân tích' : 'Enter topic to analyze'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
