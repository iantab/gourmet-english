export function Pagination({
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
