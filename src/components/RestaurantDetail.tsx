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
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/strings";

interface Props {
  restaurant: Restaurant;
  onClose: () => void;
}

// ── Amenity definitions ───────────────────────────────────────────────────────

interface AmenityDef {
  labelKey: string;
  icon: string;
  value: string;
}

function buildAmenities(r: Restaurant): AmenityDef[] {
  return [
    { labelKey: "amenity_label.wifi", icon: "📶", value: r.wifi },
    { labelKey: "amenity_label.english", icon: "🌐", value: r.english },
    { labelKey: "amenity_label.card", icon: "💳", value: r.card },
    { labelKey: "amenity_label.non_smoking", icon: "🚭", value: r.non_smoking },
    { labelKey: "amenity_label.child", icon: "👶", value: r.child },
    { labelKey: "amenity_label.parking", icon: "🅿️", value: r.parking },
    {
      labelKey: "amenity_label.private_room",
      icon: "🚪",
      value: r.private_room,
    },
    {
      labelKey: "amenity_label.barrier_free",
      icon: "♿",
      value: r.barrier_free,
    },
    { labelKey: "amenity_label.lunch", icon: "☀️", value: r.lunch },
    { labelKey: "amenity_label.midnight", icon: "🌙", value: r.midnight },
    { labelKey: "amenity_label.open_air", icon: "🌿", value: r.open_air },
    { labelKey: "amenity_label.tatami", icon: "🎎", value: r.tatami },
    { labelKey: "amenity_label.horigotatsu", icon: "🛋️", value: r.horigotatsu },
    { labelKey: "amenity_label.course", icon: "🍱", value: r.course },
    { labelKey: "amenity_label.free_drink", icon: "🍺", value: r.free_drink },
    { labelKey: "amenity_label.free_food", icon: "🍽️", value: r.free_food },
    { labelKey: "amenity_label.karaoke", icon: "🎤", value: r.karaoke },
    { labelKey: "amenity_label.charter", icon: "🎉", value: r.charter },
    { labelKey: "amenity_label.pet", icon: "🐾", value: r.pet },
    { labelKey: "amenity_label.show", icon: "🎭", value: r.show },
    { labelKey: "amenity_label.sommelier", icon: "🍷", value: r.sommelier },
  ].filter((a) => !!a.value?.trim());
}

