import { memo } from 'react';
import { showToast } from '../utils/toast';
import { AUDIENCE_PROFILES } from '../config/styles';

const SceneCard = memo(({ seg, idx, uiLang, audienceProfile }) => {
  // 1. Dynamic Word Count Helper
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const getVoiceText = () => {
    if (seg.dialogues && Array.isArray(seg.dialogues) && seg.dialogues.length > 0) {
      return seg.dialogues.map(d => d.line || '').join(' ');
    }
    return seg.chapter_voice_block || seg.voice_text || '';
  };

  const voiceTextStr = getVoiceText();
  const currentWords = countWords(voiceTextStr);

  // 2. Fetch Active Audience Profile and Pacing Metrics
  const activeProfile = AUDIENCE_PROFILES.find(ap => ap.id === audienceProfile) || AUDIENCE_PROFILES.find(ap => ap.id === 'millennial');
  const maxWords = activeProfile ? activeProfile.maxWords : 18;
  const percent = maxWords > 0 ? (currentWords / maxWords) * 100 : 0;

  return (
    <div className="bg-[#12161e] border border-slate-700/30 p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:border-teal-500/30 transition-colors relative shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]">
      {/* Scene info */}
      <div className="w-full sm:w-24 shrink-0 text-center pt-1 border-r border-slate-700/30 pr-2">
        <div className="text-[10px] bg-[#1a202c] px-2 py-1 rounded font-bold text-slate-200 mb-1 border border-slate-700/50">
          SCENE {seg.scene_number || idx + 1}
        </div>
        <div className="text-[9px] text-slate-500 font-mono mb-1">{seg.time}</div>
        <div className="text-[9px] text-teal-400 font-bold uppercase break-words">{seg.section}</div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual & Audio Design */}
        <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1 mb-1.5">
              <i className="fa-solid fa-eye" /> HÌNH ẢNH (VISUAL)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{seg.visual_desc_vi || seg.visual_desc}</p>
          </div>

          <div className="mt-3 space-y-2">
            {/* Pacing Badge */}
            {seg.pacing_score !== undefined && (
              <div className="bg-black/30 p-2 rounded border border-slate-800 flex items-center gap-2">
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${seg.pacing_score >= 8 ? 'bg-green-950/60 border border-green-500/30 text-green-400' : seg.pacing_score >= 5 ? 'bg-amber-950/60 border border-amber-500/30 text-amber-400' : 'bg-red-950/60 border border-red-500/30 text-red-400'}`}>
                  PACING: {seg.pacing_score}/10
                </div>
                <div className="text-[9px] text-slate-400 italic flex-1 truncate">{seg.pacing_warning || (uiLang === 'vi' ? 'Nhịp độ ổn định' : 'Pacing stable')}</div>
              </div>
            )}

            {/* 3-Layer Audio Design Panel */}
            {((seg.audio_layers && (seg.audio_layers.layer_1_bed || seg.audio_layers.layer_2_env || seg.audio_layers.layer_3_punctuation)) || seg.sfx_music_suggestion) && (
              <div className="p-3 rounded-lg bg-cyan-950/10 border border-cyan-500/20 space-y-2">
                <div className="text-[10px] font-bold text-cyan-400 flex items-center gap-1.5 border-b border-cyan-500/10 pb-1.5">
                  <i className="fa-solid fa-sliders text-cyan-400" /> THIẾT KẾ PHỐI ÂM 3 LỚP (AUDIO DESIGN)
                </div>
                
                {seg.audio_layers ? (
                  <div className="grid grid-cols-1 gap-1.5">
                    <div className="bg-[#0a0e14]/40 p-1.5 rounded border border-cyan-950/50 flex gap-2 items-start">
                      <div className="text-[8px] bg-cyan-500/20 text-cyan-300 font-bold px-1 py-0.5 rounded uppercase shrink-0 font-mono tracking-wider">Layer 1 (Bed)</div>
                      <div className="text-[10px] text-slate-300 leading-tight flex-1">{seg.audio_layers.layer_1_bed || 'Nhạc thiền ambient thanh tịnh'}</div>
                    </div>
                    <div className="bg-[#0a0e14]/40 p-1.5 rounded border border-cyan-950/50 flex gap-2 items-start">
                      <div className="text-[8px] bg-teal-500/20 text-teal-300 font-bold px-1 py-0.5 rounded uppercase shrink-0 font-mono tracking-wider">Layer 2 (Env)</div>
                      <div className="text-[10px] text-slate-300 leading-tight flex-1">{seg.audio_layers.layer_2_env || 'ASMR môi trường thiên nhiên'}</div>
                    </div>
                    <div className="bg-[#0a0e14]/40 p-1.5 rounded border border-cyan-950/50 flex gap-2 items-start">
                      <div className="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1 py-0.5 rounded uppercase shrink-0 font-mono tracking-wider">Layer 3 (Punc)</div>
                      <div className="text-[10px] text-slate-300 leading-tight flex-1">{seg.audio_layers.layer_3_punctuation || 'Điểm chốt chuông mõ thiền vị'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-300 leading-normal italic bg-[#0a0e14]/30 p-2 rounded">
                    {seg.sfx_music_suggestion}
                  </div>
                )}
              </div>
            )}

            {/* Visual strategy suggestion if any */}
            {seg.strategy_note && (
              <div className="p-2 rounded bg-amber-950/10 border border-amber-500/10 text-[10px] text-amber-300/80 italic">
                💡 {seg.strategy_note}
              </div>
            )}
          </div>
        </div>

        {/* Voice & Dialogues */}
        <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] text-teal-400 font-bold flex items-center gap-1">
                <i className="fa-solid fa-microphone-lines text-teal-400" /> THOẠI & NARRATION
              </div>
              <button 
                onClick={() => {
                  const text = seg.dialogues && seg.dialogues.length > 0
                    ? seg.dialogues.map(d => `${d.character_name}: ${d.line}`).join('\n\n')
                    : seg.chapter_voice_block || seg.voice_text || '';
                  navigator.clipboard.writeText(text);
                  showToast(uiLang === 'vi' ? '✅ Đã sao chép lời thoại!' : '✅ Copied dialogue!', 'success');
                }} 
                className="text-slate-500 hover:text-white p-1 hover:bg-[#12161e] rounded transition-all"
                title={uiLang === 'vi' ? 'Sao chép thoại' : 'Copy dialogue'}
              >
                <i className="fa-regular fa-copy" />
              </button>
            </div>

            {/* Word Budget Progress Indicator */}
            <div className="mb-4 bg-[#0a0e14]/40 border border-slate-700/30 rounded-lg p-2.5 flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <i className="fa-solid fa-calculator text-slate-500" /> Ngân sách thoại: <strong className="text-slate-200">{currentWords}</strong> / {maxWords} từ
                </span>
                <span className={`font-mono font-bold ${percent > 100 ? 'text-red-400 animate-pulse' : percent >= 85 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {percent.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, percent)}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${percent > 100 ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse' : percent >= 85 ? 'bg-gradient-to-r from-yellow-600 to-amber-500' : 'bg-gradient-to-r from-green-600 to-emerald-500'}`}
                />
              </div>
              <div className="text-[9px] flex items-center gap-1 pt-0.5">
                {percent > 100 ? (
                  <span className="text-red-400 font-medium flex items-center gap-1">
                    <i className="fa-solid fa-circle-exclamation text-red-500 animate-pulse" /> ⚠️ Vượt ngân sách thoại! Hãy lược bớt {currentWords - maxWords} từ để bảo đảm nhịp độ.
                  </span>
                ) : percent >= 85 ? (
                  <span className="text-yellow-400 font-medium flex items-center gap-1">
                    <i className="fa-solid fa-triangle-exclamation text-yellow-500" /> ⚠️ Sắp chạm giới hạn từ. Nhịp độ thoại khá đầy.
                  </span>
                ) : (
                  <span className="text-green-400 font-medium flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-green-500" /> ✅ Nhịp độ thoại an toàn.
                  </span>
                )}
              </div>
            </div>

            {/* Dialogues render */}
            {seg.dialogues && Array.isArray(seg.dialogues) && seg.dialogues.length > 0 ? (
              <div className="space-y-2 mt-2">
                {seg.dialogues.map((d, i) => (
                  <div key={i} className="bg-[#0a0e14]/50 rounded p-2.5 border-l-2 border-amber-500/50">
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
                    <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">{uiLang === 'vi' ? 'Dẫn truyền:' : 'Narration:'}</div>
                    <p className="text-xs text-slate-400 italic leading-relaxed text-justify">{seg.voice_text}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-amber-100 font-medium italic leading-relaxed text-justify bg-[#0a0e14]/30 p-3 rounded-lg border border-slate-800">
                "{seg.chapter_voice_block || seg.voice_text || (uiLang === 'vi' ? '(Đọc tiếp...)' : '(Continue...)')}"
              </p>
            )}
          </div>

          {/* Voice Profile */}
          {seg.voice_profile && (
            <div className="mt-3 p-2.5 bg-purple-950/20 rounded-lg border border-purple-500/20 space-y-1.5 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                  <i className="fa-solid fa-circle-user" /> {seg.voice_profile.speaker}
                </div>
                <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${seg.voice_profile.state === 'ON-SCREEN' ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  {seg.voice_profile.state}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  ['AGE & DETAILS', seg.voice_profile.age || (seg.voice_profile.gender ? seg.voice_profile.gender : 'Chưa rõ')],
                  ['ACCENT', seg.voice_profile.accent || 'NORTHERN_VIETNAMESE'],
                  ['TIMBRE', seg.voice_profile.timbre || 'Ấm áp'],
                  ['TONE', seg.voice_profile.tone || 'Truyền cảm'],
                  ['SPEED', seg.voice_profile.pacing_speed || seg.voice_profile.pacing || 'Normal'],
                ].map(([label, val]) => (
                  <div key={label} className="bg-[#0a0e14]/30 rounded p-1 border border-purple-900/20">
                    <div className="text-[8px] text-purple-500 font-bold">{label}</div>
                    <div className="text-[9px] text-slate-300 truncate" title={val}>{val}</div>
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
  );
});

SceneCard.displayName = 'SceneCard';
export default SceneCard;
