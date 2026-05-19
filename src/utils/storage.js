const STORAGE_KEY = 'TUAI_DHARMA_MASTER_V2_KEYS';
let _keyIndex = 0;

export function getKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveKeys(keys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function addKey(key) {
  const keys = getKeys();
  if (!keys.includes(key)) { keys.push(key); saveKeys(keys); }
  return keys;
}

export function removeKey(key) {
  const keys = getKeys().filter(k => k !== key);
  saveKeys(keys);
  _keyIndex = 0;
  return keys;
}

export function getKeyCount() { return getKeys().length; }

export function getNextKey() {
  const keys = getKeys();
  if (keys.length === 0) return null;
  const key = keys[_keyIndex % keys.length];
  _keyIndex = (_keyIndex + 1) % keys.length;
  return key;
}

// Backward compatibility — now uses round-robin instead of random
export function getRandomKey() { return getNextKey(); }

export function hasKeys() { return getKeys().length > 0; }
