import { useRef, useState } from "react";
import { searchRestaurants, type Restaurant } from "./api/hotpepper";
import { genreMap } from "./data/genres";
import { largeServiceAreas } from "./data/areas";
import { budgets } from "./data/budgets";
import { type AmenityKey, AMENITY_FILTERS } from "./data/amenities";
import { RestaurantCard } from "./components/RestaurantCard";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { Spinner } from "./components/Spinner";
import { Pagination } from "./components/Pagination";
import { useLanguage, type Lang } from "./context/LanguageContext";
import { t } from "./i18n/strings";
import "./App.css";

const RESULTS_PER_PAGE = 20;
// HotPepper API caps results at start + count <= 1000
const MAX_RESULTS = 1000;

// ── Japanese genre names from the API (for the search form dropdown in JA mode) ──
// The API returns genre.name on each restaurant, but the search form uses codes.
// We provide a static JA map that matches the EN one for the dropdown.
const genreMapJa: Record<string, string> = {
  G001: "居酒屋",
  G002: "ダイニングバー・バル",
  G003: "創作料理",
  G004: "和食",
  G005: "洋食",
  G006: "イタリアン・フレンチ",
  G007: "中華",
  G008: "焼肉・ホルモン",
  G017: "韓国料理",
  G009: "アジア・エスニック料理",
  G010: "各国料理",
  G011: "カラオケ・パーティ",
  G012: "バー・カクテル",
  G013: "ラーメン",
  G016: "お好み焼き・もんじゃ",
  G014: "カフェ・スイーツ",
  G015: "その他",
};

function getGenreLabel(code: string, lang: Lang): string {
  if (lang === "ja") return genreMapJa[code] ?? code;
  return genreMap[code] ?? code;
}

function App() {
  const { lang, setLang } = useLanguage();

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

  function resetToHome() {
    setRestaurants([]);
    setTotal(null);
    setCurrentPage(1);
    setHasSearched(false);
    setKeyword("");
    setPendingKeyword("");
    setActiveAmenities(new Set());
    setError(null);
    setSelected(null);
  }

  function handleToggleLanguage() {
    const next = lang === "en" ? "ja" : "en";
    setLang(next);
    resetToHome();
  }

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
          {lang === "ja" ? (
            <>
              <span className="logo-secondary">Shin</span>
              <span className="logo-primary">Hot Pepper</span>
            </>
          ) : (
            <>
              <span className="logo-primary">Hot Pepper</span>
              <span className="logo-secondary">English</span>
            </>
          )}
        </div>
        <button
          className="lang-toggle-btn"
          onClick={handleToggleLanguage}
          aria-label={`Switch to ${lang === "en" ? "Japanese" : "English"}`}
        >
          {t(lang, "nav.toggle")}
        </button>
      </header>

      <div className="search-wrapper">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-field">
            <label className="search-label">{t(lang, "search.location")}</label>
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
            <label className="search-label">{t(lang, "search.cuisine")}</label>
            <select
              className="search-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">{t(lang, "search.cuisine.all")}</option>
              {Object.entries(genreMap).map(([code]) => (
                <option key={code} value={code}>
                  {getGenreLabel(code, lang)}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label className="search-label">{t(lang, "search.budget")}</label>
            <select
              className="search-select"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              <option value="">{t(lang, "search.budget.any")}</option>
              {budgets.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field search-field-btn">
            <label className="search-label search-label-hidden">
              {t(lang, "search.submit")}
            </label>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <Spinner /> {t(lang, "search.submit.loading")}
                </span>
              ) : (
                t(lang, "search.submit")
              )}
            </button>
          </div>
        </form>
      </div>

      <main className="results-wrapper">
        {error && <div className="error-msg">{error}</div>}

        {total !== null && !loading && (
          <p className="results-meta">
            <strong>{total.toLocaleString()}</strong> {t(lang, "results.found")}
            {total > MAX_RESULTS && (
              <span>
                {" "}
                · {t(lang, "results.showing_first")}{" "}
                {MAX_RESULTS.toLocaleString()}
              </span>
            )}
            <span className="results-page-info">
              {" "}
              — {t(lang, "results.page")} {currentPage} {t(lang, "results.of")}{" "}
              {totalPages}
            </span>
          </p>
        )}

        {/* ── Refine Results strip ── */}
        {hasSearched && !loading && total !== null && (
          <div className="filter-strip">
            <div className="filter-strip-header">
              <span className="filter-strip-title">
                {t(lang, "filter.refine")}
              </span>
              {activeFilterCount > 0 && (
                <span className="filter-active-badge">
                  {activeFilterCount} {t(lang, "filter.active")}
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
                  placeholder={t(lang, "filter.keyword.placeholder")}
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
                  {t(lang, "filter.keyword.apply")}
                </button>
              </div>
            </form>

            {/* Amenity chips */}
            <div className="filter-chips">
              {AMENITY_FILTERS.map(({ key, label, labelJa, emoji }) => {
                const active = activeAmenities.has(key);
                const chipLabel = lang === "ja" ? labelJa : label;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`filter-chip${active ? " filter-chip-active" : ""}`}
                    onClick={() => toggleAmenity(key)}
                  >
                    <span className="filter-chip-emoji">{emoji}</span>
                    {chipLabel}
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
            <p className="empty-title">{t(lang, "empty.title")}</p>
            <p className="empty-sub">{t(lang, "empty.sub")}</p>
          </div>
        )}

        {loading && (
          <div className="empty-state">
            <div className="empty-icon">
              <Spinner size={36} />
            </div>
            <p className="empty-title">{t(lang, "empty.loading")}</p>
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
