// HotPepper Gourmet API budget codes
export interface Budget {
  code: string;
  name: string;
}

/**
 * Formats a raw budget average string from the API (e.g. "3000円" or "～3000円")
 * into a readable English format like "¥3,000".
 * Falls back to the original string if parsing fails.
 */
export function formatBudgetAverage(raw: string): string {
  if (!raw?.trim()) return raw;
  const match = raw.replace(/[～〜]/g, "").match(/(\d+)/);
  if (!match) return raw;
  return `¥${Number(match[1]).toLocaleString()}`;
}

export const budgets: Budget[] = [
  { code: "B009", name: "Under ¥500" },
  { code: "B010", name: "¥501 – ¥1,000" },
  { code: "B011", name: "¥1,001 – ¥1,500" },
  { code: "B001", name: "¥1,501 – ¥2,000" },
  { code: "B002", name: "¥2,001 – ¥3,000" },
  { code: "B003", name: "¥3,001 – ¥4,000" },
  { code: "B008", name: "¥4,001 – ¥5,000" },
  { code: "B004", name: "¥5,001 – ¥7,000" },
  { code: "B005", name: "¥7,001 – ¥10,000" },
  { code: "B006", name: "¥10,001 – ¥15,000" },
  { code: "B012", name: "¥15,001 – ¥20,000" },
  { code: "B013", name: "Over ¥20,000" },
];
