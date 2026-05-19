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
            />
          </div>
          <div style={{ display: tab === 'studio' ? 'block' : 'none' }}>
            <StudioModule segments={segments} topic={topic} uiLang={uiLang} />
          </div>
          <div style={{ display: tab === 'seo' ? 'block' : 'none' }}>
            <SEOModule initialTopic={initialTopic} uiLang={uiLang} />
          </div>
        </div>
      </main>

      <footer className="relative border-t border-amber-900/20 py-6 bg-[#0a0e14]">
        <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
          <div className="text-slate-500 text-xs font-light tracking-wide">
            Copyright © {new Date().getFullYear()} <span className="text-slate-300 font-bold uppercase ml-1">TUAI</span>.
            <span className="ml-2 text-slate-600">{uiLang === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}</span>
          </div>
        </div>
      </footer>

      <ConfigModal isOpen={configOpen} onClose={() => { setConfigOpen(false); setKeyCount(getKeyCount()); }} uiLang={uiLang} />
    </div>
  );
}
