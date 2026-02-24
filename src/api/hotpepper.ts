const API_KEY = import.meta.env.VITE_HOT_PEPPER_KEY as string;
// In production (GitHub Pages), set VITE_API_BASE_URL to your CORS proxy URL
// (e.g. a Cloudflare Worker). In development the Vite proxy handles /api/hotpepper.
const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "/api/hotpepper/";

export interface Restaurant {
  id: string;
  name: string;
  name_kana: string;
  address: string;
  station_name: string;
  lat: string;
  lng: string;
  genre: { code: string; name: string; catch: string };
  sub_genre?: { code: string; name: string };
  budget: { code: string; name: string; average: string };
  budget_lunch?: { code: string; name: string };
  access: string;
  mobile_access: string;
  urls: { pc: string };
  photo: {
    pc: { l: string; m: string; s: string };
    mobile: { l: string; s: string };
  };
  catch: string;
  open: string;
  close: string;
  capacity: number;
  party_capacity: number;
  // Amenities (values are Japanese text: "あり"/"なし"/descriptive)
  wifi: string;
  course: string;
  free_drink: string;
  free_food: string;
  private_room: string;
  horigotatsu: string;
  tatami: string;
  card: string;
  non_smoking: string;
  charter: string;
  parking: string;
  barrier_free: string;
  sommelier: string;
  open_air: string;
  show: string;
  equipment: string;
  karaoke: string;
  band: string;
  tv: string;
  lunch: string;
  midnight: string;
  english: string;
  pet: string;
  child: string;
  other_memo: string;
}

export interface HotPepperResponse {
  results: {
    api_version: string;
    results_available: number;
    results_returned: string;
    results_start: number;
    shop?: Restaurant[];
    error?: { code: number; message: string }[];
  };
}

export interface SearchParams {
  service_area?: string;
  genre?: string;
  budget?: string;
  keyword?: string;
  wifi?: boolean;
  private_room?: boolean;
  non_smoking?: boolean;
  lunch?: boolean;
  midnight?: boolean;
  english?: boolean;
  card?: boolean;
  parking?: boolean;
  count?: number;
  start?: number;
}

export async function searchRestaurants(
  params: SearchParams,
): Promise<HotPepperResponse> {
  const flag = (v?: boolean) => (v ? "1" : undefined);
  const query = new URLSearchParams({
    key: API_KEY,
    format: "json",
    count: String(params.count ?? 20),
    start: String(params.start ?? 1),
    ...(params.service_area && { service_area: params.service_area }),
    ...(params.genre && { genre: params.genre }),
    ...(params.budget && { budget: params.budget }),
    ...(params.keyword && { keyword: params.keyword }),
    ...(flag(params.wifi) && { wifi: "1" }),
    ...(flag(params.private_room) && { private_room: "1" }),
    ...(flag(params.non_smoking) && { non_smoking: "1" }),
    ...(flag(params.lunch) && { lunch: "1" }),
    ...(flag(params.midnight) && { midnight: "1" }),
    ...(flag(params.english) && { english: "1" }),
    ...(flag(params.card) && { card: "1" }),
    ...(flag(params.parking) && { parking: "1" }),
  });

  const res = await fetch(`${BASE_URL}?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }
  return res.json() as Promise<HotPepperResponse>;
}
