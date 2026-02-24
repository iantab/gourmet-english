import type {
  Restaurant,
  HotPepperResponse,
  SearchParams,
} from "../types/hotpepper";

export type { Restaurant, HotPepperResponse, SearchParams };

const API_KEY = import.meta.env.VITE_HOT_PEPPER_KEY as string;
const HOTPEPPER_API = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
// Set VITE_API_BASE_URL to a CORS proxy (e.g. https://corsproxy.io/) for
// production deployments like GitHub Pages. Leave unset in dev — the Vite
// proxy handles it.
const PROXY_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

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

  // In dev, hit the Vite proxy directly.
  // In production, wrap the full target URL for the CORS proxy.
  const targetUrl = `${HOTPEPPER_API}?${query.toString()}`;
  const fetchUrl = PROXY_BASE
    ? `${PROXY_BASE}?url=${encodeURIComponent(targetUrl)}`
    : `/api/hotpepper/?${query.toString()}`;

  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }
  return res.json() as Promise<HotPepperResponse>;
}
