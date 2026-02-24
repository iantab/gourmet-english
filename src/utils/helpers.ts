import stationsMap from "../data/stations.json";
import { budgets } from "../data/budgets";

export function translateStation(name: string): string {
  return (stationsMap as Record<string, string>)[name] || name;
}

export function getBudgetName(code: string): string | null {
  return budgets.find((b) => b.code === code)?.name ?? null;
}

export const VALUE_MAP: Record<string, string> = {
  あり: "Available",
  なし: "Not available",
  未確認: "Unconfirmed",
  利用可: "Accepted",
  利用不可: "Not accepted",
  営業している: "Yes",
  営業していない: "No",
  貸切可: "Available",
  貸切不可: "Not available",
  応相談: "By arrangement",
  全席禁煙: "Fully non-smoking",
  全席喫煙可: "Smoking allowed throughout",
  禁煙席あり: "Non-smoking section available",
  喫煙席あり: "Smoking section available",
  分煙: "Smoking/non-smoking sections",
  お子様連れ歓迎: "Children welcome",
  お子様連れOK: "Children welcome",
  お子様連れ禁止: "No children",
  可: "Yes",
  不可: "No",
  OK: "Yes",
  NG: "No",
};

export type AmenityStatus = "yes" | "no" | "info" | null;

export function parseStatus(raw: string): AmenityStatus {
  if (!raw?.trim()) return null;
  const v = raw.trim();
  const mapped = VALUE_MAP[v];
  if (
    mapped === "Available" ||
    mapped === "Accepted" ||
    mapped === "Yes" ||
    mapped === "Children welcome"
  )
    return "yes";
  if (
    mapped === "Not available" ||
    mapped === "Not accepted" ||
    mapped === "No" ||
    mapped === "No children"
  )
    return "no";
  if (mapped) return "info";
  if (
    v.includes("あり") ||
    v.includes("可") ||
    v.includes("OK") ||
    v.includes("歓迎")
  )
    return "yes";
  if (
    v.includes("なし") ||
    v.includes("不可") ||
    v.includes("禁止") ||
    v.includes("NG")
  )
    return "no";
  return "info";
}

export function localise(val: string): string {
  if (!val?.trim()) return "";
  return VALUE_MAP[val.trim()] ?? val.trim();
}
