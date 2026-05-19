const STORAGE_KEY = 'TUAI_DHARMA_MASTER_V2_KEYS';
const EXHAUSTED_KEY = 'TUAI_EXHAUSTED_KEYS';
const COOLDOWN_MS = 60_000; // 1 minute cooldown per key
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
  // Clear exhaustion status for newly added key
  clearKeyExhaustion(key);
  return keys;
}

export function removeKey(key) {
  const keys = getKeys().filter(k => k !== key);
  saveKeys(keys);
  clearKeyExhaustion(key);
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

// ─── Exhaustion tracking (temporary cooldown) ───
function getExhaustedMap() {
  try {
    const raw = localStorage.getItem(EXHAUSTED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveExhaustedMap(map) {
  localStorage.setItem(EXHAUSTED_KEY, JSON.stringify(map));
}

export function markKeyExhausted(key) {
  const map = getExhaustedMap();
  map[key] = Date.now();
  saveExhaustedMap(map);
}

function clearKeyExhaustion(key) {
  const map = getExhaustedMap();
  delete map[key];
  saveExhaustedMap(map);
}

function isKeyExhausted(key) {
  const map = getExhaustedMap();
  const ts = map[key];
  if (!ts) return false;
  // Auto-clear after cooldown
  if (Date.now() - ts > COOLDOWN_MS) {
    clearKeyExhaustion(key);
    return false;
  }
  return true;
}

/**
 * Get a working key (not currently in cooldown).
 * Falls back to round-robin if all keys are exhausted.
 */
export function getWorkingKey() {
  const keys = getKeys();
  if (keys.length === 0) return null;

  // First pass: find a key not in cooldown
  for (let i = 0; i < keys.length; i++) {
    const idx = (_keyIndex + i) % keys.length;
    if (!isKeyExhausted(keys[idx])) {
      _keyIndex = (idx + 1) % keys.length;
      return keys[idx];
    }
  }

  // All exhausted, fallback to round-robin anyway
  const key = keys[_keyIndex % keys.length];
  _keyIndex = (_keyIndex + 1) % keys.length;
  return key;
}

// Backward compatibility — now uses round-robin instead of random
export function getRandomKey() { return getNextKey(); }

export function hasKeys() { return getKeys().length > 0; }
