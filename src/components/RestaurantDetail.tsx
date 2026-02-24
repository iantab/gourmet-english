import { useEffect, useState } from "react";
import type { Restaurant } from "../hotpepper";
import { translateGenre } from "../genres";
import { budgets } from "../budgets";
import { translateToEnglish } from "../translate";

function getBudgetName(code: string): string | null {
  return budgets.find((b) => b.code === code)?.name ?? null;
}

interface Props {
  restaurant: Restaurant;
  onClose: () => void;
}

// ── Value normalisation ──────────────────────────────────────────────────────

const VALUE_MAP: Record<string, string> = {
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

function localise(val: string): string {
  if (!val?.trim()) return "";
  return VALUE_MAP[val.trim()] ?? val.trim();
}

type AmenityStatus = "yes" | "no" | "info" | null;

function parseStatus(raw: string): AmenityStatus {
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

// ── Amenity definitions ───────────────────────────────────────────────────────

interface AmenityDef {
  label: string;
  icon: string;
  value: string;
}

function buildAmenities(r: Restaurant): AmenityDef[] {
  return [
    { label: "WiFi", icon: "📶", value: r.wifi },
    { label: "English Menu", icon: "🌐", value: r.english },
    { label: "Credit Cards", icon: "💳", value: r.card },
    { label: "Non-smoking", icon: "🚭", value: r.non_smoking },
    { label: "Children", icon: "👶", value: r.child },
    { label: "Parking", icon: "🅿️", value: r.parking },
    { label: "Private Rooms", icon: "🚪", value: r.private_room },
    { label: "Barrier-free", icon: "♿", value: r.barrier_free },
    { label: "Lunch Service", icon: "☀️", value: r.lunch },
    { label: "Late Night", icon: "🌙", value: r.midnight },
    { label: "Outdoor Seating", icon: "🌿", value: r.open_air },
    { label: "Tatami Seating", icon: "🎎", value: r.tatami },
    { label: "Sunken Kotatsu", icon: "🛋️", value: r.horigotatsu },
    { label: "Course Meals", icon: "🍱", value: r.course },
    { label: "All-you-can-drink", icon: "🍺", value: r.free_drink },
    { label: "All-you-can-eat", icon: "🍽️", value: r.free_food },
    { label: "Karaoke", icon: "🎤", value: r.karaoke },
    { label: "Private Hire", icon: "🎉", value: r.charter },
    { label: "Pets", icon: "🐾", value: r.pet },
    { label: "Live Shows", icon: "🎭", value: r.show },
    { label: "Sommelier", icon: "🍷", value: r.sommelier },
  ].filter((a) => !!a.value?.trim());
}

// ── Translate button ──────────────────────────────────────────────────────────

interface TranslateFieldProps {
  text: string;
}

function TranslateField({ text }: TranslateFieldProps) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handle() {
    setBusy(true);
    const t = await translateToEnglish(text);
    setTranslated(t);
    setBusy(false);
  }

  if (translated) {
    return <div className="detail-value translated">{translated}</div>;
  }

  return (
    <button className="translate-btn" onClick={handle} disabled={busy}>
      {busy ? (
        <span className="btn-loading">
          <Spinner /> Translating…
        </span>
      ) : (
        "Translate"
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function RestaurantDetail({ restaurant: r, onClose }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const heroSrc = r.photo?.pc?.l || r.photo?.mobile?.l || "";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address}`)}`;
  const amenities = buildAmenities(r);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        {heroSrc ? (
          <img src={heroSrc} alt={r.name} className="modal-hero" />
        ) : (
          <div className="modal-hero-placeholder">🍽️</div>
        )}

        <div className="modal-body">
          {/* Tags */}
          <div className="modal-tags">
            <span className="tag tag-genre">
              {translateGenre(r.genre.code)}
            </span>
            {r.sub_genre?.code && (
              <span className="tag tag-subgenre">
                {translateGenre(r.sub_genre.code)}
              </span>
            )}
            {r.budget?.code && (
              <span className="tag tag-budget">
                {getBudgetName(r.budget.code) ?? r.budget.average}
              </span>
            )}
            {r.lunch === "あり" && (
              <span className="tag tag-lunch">Lunch ☀️</span>
            )}
          </div>

          {/* Name */}
          <h2 className="modal-name">{r.name}</h2>
          {r.name_kana && <p className="modal-name-kana">{r.name_kana}</p>}

          {/* Catch phrase */}
          {r.catch && <p className="modal-catch">&ldquo;{r.catch}&rdquo;</p>}

          {/* ── Location ─────────────────────────────────────────── */}
          <section className="modal-section">
            <h3 className="section-title">Location</h3>
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <div>
                  <div className="detail-label">Address</div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-link"
                  >
                    {r.address}
                  </a>
                </div>
              </div>

              {r.station_name && (
                <div className="detail-row">
                  <span className="detail-icon">🚉</span>
                  <div>
                    <div className="detail-label">Nearest Station</div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.station_name.endsWith("駅") ? r.station_name : r.station_name + "駅")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      {r.station_name}
                    </a>
                  </div>
                </div>
              )}

              {r.access && (
                <div className="detail-row">
                  <span className="detail-icon">🗺️</span>
                  <div>
                    <div className="detail-label">Access Directions</div>
                    <TranslateField text={r.access} />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Hours ────────────────────────────────────────────── */}
          {(r.open || r.close) && (
            <section className="modal-section">
              <h3 className="section-title">Hours</h3>
              <div className="detail-list">
                {r.open && (
                  <div className="detail-row">
                    <span className="detail-icon">🕐</span>
                    <div>
                      <div className="detail-label">Open</div>
                      <TranslateField text={r.open} />
                    </div>
                  </div>
                )}
                {r.close && (
                  <div className="detail-row">
                    <span className="detail-icon">🔒</span>
                    <div>
                      <div className="detail-label">Closed</div>
                      <TranslateField text={r.close} />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Seating capacity ─────────────────────────────────── */}
          {(r.capacity > 0 || r.party_capacity > 0) && (
            <section className="modal-section">
              <h3 className="section-title">Seating</h3>
              <div className="capacity-row">
                {r.capacity > 0 && (
                  <div className="capacity-chip">
                    <span className="capacity-number">{r.capacity}</span>
                    <span className="capacity-label">Total seats</span>
                  </div>
                )}
                {r.party_capacity > 0 && (
                  <div className="capacity-chip">
                    <span className="capacity-number">{r.party_capacity}</span>
                    <span className="capacity-label">Party / banquet</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Features table ───────────────────────────────────── */}
          {amenities.length > 0 && (
            <section className="modal-section">
              <h3 className="section-title">Features</h3>
              <table className="features-table">
                <tbody>
                  {amenities.map((a) => {
                    const status = parseStatus(a.value);
                    const display = localise(a.value);
                    return (
                      <tr
                        key={a.label}
                        className={`feat-row feat-${status ?? "info"}`}
                      >
                        <td className="feat-name">
                          <span className="feat-icon">{a.icon}</span>
                          {a.label}
                        </td>
                        <td className="feat-value">{display}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}

          {/* ── Notes ────────────────────────────────────────────── */}
          {r.other_memo && (
            <section className="modal-section">
              <h3 className="section-title">Notes</h3>
              <p className="detail-value">{r.other_memo}</p>
            </section>
          )}

          {/* ── Lunch budget ─────────────────────────────────────── */}
          {r.budget_lunch?.name && (
            <section className="modal-section">
              <h3 className="section-title">Budget</h3>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-icon">☀️</span>
                  <div>
                    <div className="detail-label">Lunch</div>
                    <div className="detail-value">
                      {getBudgetName(r.budget_lunch.code) ??
                        r.budget_lunch.name}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── CTA ──────────────────────────────────────────────── */}
          <a
            href={r.urls.pc}
            target="_blank"
            rel="noopener noreferrer"
            className="hotpepper-btn"
          >
            View on HotPepper →
          </a>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="spin"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
