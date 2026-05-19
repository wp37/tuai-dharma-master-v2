import { useState } from 'react';
import { addKey, removeKey, getKeys } from '../utils/storage';
import { showToast } from '../utils/toast';

export default function ConfigModal({ isOpen, onClose, uiLang }) {
  const [keys, setKeys] = useState(getKeys());
  const [newKey, setNewKey] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    const k = newKey.trim();
    if (!k) return showToast(uiLang === 'vi' ? 'Nhập API Key!' : 'Enter API Key!');
    if (!k.startsWith('AIza')) return showToast('Key không hợp lệ! (phải bắt đầu bằng AIza)', 'error');
    const updated = addKey(k);
    setKeys(updated);
    setNewKey('');
    showToast('✅ Đã thêm API Key!', 'success');
  };

  const handleRemove = (k) => {
    const updated = removeKey(k);
    setKeys(updated);
    showToast('Đã xóa key', 'info');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#12161e] border border-slate-700/30 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-gear text-amber-500" /> {uiLang === 'vi' ? 'Cấu Hình API Keys' : 'API Keys Config'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl"><i className="fa-solid fa-times" /></button>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-3">
            {uiLang === 'vi' ? 'Thêm Google Gemini API Key để sử dụng AI. Hỗ trợ nhiều key (round-robin).' : 'Add Google Gemini API Keys for AI. Supports multiple keys (round-robin).'}
          </p>
          <div className="flex gap-2">
            <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="AIzaSy..." onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-[#0a0e14] border border-slate-700/50 rounded-lg p-3 text-sm text-white outline-none focus:border-amber-500/50 placeholder-slate-600" />
            <button onClick={handleAdd} className="px-4 py-2 bg-amber-900/40 hover:bg-amber-800/40 border border-amber-500/30 text-amber-200 font-bold rounded-lg text-sm">
              <i className="fa-solid fa-plus" /> {uiLang === 'vi' ? 'Thêm' : 'Add'}
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {keys.length === 0 ? (
            <div className="text-center text-slate-500 py-6 italic text-sm">
              {uiLang === 'vi' ? 'Chưa có API Key nào.' : 'No API Keys added.'}
            </div>
          ) : keys.map((k, i) => (
            <div key={i} className="flex items-center justify-between bg-[#0a0e14] p-3 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <i className="fa-solid fa-key text-amber-500 text-xs" />
                <span className="text-sm text-slate-300 font-mono truncate">{k.slice(0, 10)}...{k.slice(-4)}</span>
              </div>
              <button onClick={() => handleRemove(k)} className="text-red-400 hover:text-red-300 ml-2"><i className="fa-solid fa-trash text-xs" /></button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/30 text-center">
          <span className="text-xs text-slate-500">{keys.length} key(s) {uiLang === 'vi' ? 'đã cấu hình' : 'configured'}</span>
        </div>
      </div>
    </div>
  );
}
