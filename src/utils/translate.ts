/** Returns true if a string is already readable Latin text (no CJK characters). */
export function isAlreadyLatin(text: string): boolean {
  return !/[\u3000-\u9fff\uf900-\ufaff\u30a0-\u30ff\u3040-\u309f]/.test(text);
}

// Re-export async translation helpers from the API layer so existing import
// paths (e.g. "../utils/translate") continue to work unchanged.
export { translateToEnglish, translateAll } from "../api/translate";
