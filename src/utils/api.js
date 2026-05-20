import { getNextKey, getKeyCount, markKeyExhausted, getWorkingKey } from './storage';

// ─── Error classification ───
const QUOTA_KEYWORDS = ['quota', 'rate limit', 'rate-limit', 'resource exhausted', 'exceeded', '429', 'too many requests'];
const AUTH_KEYWORDS = ['api key', 'invalid', 'unauthorized', '401', '403', 'permission denied'];

function classifyError(message) {
  const lower = (message || '').toLowerCase();
  if (QUOTA_KEYWORDS.some(k => lower.includes(k))) return 'quota';
  if (AUTH_KEYWORDS.some(k => lower.includes(k))) return 'auth';
  return 'unknown';
}

function friendlyError(rawMessage, type) {
  switch (type) {
    case 'quota':
      return '⏳ API đã hết quota (giới hạn miễn phí). Vui lòng chờ vài phút hoặc thêm API Key mới trong Cấu Hình.';
    case 'auth':
      return '🔑 API Key không hợp lệ hoặc đã hết hạn. Kiểm tra lại trong Cấu Hình.';
    default:
      // Truncate overly long messages
      if (rawMessage && rawMessage.length > 150) {
        return '❌ Lỗi API: ' + rawMessage.substring(0, 120) + '...';
      }
      return '❌ ' + (rawMessage || 'Lỗi không xác định');
  }
}

// ─── Sleep helper ───
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ─── Retry helper with key rotation & exponential backoff ───
async function withKeyRetry(apiCall) {
  const count = getKeyCount();
  if (count === 0) throw new Error('🔑 Chưa có API Key! Vui lòng thêm key trong ⚙️ Cấu Hình.');
  
  const maxAttempts = Math.min(count * 2, 6); // Try each key up to 2 times
  let lastError;
  let lastErrorType = 'unknown';
  
  for (let i = 0; i < maxAttempts; i++) {
    const key = getWorkingKey();
    if (!key) break; // All keys exhausted
    
    try {
      const result = await apiCall(key);
      return result;
    } catch (e) {
      lastError = e;
      lastErrorType = classifyError(e.message);
      
      if (lastErrorType === 'quota') {
        // Mark this key as temporarily exhausted
        markKeyExhausted(key);
        // Short delay before trying next key
        if (i < maxAttempts - 1) {
          await sleep(500 + i * 300);
        }
        continue;
      }
      
      if (lastErrorType === 'auth') {
        // Bad key, mark it and try next
        markKeyExhausted(key);
        continue;
      }
      
      // For unknown errors, add a small backoff
      if (i < maxAttempts - 1) {
        await sleep(1000 * (i + 1));
        continue;
      }
    }
  }
  
  // All attempts failed
  const friendly = friendlyError(lastError?.message, lastErrorType);
  const error = new Error(friendly);
  error.errorType = lastErrorType;
  throw error;
}

// ─── Gemini AI Text Generation ───
export async function callGemini(userPrompt, systemPrompt) {
  return withKeyRetry(async (key) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
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
      throw new Error(msg);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Không nhận được phản hồi từ AI.');

    try {
      return JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code blocks
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) return JSON.parse(match[1].trim());
      throw new Error('Không thể phân tích JSON từ AI.');
    }
  });
}

// ─── YouTube Metadata Fetch ───
export async function fetchYouTubeData(url) {
  // Extract video ID
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;

  // Try noembed first (no API key needed)
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

      // Try to get extended data from YouTube Data API
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
      throw new Error(err?.error?.message || `Image API Error: ${res.status}`);
    }

    const data = await res.json();
    const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
    if (!b64) return null;
    return `data:image/png;base64,${b64}`;
  });
}
