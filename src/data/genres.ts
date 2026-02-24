export const genreMap: Record<string, string> = {
  G001: "Izakaya",
  G002: "Dining Bar",
  G003: "Creative Cuisine",
  G004: "Japanese Food",
  G005: "Western Food",
  G006: "Italian & French",
  G007: "Chinese Food",
  G008: "Yakiniku & Offal",
  G017: "Korean Food",
  G009: "Asian & Ethnic Food",
  G010: "International Cuisine",
  G011: "Karaoke & Party",
  G012: "Bar & Cocktails",
  G013: "Ramen",
  G016: "Okonomiyaki & Monjayaki",
  G014: "Cafe & Sweets",
  G015: "Other",
};

export function translateGenre(code: string): string {
  return genreMap[code] ?? code;
}
