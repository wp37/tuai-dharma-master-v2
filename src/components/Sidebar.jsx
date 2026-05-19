const TABS = [
  { id: 'spy', icon: 'fa-eye', num: '1', label_vi: 'TREND SCOUT', sub_vi: 'Chiến Lược Thị Trường', label_en: 'TREND SCOUT', sub_en: 'Market Strategy', color: 'text-red-400' },
  { id: 'script', icon: 'fa-om', num: '2', label_vi: 'STORY WEAVER', sub_vi: 'Biên Kịch Storyboard', label_en: 'STORY WEAVER', sub_en: 'Script & Storyboard', color: 'text-teal-400' },
  { id: 'studio', icon: 'fa-clapperboard', num: '3', label_vi: 'DHARMA STUDIO', sub_vi: 'Xưởng Sản Xuất Video', label_en: 'DHARMA STUDIO', sub_en: 'Video Production', color: 'text-cyan-400' },
  { id: 'seo', icon: 'fa-leaf', num: '4', label_vi: 'VIRAL SEO', sub_vi: 'Tối Ưu Viral & SEO', label_en: 'VIRAL SEO', sub_en: 'SEO & Distribution', color: 'text-amber-400' },
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