// ── Translated field (shows skeleton while translating in EN mode) ─────────────

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
  const { lang } = useLanguage();
  const isJa = lang === "ja";

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

  // Auto-translate only in English mode
  useEffect(() => {
    if (isJa) {
      setTranslations(new Map());
      return;
    }

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
  }, [r.id, isJa]); // eslint-disable-line react-hooks/exhaustive-deps

  const heroSrc = r.photo?.pc?.l || r.photo?.mobile?.l || "";
  const romaji = r.name_kana ? toRomaji(r.name_kana) : null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address}`)}`;
  const mapsEmbedUrl =
    r.lat && r.lng
      ? `https://maps.google.com/maps?q=${r.lat},${r.lng}&z=16&output=embed`
      : null;
  const amenities = buildAmenities(r);

  const genreLabel = isJa ? r.genre.name : translateGenre(r.genre.code);
  const subGenreLabel = isJa
    ? r.sub_genre?.name
    : r.sub_genre?.code
      ? translateGenre(r.sub_genre.code)
      : null;
  const stationLabel = isJa ? r.station_name : translateStation(r.station_name);

  function handleCopyAddress() {
    navigator.clipboard.writeText(r.address).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    });
  }

  /** Renders a text field: raw in JA, skeleton→translated in EN */
  function renderField(original: string) {
    if (!original?.trim()) return null;
    if (isJa) return <span>{original}</span>;
    return <TField original={original} translations={translations} />;
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
            <span className="tag tag-genre">{genreLabel}</span>
            {subGenreLabel && (
              <span className="tag tag-subgenre">{subGenreLabel}</span>
            )}
            {r.budget?.code && (
              <span className="tag tag-budget">
                {getBudgetName(r.budget.code) ??
                  formatBudgetAverage(r.budget.average)}
              </span>
            )}
            {r.lunch === "あり" && (
              <span className="tag tag-lunch">
                {t(lang, "detail.tag.lunch")}
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="modal-name">{r.name}</h2>
          {/* Romaji + kana only in English mode */}
          {!isJa && romaji && <p className="modal-romaji">{romaji}</p>}
          {!isJa && r.name_kana && (
            <p className="modal-name-kana">{r.name_kana}</p>
          )}

          {/* Catch phrase */}
          {r.catch && (
            <p className="modal-catch">&ldquo;{renderField(r.catch)}&rdquo;</p>
          )}

          {/* ── Location ─────────────────────────────────────────── */}
          <section className="modal-section">
            <h3 className="section-title">{t(lang, "detail.location")}</h3>
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <div className="detail-row-content">
                  <div className="detail-label">
                    {t(lang, "detail.address")}
                  </div>
                  <div className="detail-address-row">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      {renderField(r.address)}
                    </a>
                    <button
                      className="copy-btn"
                      onClick={handleCopyAddress}
                      title={t(lang, "address.copy_title")}
                      aria-label={t(lang, "address.copy_label")}
                    >
                      {copiedAddress ? "✓" : "📋"}
                    </button>
                  </div>
                  {/* In EN mode show the raw JP address as a helper for taxis etc. */}
                  {!isJa && (
                    <div className="detail-address-jp">{r.address}</div>
                  )}
                </div>
              </div>

              {r.station_name && (
                <div className="detail-row">
                  <span className="detail-icon">🚉</span>
                  <div>
                    <div className="detail-label">
                      {t(lang, "detail.station")}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.station_name.endsWith("駅") ? r.station_name : r.station_name + "駅")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      {stationLabel}
                    </a>
                  </div>
                </div>
              )}

              {r.access && (
                <div className="detail-row">
                  <span className="detail-icon">🗺️</span>
                  <div>
                    <div className="detail-label">
                      {t(lang, "detail.access")}
                    </div>
                    <div className="detail-value">{renderField(r.access)}</div>
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
                  {showMap ? t(lang, "map.hide") : t(lang, "map.show")}
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
              <h3 className="section-title">{t(lang, "detail.hours")}</h3>
              <div className="detail-list">
                {r.open && (
                  <div className="detail-row">
                    <span className="detail-icon">🕐</span>
                    <div>
                      <div className="detail-label">
                        {t(lang, "detail.open")}
                      </div>
                      <div className="detail-value">{renderField(r.open)}</div>
                    </div>
                  </div>
                )}
                {r.close && (
                  <div className="detail-row">
                    <span className="detail-icon">🔒</span>
                    <div>
                      <div className="detail-label">
                        {t(lang, "detail.closed")}
                      </div>
                      <div className="detail-value">{renderField(r.close)}</div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Seating capacity ─────────────────────────────────── */}
          {(r.capacity > 0 || r.party_capacity > 0) && (
            <section className="modal-section">
              <h3 className="section-title">{t(lang, "detail.seating")}</h3>
              <div className="capacity-row">
                {r.capacity > 0 && (
                  <div className="capacity-chip">
                    <span className="capacity-number">{r.capacity}</span>
                    <span className="capacity-label">
                      {t(lang, "detail.seats.total")}
                    </span>
                  </div>
                )}
                {r.party_capacity > 0 && (
                  <div className="capacity-chip">
                    <span className="capacity-number">{r.party_capacity}</span>
                    <span className="capacity-label">
                      {t(lang, "detail.seats.party")}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Features table ───────────────────────────────────── */}
          {amenities.length > 0 && (
            <section className="modal-section">
              <h3 className="section-title">{t(lang, "detail.features")}</h3>
              <table className="features-table">
                <tbody>
                  {amenities.map((a) => {
                    const status = parseStatus(a.value);
                    const isKnown = a.value.trim() in VALUE_MAP;
                    return (
                      <tr
                        key={a.labelKey}
                        className={`feat-row feat-${status ?? "info"}`}
                      >
                        <td className="feat-name">
                          <span className="feat-icon">{a.icon}</span>
                          {t(lang, a.labelKey as Parameters<typeof t>[1])}
                        </td>
                        <td className="feat-value">
                          {isKnown
                            ? localise(a.value, lang)
                            : renderField(a.value.trim())}
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
              <h3 className="section-title">{t(lang, "detail.notes")}</h3>
              <p className="detail-value">{renderField(r.other_memo)}</p>
            </section>
          )}

          {/* ── Lunch budget ─────────────────────────────────────── */}
          {r.budget_lunch?.name && (
            <section className="modal-section">
              <h3 className="section-title">{t(lang, "detail.budget")}</h3>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-icon">☀️</span>
                  <div>
                    <div className="detail-label">
                      {t(lang, "detail.budget.lunch")}
                    </div>
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
            {t(lang, "detail.cta")}
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
