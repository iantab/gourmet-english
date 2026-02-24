import { useRef, useState } from "react";
import { searchRestaurants, type Restaurant } from "./api/hotpepper";
import { genreMap } from "./data/genres";
import { largeServiceAreas } from "./data/areas";
import { budgets } from "./data/budgets";
import { RestaurantCard } from "./components/RestaurantCard";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { Spinner } from "./components/Spinner";
import { Pagination } from "./components/Pagination";
import "./App.css";

const RESULTS_PER_PAGE = 20;
// HotPepper API caps results at start + count <= 1000
const MAX_RESULTS = 1000;

interface AmenityFilter {
  key:
    | "wifi"
    | "private_room"
    | "non_smoking"
    | "lunch"
    | "midnight"
    | "english"
    | "card"
    | "parking";
  label: string;
  emoji: string;
}

const AMENITY_FILTERS: AmenityFilter[] = [
  { key: "non_smoking", label: "Non-Smoking", emoji: "🚭" },
  { key: "english", label: "English OK", emoji: "🇬🇧" },
  { key: "private_room", label: "Private Room", emoji: "🚪" },
  { key: "lunch", label: "Lunch", emoji: "☀️" },
  { key: "midnight", label: "Late Night", emoji: "🌙" },
  { key: "wifi", label: "Wi-Fi", emoji: "📶" },
  { key: "card", label: "Card OK", emoji: "💳" },
  { key: "parking", label: "Parking", emoji: "🅿️" },
];

type AmenityKey = AmenityFilter["key"];

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

  // Refinement filters (only active after first search)
  const [hasSearched, setHasSearched] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pendingKeyword, setPendingKeyword] = useState("");
  const [activeAmenities, setActiveAmenities] = useState<Set<AmenityKey>>(
    new Set(),
  );

  const keywordInputRef = useRef<HTMLInputElement>(null);

  async function fetchPage(
    page: number,
    overrides?: { keyword?: string; amenities?: Set<AmenityKey> },
  ) {
    setLoading(true);
    setError(null);
    setRestaurants([]);
    const kw = overrides?.keyword ?? keyword;
    const amenities = overrides?.amenities ?? activeAmenities;
    try {
      const data = await searchRestaurants({
        service_area: selectedServiceArea,
        genre: selectedGenre || undefined,
        budget: selectedBudget || undefined,
        keyword: kw || undefined,
        wifi: amenities.has("wifi") || undefined,
        private_room: amenities.has("private_room") || undefined,
        non_smoking: amenities.has("non_smoking") || undefined,
        lunch: amenities.has("lunch") || undefined,
        midnight: amenities.has("midnight") || undefined,
        english: amenities.has("english") || undefined,
        card: amenities.has("card") || undefined,
        parking: amenities.has("parking") || undefined,
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
    // Reset refinements on a brand new search
    setKeyword("");
    setPendingKeyword("");
    setActiveAmenities(new Set());
    setCurrentPage(1);
    setHasSearched(true);
    await fetchPage(1, { keyword: "", amenities: new Set() });
  }

  async function handlePageChange(page: number) {
    setCurrentPage(page);
    await fetchPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleKeywordRefine(e: React.FormEvent) {
    e.preventDefault();
    setKeyword(pendingKeyword);
    setCurrentPage(1);
    await fetchPage(1, { keyword: pendingKeyword });
  }

  async function handleClearKeyword() {
    setPendingKeyword("");
    setKeyword("");
    setCurrentPage(1);
    await fetchPage(1, { keyword: "" });
  }

  async function toggleAmenity(key: AmenityKey) {
    const next = new Set(activeAmenities);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setActiveAmenities(next);
    setCurrentPage(1);
    await fetchPage(1, { amenities: next });
  }

  const availableResults = Math.min(total ?? 0, MAX_RESULTS);
  const totalPages = Math.ceil(availableResults / RESULTS_PER_PAGE);
  const activeFilterCount = activeAmenities.size + (keyword ? 1 : 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-primary">Hot Pepper</span>
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

        {/* ── Refine Results strip ── */}
        {hasSearched && !loading && total !== null && (
          <div className="filter-strip">
            <div className="filter-strip-header">
              <span className="filter-strip-title">Refine Results</span>
              {activeFilterCount > 0 && (
                <span className="filter-active-badge">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            {/* Keyword input */}
            <form
              className="filter-keyword-form"
              onSubmit={handleKeywordRefine}
            >
              <div className="filter-keyword-wrap">
                <span className="filter-keyword-icon">🔍</span>
                <input
                  ref={keywordInputRef}
                  className="filter-keyword-input"
                  type="text"
                  placeholder="Keyword (e.g. sushi, terrace, view…)"
                  value={pendingKeyword}
                  onChange={(e) => setPendingKeyword(e.target.value)}
                />
                {pendingKeyword && (
                  <button
                    type="button"
                    className="filter-keyword-clear"
                    onClick={handleClearKeyword}
                    aria-label="Clear keyword"
                  >
                    ✕
                  </button>
                )}
                <button type="submit" className="filter-keyword-go">
                  Apply
                </button>
              </div>
            </form>

            {/* Amenity chips */}
            <div className="filter-chips">
              {AMENITY_FILTERS.map(({ key, label, emoji }) => {
                const active = activeAmenities.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`filter-chip${active ? " filter-chip-active" : ""}`}
                    onClick={() => toggleAmenity(key)}
                  >
                    <span className="filter-chip-emoji">{emoji}</span>
                    {label}
                    {active && <span className="filter-chip-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
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

export default App;
