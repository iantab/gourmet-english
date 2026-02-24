import type { Restaurant } from "../hotpepper";
import { translateGenre } from "../genres";
import { budgets } from "../budgets";

function getBudgetName(code: string): string | null {
  return budgets.find((b) => b.code === code)?.name ?? null;
}

interface Props {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant: r, onClick }: Props) {
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
          {r.budget?.code && (
            <span className="tag tag-budget">
              {getBudgetName(r.budget.code) ?? r.budget.average}
            </span>
          )}
          {r.lunch === "あり" && (
            <span className="tag tag-lunch">Lunch ☀️</span>
          )}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-name">{r.name}</h3>
        <div className="card-meta">
          {r.station_name && (
            <span className="card-station">
              <StationIcon /> {r.station_name}
            </span>
          )}
          {r.budget.average && (
            <span className="card-budget">
              <YenIcon /> {r.budget.average}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function StationIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16M12 3v8M8 21l4-4 4 4" />
    </svg>
  );
}

function YenIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L6 8m6-6l6 6M12 2v20M6 12h12M6 16h12" />
    </svg>
  );
}
