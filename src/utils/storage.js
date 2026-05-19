const STORAGE_KEY = 'TUAI_DHARMA_MASTER_V2_KEYS';

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
  return keys;
}

export function getKeyCount() { return getKeys().length; }

export function getRandomKey() {
  const keys = getKeys();
  return keys.length > 0 ? keys[Math.floor(Math.random() * keys.length)] : null;
}

export function hasKeys() { return getKeys().length > 0; }
