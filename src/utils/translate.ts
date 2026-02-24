const SESSION_KEY = "ge_translation_cache";

// Hydrate from sessionStorage so translations survive page refreshes within a session
function loadCache(): Map<string, string> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return new Map(JSON.parse(raw) as [string, string][]);
  } catch {
    // ignore
  }
  return new Map();
}

function saveCache(cache: Map<string, string>) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...cache.entries()]));
  } catch {
    // ignore (storage quota)
  }
}

const cache = loadCache();

/** Returns true if a string is already readable Latin text (no CJK characters). */
export function isAlreadyLatin(text: string): boolean {
  return !/[\u3000-\u9fff\uf900-\ufaff\u30a0-\u30ff\u3040-\u309f]/.test(text);
}

export async function translateToEnglish(text: string): Promise<string> {
  if (!text?.trim()) return text;
  if (isAlreadyLatin(text)) return text;
  if (cache.has(text)) return cache.get(text)!;

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`,
    );
    const data = await res.json();
    const translated: string = data.responseData.translatedText ?? text;
    cache.set(text, translated);
    saveCache(cache);
    return translated;
  } catch {
    return text;
  }
}

export async function translateAll(
  texts: string[],
): Promise<Map<string, string>> {
  const unique = [...new Set(texts.filter(Boolean))];
  const toFetch = unique.filter((t) => !isAlreadyLatin(t));
  const results = await Promise.all(toFetch.map((t) => translateToEnglish(t)));
  const map = new Map(toFetch.map((t, i) => [t, results[i]]));
  // Latin strings pass through as-is so TField never shows a skeleton for them
  for (const t of unique) {
    if (!map.has(t)) map.set(t, t);
  }
  return map;
}
