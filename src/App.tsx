import { useState } from "react";
import { searchRestaurants, type Restaurant } from "./hotpepper";
import { genreMap } from "./genres";
import { largeServiceAreas } from "./areas";
import { budgets } from "./budgets";
import { RestaurantCard } from "./components/RestaurantCard";
import { RestaurantDetail } from "./components/RestaurantDetail";
import "./App.css";

const RESULTS_PER_PAGE = 20;
// HotPepper API caps results at start + count <= 1000
const MAX_RESULTS = 1000;

function App() {
  const [selectedServiceArea, setSelectedServiceArea] = useState("SA11");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Restaurant | null>(null);

  async function fetchPage(page: number) {
    setLoading(true);
    setError(null);
    setRestaurants([]);
    try {
      const data = await searchRestaurants({
        service_area: selectedServiceArea,
        genre: selectedGenre || undefined,
        budget: selectedBudget || undefined,
        count: RESULTS_PER_PAGE,
        start: (page - 1) * RESULTS_PER_PAGE + 1,
      });
      if (data.results.error) {
        setError(data.results.error[0].message);
      } else {
        setRestaurants(data.results.shop ?? []);
        setTotal(data.results.results_available);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setCurrentPage(1);
    await fetchPage(1);
  }

  async function handlePageChange(page: number) {
    setCurrentPage(page);
    await fetchPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const availableResults = Math.min(total ?? 0, MAX_RESULTS);
  const totalPages = Math.ceil(availableResults / RESULTS_PER_PAGE);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-primary">Gourmet</span>
          <span className="logo-secondary">English</span>
        </div>
      </header>

      <div className="search-wrapper">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-field">
            <label className="search-label">Location</label>
            <select
              className="search-select"
              value={selectedServiceArea}
              onChange={(e) => setSelectedServiceArea(e.target.value)}
            >
              {largeServiceAreas.map((group) => (
                <optgroup key={group.name} label={group.name}>
                  {group.prefectures.map((pref) => (
                    <option key={pref.code} value={pref.code}>
                      {pref.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label className="search-label">Cuisine</label>
            <select
              className="search-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All cuisines</option>
              {Object.entries(genreMap).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label className="search-label">Budget</label>
            <select
              className="search-select"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              <option value="">Any budget</option>
              {budgets.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field search-field-btn">
            <label className="search-label search-label-hidden">Search</label>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <Spinner /> Searching
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>
      </div>

      <main className="results-wrapper">
        {error && <div className="error-msg">{error}</div>}

        {total !== null && !loading && (
          <p className="results-meta">
            <strong>{total.toLocaleString()}</strong> restaurants found
            {total > MAX_RESULTS && (
              <span> · showing first {MAX_RESULTS.toLocaleString()}</span>
            )}
            <span className="results-page-info">
              {" "}
              — page {currentPage} of {totalPages}
            </span>
          </p>
        )}

        {!loading && total === null && restaurants.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍜</div>
            <p className="empty-title">Discover restaurants in Japan</p>
            <p className="empty-sub">
              Filter by location, cuisine, and budget to get started
            </p>
          </div>
        )}

        {loading && (
          <div className="empty-state">
            <div className="empty-icon">
              <Spinner size={36} />
            </div>
            <p className="empty-title">Finding restaurants…</p>
          </div>
        )}

        {restaurants.length > 0 && (
          <>
            <div className="restaurant-grid">
              {restaurants.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onClick={() => setSelected(r)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      {selected && (
        <RestaurantDetail
          restaurant={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("ellipsis-start");
    const rangeStart = Math.max(2, current - 1);
    const rangeEnd = Math.min(total - 1, current + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (current < total - 2) pages.push("ellipsis-end");
    pages.push(total);
  }

  return (
    <nav className="pagination" aria-label="Results pages">
      <button
        className="page-btn page-nav"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        ← Prev
      </button>

      {pages.map((p) =>
        typeof p === "string" ? (
          <span key={p} className="page-ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`page-btn${p === current ? " page-btn-active" : ""}`}
            onClick={() => onChange(p)}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="page-btn page-nav"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        Next →
      </button>
    </nav>
  );
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="spin"
      width={size}
      height={size}
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

export default App;
