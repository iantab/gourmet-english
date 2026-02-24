const API_KEY = import.meta.env.VITE_HOT_PEPPER_KEY as string;
const BASE_URL = "/api/hotpepper/";

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
  count?: number;
  start?: number;
}

export async function searchRestaurants(
  params: SearchParams,
): Promise<HotPepperResponse> {
  const query = new URLSearchParams({
    key: API_KEY,
    format: "json",
    count: String(params.count ?? 20),
    start: String(params.start ?? 1),
    ...(params.service_area && { service_area: params.service_area }),
    ...(params.genre && { genre: params.genre }),
    ...(params.budget && { budget: params.budget }),
  });

  const res = await fetch(`${BASE_URL}?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }
  return res.json() as Promise<HotPepperResponse>;
}
