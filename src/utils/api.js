import { getRandomKey } from './storage';
import { showToast } from './toast';

// ─── Gemini AI Text Generation ───
export async function callGemini(userPrompt, systemPrompt) {
  const key = getRandomKey();
  if (!key) throw new Error('Chưa có API Key! Vui lòng thêm key trong Cấu hình.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
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
    throw new Error(err?.error?.message || `API Error: ${res.status}`);
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
        const key = getRandomKey();
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
  const key = getRandomKey();
  if (!key) throw new Error('Chưa có API Key!');

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
}
