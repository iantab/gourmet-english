export interface AmenityFilter {
  key:
    | "wifi"
    | "private_room"
    | "non_smoking"
    | "lunch"
    | "midnight"
    | "english"
    | "card"
    | "parking";
  label: string;
  labelJa: string;
  emoji: string;
}

export type AmenityKey = AmenityFilter["key"];

export const AMENITY_FILTERS: AmenityFilter[] = [
  { key: "non_smoking", label: "Non-Smoking", labelJa: "禁煙", emoji: "🚭" },
  { key: "english", label: "English OK", labelJa: "英語対応", emoji: "🇬🇧" },
  { key: "private_room", label: "Private Room", labelJa: "個室", emoji: "🚪" },
  { key: "lunch", label: "Lunch", labelJa: "ランチ", emoji: "☀️" },
  { key: "midnight", label: "Late Night", labelJa: "深夜営業", emoji: "🌙" },
  { key: "wifi", label: "Wi-Fi", labelJa: "Wi-Fi", emoji: "📶" },
  { key: "card", label: "Card OK", labelJa: "カード可", emoji: "💳" },
  { key: "parking", label: "Parking", labelJa: "駐車場", emoji: "🅿️" },
];
