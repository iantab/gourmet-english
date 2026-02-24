import { useEffect, useState } from "react";
import type { Restaurant } from "../api/hotpepper";
import { translateGenre } from "../data/genres";
import { formatBudgetAverage } from "../data/budgets";
import { translateAll } from "../utils/translate";
import { toRomaji } from "../utils/romanise";
import {
  translateStation,
  getBudgetName,
  VALUE_MAP,
  parseStatus,
  localise,
} from "../utils/helpers";

interface Props {
  restaurant: Restaurant;
  onClose: () => void;
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

// ── Translated field (shows skeleton while translating) ───────────────────────

function TField({
  original,
  translations,
}: {
  original: string;
  translations: Map<string, string>;
}) {
  if (!original?.trim()) return null;
  const translated = translations.get(original);
  if (translated === undefined) {
    return <span className="translate-skeleton" />;
  }
  return <span>{translated}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────

export function RestaurantDetail({ restaurant: r, onClose }: Props) {
  const [translations, setTranslations] = useState<Map<string, string>>(
    new Map(),
  );
  const [showMap, setShowMap] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

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

  // Auto-translate all Japanese text fields when the modal opens
  useEffect(() => {
    // Amenity values not covered by the static VALUE_MAP need live translation
    const unknownAmenityValues = buildAmenities(r)
      .map((a) => a.value.trim())
      .filter((v) => !(v in VALUE_MAP));

    const fields = [
      r.access,
      r.open,
      r.close,
      r.catch,
      r.other_memo,
      r.address,
      ...unknownAmenityValues,
    ].filter(Boolean);

    if (fields.length === 0) return;

    translateAll(fields).then((map) => {
      setTranslations(map);
    });
  }, [r.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const heroSrc = r.photo?.pc?.l || r.photo?.mobile?.l || "";
  const romaji = r.name_kana ? toRomaji(r.name_kana) : null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address}`)}`;
  const mapsEmbedUrl =
    r.lat && r.lng
      ? `https://maps.google.com/maps?q=${r.lat},${r.lng}&z=16&output=embed`
      : null;
  const amenities = buildAmenities(r);

  function handleCopyAddress() {
    navigator.clipboard.writeText(r.address).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    });
  }

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
                {getBudgetName(r.budget.code) ??
                  formatBudgetAverage(r.budget.average)}
              </span>
            )}
            {r.lunch === "あり" && (
              <span className="tag tag-lunch">Lunch ☀️</span>
            )}
          </div>

          {/* Name */}
          <h2 className="modal-name">{r.name}</h2>
          {romaji && <p className="modal-romaji">{romaji}</p>}
          {r.name_kana && <p className="modal-name-kana">{r.name_kana}</p>}

          {/* Catch phrase — auto-translated */}
          {r.catch && (
            <p className="modal-catch">
              &ldquo;
              <TField original={r.catch} translations={translations} />
              &rdquo;
            </p>
          )}

          {/* ── Location ─────────────────────────────────────────── */}
          <section className="modal-section">
            <h3 className="section-title">Location</h3>
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <div className="detail-row-content">
                  <div className="detail-label">Address</div>
                  <div className="detail-address-row">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      <TField
                        original={r.address}
                        translations={translations}
                      />
                    </a>
                    <button
                      className="copy-btn"
                      onClick={handleCopyAddress}
                      title="Copy Japanese address (for taxi / navigation)"
                      aria-label="Copy address"
                    >
                      {copiedAddress ? "✓" : "📋"}
                    </button>
                  </div>
                  <div className="detail-address-jp">{r.address}</div>
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
                      {translateStation(r.station_name)}
                    </a>
                  </div>
                </div>
              )}

              {r.access && (
                <div className="detail-row">
                  <span className="detail-icon">🗺️</span>
                  <div>
                    <div className="detail-label">Access Directions</div>
                    <div className="detail-value">
                      <TField original={r.access} translations={translations} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map embed toggle */}
            {mapsEmbedUrl && (
              <div className="map-toggle-wrapper">
                <button
                  className="map-toggle-btn"
                  onClick={() => setShowMap((v) => !v)}
                >
                  {showMap ? "Hide map ▲" : "Show map ▼"}
                </button>
                {showMap && (
                  <div className="map-embed-wrapper">
                    <iframe
                      title="Restaurant location"
                      src={mapsEmbedUrl}
                      className="map-embed"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            )}
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
                      <div className="detail-value">
                        <TField original={r.open} translations={translations} />
                      </div>
                    </div>
                  </div>
                )}
                {r.close && (
                  <div className="detail-row">
                    <span className="detail-icon">🔒</span>
                    <div>
                      <div className="detail-label">Closed</div>
                      <div className="detail-value">
                        <TField
                          original={r.close}
                          translations={translations}
                        />
                      </div>
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
                    const isKnown = a.value.trim() in VALUE_MAP;
                    return (
                      <tr
                        key={a.label}
                        className={`feat-row feat-${status ?? "info"}`}
                      >
                        <td className="feat-name">
                          <span className="feat-icon">{a.icon}</span>
                          {a.label}
                        </td>
                        <td className="feat-value">
                          {isKnown ? (
                            localise(a.value)
                          ) : (
                            <TField
                              original={a.value.trim()}
                              translations={translations}
                            />
                          )}
                        </td>
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
              <p className="detail-value">
                <TField original={r.other_memo} translations={translations} />
              </p>
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
                        formatBudgetAverage(r.budget_lunch.name)}
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
