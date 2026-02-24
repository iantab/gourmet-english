import type { Lang } from "../context/LanguageContext";

const strings = {
  en: {
    // Header / nav
    "nav.toggle": "日本語",

    // Search form
    "search.location": "Location",
    "search.cuisine": "Cuisine",
    "search.cuisine.all": "All cuisines",
    "search.budget": "Budget",
    "search.budget.any": "Any budget",
    "search.submit": "Search",
    "search.submit.loading": "Searching",

    // Results meta
    "results.found": "restaurants found",
    "results.showing_first": "showing first",
    "results.page": "page",
    "results.of": "of",

    // Refine strip
    "filter.refine": "Refine Results",
    "filter.active": "active",
    "filter.keyword.placeholder": "Keyword (e.g. sushi, terrace, view…)",
    "filter.keyword.apply": "Apply",

    // Empty states
    "empty.title": "Discover restaurants in Japan",
    "empty.sub": "Filter by location, cuisine, and budget to get started",
    "empty.loading": "Finding restaurants…",

    // Map toggle
    "map.show": "Show map ▼",
    "map.hide": "Hide map ▲",

    // Detail modal sections
    "detail.location": "Location",
    "detail.address": "Address",
    "detail.station": "Nearest Station",
    "detail.access": "Access Directions",
    "detail.hours": "Hours",
    "detail.open": "Open",
    "detail.closed": "Closed",
    "detail.seating": "Seating",
    "detail.seats.total": "Total seats",
    "detail.seats.party": "Party / banquet",
    "detail.features": "Features",
    "detail.notes": "Notes",
    "detail.budget": "Budget",
    "detail.budget.lunch": "Lunch",
    "detail.cta": "View on HotPepper →",

    // Card
    "card.lunch": "☀️ Lunch",
    "badge.english_menu": "🌐 English menu",
    "badge.wifi": "📶 WiFi",
    "badge.non_smoking": "🚭 Non-smoking",
    "badge.private_room": "🚪 Private room",
    "badge.free_drink": "🍺 All-you-can-drink",

    // Amenity filter chips
    "amenity.non_smoking": "Non-Smoking",
    "amenity.english": "English OK",
    "amenity.private_room": "Private Room",
    "amenity.lunch": "Lunch",
    "amenity.midnight": "Late Night",
    "amenity.wifi": "Wi-Fi",
    "amenity.card": "Card OK",
    "amenity.parking": "Parking",

    // Amenity table labels
    "amenity_label.wifi": "WiFi",
    "amenity_label.english": "English Menu",
    "amenity_label.card": "Credit Cards",
    "amenity_label.non_smoking": "Non-smoking",
    "amenity_label.child": "Children",
    "amenity_label.parking": "Parking",
    "amenity_label.private_room": "Private Rooms",
    "amenity_label.barrier_free": "Barrier-free",
    "amenity_label.lunch": "Lunch Service",
    "amenity_label.midnight": "Late Night",
    "amenity_label.open_air": "Outdoor Seating",
    "amenity_label.tatami": "Tatami Seating",
    "amenity_label.horigotatsu": "Sunken Kotatsu",
    "amenity_label.course": "Course Meals",
    "amenity_label.free_drink": "All-you-can-drink",
    "amenity_label.free_food": "All-you-can-eat",
    "amenity_label.karaoke": "Karaoke",
    "amenity_label.charter": "Private Hire",
    "amenity_label.pet": "Pets",
    "amenity_label.show": "Live Shows",
    "amenity_label.sommelier": "Sommelier",

    // Copy address tooltip
    "address.copy_title": "Copy Japanese address (for taxi / navigation)",
    "address.copy_label": "Copy address",

    // Detail tag
    "detail.tag.lunch": "Lunch ☀️",
  },

  ja: {
    // Header / nav
    "nav.toggle": "English",

    // Search form
    "search.location": "エリア",
    "search.cuisine": "ジャンル",
    "search.cuisine.all": "すべてのジャンル",
    "search.budget": "予算",
    "search.budget.any": "予算を指定しない",
    "search.submit": "検索",
    "search.submit.loading": "検索中",

    // Results meta
    "results.found": "件のレストランが見つかりました",
    "results.showing_first": "最初の",
    "results.page": "ページ",
    "results.of": "／",

    // Refine strip
    "filter.refine": "絞り込み",
    "filter.active": "件適用中",
    "filter.keyword.placeholder": "キーワード（例：寿司、テラス、夜景…）",
    "filter.keyword.apply": "適用",

    // Empty states
    "empty.title": "日本のレストランを探す",
    "empty.sub": "エリア・ジャンル・予算で絞り込んでください",
    "empty.loading": "レストランを検索中…",

    // Map toggle
    "map.show": "地図を表示 ▼",
    "map.hide": "地図を非表示 ▲",

    // Detail modal sections
    "detail.location": "アクセス",
    "detail.address": "住所",
    "detail.station": "最寄り駅",
    "detail.access": "アクセス方法",
    "detail.hours": "営業時間",
    "detail.open": "営業",
    "detail.closed": "定休日",
    "detail.seating": "席数",
    "detail.seats.total": "総席数",
    "detail.seats.party": "宴会収容人数",
    "detail.features": "設備・サービス",
    "detail.notes": "備考",
    "detail.budget": "予算",
    "detail.budget.lunch": "ランチ",
    "detail.cta": "ホットペッパーで見る →",

    // Card
    "card.lunch": "☀️ ランチ",
    // No badge.english_menu in JA mode (hidden)
    "badge.wifi": "📶 Wi-Fi",
    "badge.non_smoking": "🚭 禁煙",
    "badge.private_room": "🚪 個室あり",
    "badge.free_drink": "🍺 飲み放題",

    // Amenity filter chips
    "amenity.non_smoking": "禁煙",
    "amenity.english": "英語対応",
    "amenity.private_room": "個室",
    "amenity.lunch": "ランチ",
    "amenity.midnight": "深夜営業",
    "amenity.wifi": "Wi-Fi",
    "amenity.card": "カード可",
    "amenity.parking": "駐車場",

    // Amenity table labels
    "amenity_label.wifi": "Wi-Fi",
    "amenity_label.english": "英語メニュー",
    "amenity_label.card": "クレジットカード",
    "amenity_label.non_smoking": "禁煙",
    "amenity_label.child": "お子様",
    "amenity_label.parking": "駐車場",
    "amenity_label.private_room": "個室",
    "amenity_label.barrier_free": "バリアフリー",
    "amenity_label.lunch": "ランチ",
    "amenity_label.midnight": "深夜営業",
    "amenity_label.open_air": "オープンエア",
    "amenity_label.tatami": "座敷",
    "amenity_label.horigotatsu": "掘りごたつ",
    "amenity_label.course": "コース料理",
    "amenity_label.free_drink": "飲み放題",
    "amenity_label.free_food": "食べ放題",
    "amenity_label.karaoke": "カラオケ",
    "amenity_label.charter": "貸切",
    "amenity_label.pet": "ペット",
    "amenity_label.show": "ライブ・ショー",
    "amenity_label.sommelier": "ソムリエ",

    // Copy address tooltip
    "address.copy_title": "住所をコピー",
    "address.copy_label": "住所をコピー",

    // Detail tag
    "detail.tag.lunch": "ランチ ☀️",
  },
} as const;

type StringKey = keyof (typeof strings)["en"];

export function t(lang: Lang, key: StringKey): string {
  // JA may not have every key (e.g. badge.english_menu is intentionally absent);
  // fall back to EN to avoid runtime errors.
  return (
    (strings[lang] as Record<string, string>)[key] ?? strings.en[key] ?? key
  );
}
