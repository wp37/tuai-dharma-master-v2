import { getNextKey, getKeyCount, markKeyExhausted, getWorkingKey } from './storage';

// ─── Model fallback chain ───
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

// ─── Error classification ───
const QUOTA_KEYWORDS = ['quota', 'rate limit', 'rate-limit', 'resource exhausted', 'exceeded', '429', 'too many requests'];
const OVERLOAD_KEYWORDS = ['high demand', 'overloaded', 'temporarily unavailable', 'service unavailable', '503', 'capacity', 'try again later'];
const AUTH_KEYWORDS = ['api key', 'invalid', 'unauthorized', '401', '403', 'permission denied'];

function classifyError(message, httpStatus) {
  const lower = (message || '').toLowerCase();
  if (httpStatus === 503 || OVERLOAD_KEYWORDS.some(k => lower.includes(k))) return 'overload';
  if (httpStatus === 429 || QUOTA_KEYWORDS.some(k => lower.includes(k))) return 'quota';
  if (AUTH_KEYWORDS.some(k => lower.includes(k))) return 'auth';
  return 'unknown';
}

function friendlyError(rawMessage, type) {
  switch (type) {
    case 'quota':
      return '⏳ API đã hết quota (giới hạn miễn phí). Vui lòng chờ vài phút hoặc thêm API Key mới trong Cấu Hình.';
    case 'overload':
      return '🔄 Server AI đang quá tải. Hệ thống đã thử nhiều model nhưng đều bận. Vui lòng thử lại sau 1-2 phút.';
    case 'auth':
      return '🔑 API Key không hợp lệ hoặc đã hết hạn. Kiểm tra lại trong Cấu Hình.';
    default:
      if (rawMessage && rawMessage.length > 150) {
        return '❌ Lỗi API: ' + rawMessage.substring(0, 120) + '...';
      }
      return '❌ ' + (rawMessage || 'Lỗi không xác định');
  }
}

// ─── Sleep helper ───
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Retry helper with key rotation, model fallback & exponential backoff ───
async function withKeyRetry(apiCall) {
  const count = getKeyCount();
  if (count === 0) throw new Error('🔑 Chưa có API Key! Vui lòng thêm key trong ⚙️ Cấu Hình.');

  const maxAttempts = Math.min(count * 2, 6);
  let lastError;
  let lastErrorType = 'unknown';

  for (let i = 0; i < maxAttempts; i++) {
    const key = getWorkingKey();
    if (!key) break;

    try {
      const result = await apiCall(key);
      return result;
    } catch (e) {
      lastError = e;
      lastErrorType = e._errorType || classifyError(e.message);

      if (lastErrorType === 'overload') {
        // Server overloaded — exponential backoff, do NOT mark key as exhausted
        if (i < maxAttempts - 1) {
          await sleep(Math.min(2000 * Math.pow(2, i), 15000));
        }
        continue;
      }

      if (lastErrorType === 'quota') {
        markKeyExhausted(key);
        if (i < maxAttempts - 1) {
          await sleep(500 + i * 300);
        }
        continue;
      }

      if (lastErrorType === 'auth') {
        markKeyExhausted(key);
        continue;
      }

      // Unknown errors — small backoff
      if (i < maxAttempts - 1) {
        await sleep(1000 * (i + 1));
        continue;
      }
    }
  }

  const friendly = friendlyError(lastError?.message, lastErrorType);
  const error = new Error(friendly);
  error.errorType = lastErrorType;
  throw error;
}

// ─── Single Gemini API call (one model, one key) ───
async function callGeminiOnce(key, model, userPrompt, systemPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 65536,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `API Error: ${res.status}`;
    const error = new Error(msg);
    error._httpStatus = res.status;
    error._errorType = classifyError(msg, res.status);
    throw error;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Không nhận được phản hồi từ AI.');

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1].trim());
    throw new Error('Không thể phân tích JSON từ AI.');
  }
}

// ─── Gemini AI Text Generation (with model fallback chain) ───
export async function callGemini(userPrompt, systemPrompt) {
  return withKeyRetry(async (key) => {
    let lastError;
    for (const model of GEMINI_MODELS) {
      try {
        return await callGeminiOnce(key, model, userPrompt, systemPrompt);
      } catch (e) {
        lastError = e;
        const errorType = e._errorType || classifyError(e.message, e._httpStatus);
        // Only fallback to next model on overload/503, not on auth or other errors
        if (errorType === 'overload') {
          await sleep(1000);
          continue;
        }
        throw e; // re-throw quota, auth, or other errors immediately
      }
    }
    throw lastError;
  });
}

// ─── YouTube Metadata Fetch ───
export async function fetchYouTubeData(url) {
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;

  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.title) {
      const result = {
        title: data.title,
        author: data.author_name || 'Unknown',
        thumb: data.thumbnail_url || '',
        fullData: false,
      };

      if (videoId) {
        const key = getWorkingKey();
        if (key) {
          try {
            const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${key}`);
            const ytData = await ytRes.json();
            if (ytData.items?.[0]) {
              const item = ytData.items[0];
              result.description = item.snippet?.description || '';
              result.tags = (item.snippet?.tags || []).join(', ');
              result.viewCount = item.statistics?.viewCount || '0';
              result.likeCount = item.statistics?.likeCount || '0';
              result.fullData = true;
            }
          } catch { /* fallback to basic data */ }
        }
      }
      return result;
    }
  } catch { /* continue */ }

  throw new Error('Không thể lấy thông tin video. Kiểm tra lại link YouTube.');
}

// ─── Image Generation (Gemini Imagen) ───
export async function generateImage(prompt, aspectRatio = '16:9') {
  return withKeyRetry(async (key) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${key}`;
    const body = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio,
        safetyFilterLevel: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `Image API Error: ${res.status}`;
      const error = new Error(msg);
      error._httpStatus = res.status;
      error._errorType = classifyError(msg, res.status);
      throw error;
    }

    const data = await res.json();
    const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) return null;
    return `data:image/png;base64,${b64}`;
  });
}
