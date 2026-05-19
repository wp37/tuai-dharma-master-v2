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
          {uiLang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
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
