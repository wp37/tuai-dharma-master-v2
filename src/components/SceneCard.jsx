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
            <div className="text-[9px] text-slate-400 italic flex-1">{seg.pacing_warning || 'Nhịp độ ổn định'}</div>
          </div>
        )}
        {seg.sfx_music_suggestion && (
          <div className="mt-2 p-2 rounded bg-blue-900/10 border border-blue-500/20">
            <div className="text-[9px] font-bold text-blue-400 flex items-center gap-1 mb-1"><i className="fa-solid fa-music" /> ASMR / AUDIO FX</div>
            <div className="text-[10px] text-blue-200/80">{seg.sfx_music_suggestion}</div>
          </div>
        )}
        {seg.strategy_note && (
          <div className="mt-2 p-2 rounded bg-amber-900/10 border border-amber-500/20 text-[10px] text-amber-200/80 italic">💡 {seg.strategy_note}</div>
        )}
      </div>

      {/* Voice & Dialogue */}
      <div className="bg-[#10141c]/50 p-3 rounded border border-slate-700/30">
        <div className="flex justify-between items-center mb-1">
          <div className="text-[10px] text-teal-400 font-bold flex items-center gap-1"><i className="fa-solid fa-microphone-alt" /> VOICE & DIALOGUE</div>
          <button onClick={() => {
            const text = seg.dialogues ? seg.dialogues.map(d => `${d.character_name}: ${d.line}`).join('\n\n') : seg.voice_text || '';
            navigator.clipboard.writeText(text);
            showToast('✅ Copied!', 'success');
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
                <div className="text-[9px] text-slate-500 font-bold mb-1 uppercase">Dẫn truyền:</div>
                <p className="text-xs text-slate-400 italic leading-relaxed text-justify">{seg.voice_text}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-amber-100 font-medium italic leading-relaxed text-justify">"{seg.chapter_voice_block || seg.voice_text || '(Đọc tiếp...)'}"</p>
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
                ['AGE & DETAILS', seg.voice_profile.age || (seg.voice_profile.gender ? seg.voice_profile.gender : 'Chưa rõ')],
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
