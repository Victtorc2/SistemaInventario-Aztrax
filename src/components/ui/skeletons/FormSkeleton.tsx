/**
 * FormSkeleton: placeholder para formularios mientras se cargan datos.
 *
 * Útil al abrir un modal de edición que precarga datos del backend (p. ej.
 * detalle de venta o catálogos). Renderiza N pares "label + input".
 */

interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

export function FormSkeleton({ fields = 4, className = "" }: FormSkeletonProps) {
  return (
    <div className={["flex flex-col gap-4", className].join(" ")}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div
            className="h-3 w-24 animate-pulse rounded bg-line"
            style={{ animationDelay: `${i * 60}ms` }}
          />
          <div
            className="h-10 w-full animate-pulse rounded-lg bg-line"
            style={{ animationDelay: `${i * 60 + 40}ms` }}
          />
        </div>
      ))}
      <div className="mt-2 flex justify-end gap-2">
        <div className="h-9 w-20 animate-pulse rounded-lg bg-line" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-line" />
      </div>
    </div>
  );
}
