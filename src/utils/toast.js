let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info') {
  const container = ensureContainer();
  const toast = document.createElement('div');
  const colors = {
    success: 'background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;',
    error: 'background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;',
    info: 'background:rgba(245,166,35,0.15);border:1px solid rgba(245,166,35,0.3);color:#fcd34d;',
  };
  toast.style.cssText = `${colors[type] || colors.info}padding:12px 20px;border-radius:12px;font-size:13px;font-family:Inter,sans-serif;font-weight:500;backdrop-filter:blur(12px);pointer-events:auto;animation:slideIn 0.3s ease-out;max-width:400px;box-shadow:0 8px 32px rgba(0,0,0,0.3);`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
