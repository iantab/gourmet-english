import type { Restaurant } from "../api/hotpepper";
import { translateGenre } from "../data/genres";
import { formatBudgetAverage } from "../data/budgets";
import { toRomaji } from "../utils/romanise";
import { translateStation, getBudgetName, parseStatus } from "../utils/helpers";

interface Props {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant: r, onClick }: Props) {
  const romaji = r.name_kana ? toRomaji(r.name_kana) : null;

  const hasEnglishMenu = parseStatus(r.english) === "yes";
  const hasWifi = parseStatus(r.wifi) === "yes";
  const isNonSmoking =
    parseStatus(r.non_smoking) !== "no" && parseStatus(r.non_smoking) !== null;
  const hasPrivateRoom = parseStatus(r.private_room) === "yes";
  const hasFreedrink = parseStatus(r.free_drink) === "yes";
  const budget =
    getBudgetName(r.budget?.code) ?? formatBudgetAverage(r.budget?.average);

  return (
    <button className="restaurant-card" onClick={onClick}>
      <div className="card-image-wrapper">
        {r.photo.mobile.l ? (
          <img src={r.photo.mobile.l} alt={r.name} className="card-image" />
        ) : (
          <div className="card-image-placeholder">🍽️</div>
        )}
        <div className="card-tags">
          <span className="tag tag-genre">{translateGenre(r.genre.code)}</span>
          {r.sub_genre?.code && (
            <span className="tag tag-subgenre">
              {translateGenre(r.sub_genre.code)}
            </span>
          )}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-name">{r.name}</h3>
        {romaji && <p className="card-romaji">{romaji}</p>}

        <div className="card-meta">
          {r.station_name && (
            <span className="card-station">
              🚉 {translateStation(r.station_name)}
            </span>
          )}
          {budget && <span className="card-budget">💴 {budget}</span>}
          {r.lunch === "あり" && <span className="card-lunch">☀️ Lunch</span>}
        </div>

        <div className="card-badges">
          {hasEnglishMenu && (
            <span className="badge badge-green">🌐 English menu</span>
          )}
          {hasWifi && <span className="badge badge-blue">📶 WiFi</span>}
          {isNonSmoking && (
            <span className="badge badge-gray">🚭 Non-smoking</span>
          )}
          {hasPrivateRoom && (
            <span className="badge badge-gray">🚪 Private room</span>
          )}
          {hasFreedrink && (
            <span className="badge badge-purple">🍺 All-you-can-drink</span>
          )}
        </div>
      </div>
    </button>
  );
}
