import type { Restaurant } from "../api/hotpepper";
import { translateGenre } from "../data/genres";
import { formatBudgetAverage } from "../data/budgets";
import { toRomaji } from "../utils/romanise";
import { translateStation, getBudgetName, parseStatus } from "../utils/helpers";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/strings";

interface Props {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant: r, onClick }: Props) {
  const { lang } = useLanguage();
  const isJa = lang === "ja";

  const romaji = r.name_kana ? toRomaji(r.name_kana) : null;

  const hasEnglishMenu = parseStatus(r.english) === "yes";
  const hasWifi = parseStatus(r.wifi) === "yes";
  const isNonSmoking =
    parseStatus(r.non_smoking) !== "no" && parseStatus(r.non_smoking) !== null;
  const hasPrivateRoom = parseStatus(r.private_room) === "yes";
  const hasFreedrink = parseStatus(r.free_drink) === "yes";
  const budget =
    getBudgetName(r.budget?.code) ?? formatBudgetAverage(r.budget?.average);

  const genreLabel = isJa ? r.genre.name : translateGenre(r.genre.code);
  const subGenreLabel = isJa
    ? r.sub_genre?.name
    : r.sub_genre?.code
      ? translateGenre(r.sub_genre.code)
      : null;
  const stationLabel = isJa ? r.station_name : translateStation(r.station_name);

  return (
    <button className="restaurant-card" onClick={onClick}>
      <div className="card-image-wrapper">
        {r.photo.mobile.l ? (
          <img src={r.photo.mobile.l} alt={r.name} className="card-image" />
        ) : (
          <div className="card-image-placeholder">🍽️</div>
        )}
        <div className="card-tags">
          <span className="tag tag-genre">{genreLabel}</span>
          {subGenreLabel && (
            <span className="tag tag-subgenre">{subGenreLabel}</span>
          )}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-name">{r.name}</h3>
        {/* Romaji only shown in English mode */}
        {!isJa && romaji && <p className="card-romaji">{romaji}</p>}

        <div className="card-meta">
          {r.station_name && (
            <span className="card-station">🚉 {stationLabel}</span>
          )}
          {budget && <span className="card-budget">💴 {budget}</span>}
          {r.lunch === "あり" && (
            <span className="card-lunch">{t(lang, "card.lunch")}</span>
          )}
        </div>

        <div className="card-badges">
          {/* Hidden in JA mode: not relevant for Japanese audience */}
          {!isJa && hasEnglishMenu && (
            <span className="badge badge-green">
              {t(lang, "badge.english_menu")}
            </span>
          )}
          {hasWifi && (
            <span className="badge badge-blue">{t(lang, "badge.wifi")}</span>
          )}
          {isNonSmoking && (
            <span className="badge badge-gray">
              {t(lang, "badge.non_smoking")}
            </span>
          )}
          {hasPrivateRoom && (
            <span className="badge badge-gray">
              {t(lang, "badge.private_room")}
            </span>
          )}
          {hasFreedrink && (
            <span className="badge badge-purple">
              {t(lang, "badge.free_drink")}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
