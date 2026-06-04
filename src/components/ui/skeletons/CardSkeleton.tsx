/**
 * CardSkeleton: placeholder para tarjetas individuales (KPIs, stats, etc.).
 *
 * Reproduce la estructura visual de una stat-card: bloque pequeño arriba
 * (etiqueta), valor grande en el centro y línea fina inferior.
 */

interface CardSkeletonProps {
  /** Número de tarjetas a mostrar en una grilla. */
  count?: number;
  className?: string;
}

export function CardSkeleton({ count = 1, className = "" }: CardSkeletonProps) {
  if (count === 1) return <SingleCard className={className} />;
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SingleCard key={i} delayMs={i * 60} />
      ))}
    </div>
  );
}

function SingleCard({
  className = "",
  delayMs = 0,
}: {
  className?: string;
  delayMs?: number;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-line bg-white p-5 shadow-card",
        className,
      ].join(" ")}
    >
      <div
        className="h-3 w-20 animate-pulse rounded bg-line"
        style={{ animationDelay: `${delayMs}ms` }}
      />
      <div
        className="mt-3 h-7 w-24 animate-pulse rounded bg-line"
        style={{ animationDelay: `${delayMs + 80}ms` }}
      />
      <div
        className="mt-2 h-2.5 w-16 animate-pulse rounded bg-line"
        style={{ animationDelay: `${delayMs + 160}ms` }}
      />
    </div>
  );
}
