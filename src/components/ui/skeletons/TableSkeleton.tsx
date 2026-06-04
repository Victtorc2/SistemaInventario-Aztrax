/**
 * TableSkeleton: placeholder genérico para una tabla mientras carga.
 *
 * Renderiza N filas de M columnas, todas con barras animadas (animate-pulse).
 * Pensado para encajar dentro del marco visual estándar (rounded-2xl + border).
 */

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  /** Si true, envuelve en una tarjeta blanca; si false, solo las filas. */
  wrap?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  wrap = true,
}: TableSkeletonProps) {
  // Ancho variable por columna para que no quede todo igual de monótono.
  const widths = ["w-32", "w-20", "w-24", "w-16", "w-28", "w-20", "w-24", "w-16"];

  const body = (
    <div className="divide-y divide-line/60">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: columns }).map((__, j) => (
            <div
              key={j}
              className={[
                "h-3.5 animate-pulse rounded bg-line",
                widths[j % widths.length],
                j === 0 ? "" : "ml-auto",
              ].join(" ")}
              style={{ animationDelay: `${(i * columns + j) * 40}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );

  if (!wrap) return body;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      {body}
    </div>
  );
}
