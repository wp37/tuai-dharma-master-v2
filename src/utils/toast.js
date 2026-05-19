let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:420px;width:calc(100vw - 40px);';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  const colors = {
    success: 'background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7;',
    error: 'background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.35);color:#fca5a5;',
    info: 'background:rgba(245,166,35,0.15);border:1px solid rgba(245,166,35,0.3);color:#fcd34d;',
    warning: 'background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.35);color:#fde68a;',
  };

  // Truncate extremely long messages
  let displayMsg = message;
  if (displayMsg && displayMsg.length > 200) {
    displayMsg = displayMsg.substring(0, 180) + '...';
  }

  // Longer display for errors
  const displayDuration = type === 'error' ? Math.max(duration, 5000) : duration;

  toast.style.cssText = `${colors[type] || colors.info}padding:14px 20px;border-radius:12px;font-size:13px;line-height:1.5;font-family:Inter,sans-serif;font-weight:500;backdrop-filter:blur(16px);pointer-events:auto;animation:slideIn 0.3s ease-out;max-width:100%;box-shadow:0 8px 32px rgba(0,0,0,0.4);word-wrap:break-word;overflow-wrap:break-word;cursor:pointer;transition:opacity 0.3s;`;
  toast.textContent = displayMsg;
  
  // Click to dismiss
  toast.addEventListener('click', () => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, displayDuration);
}
