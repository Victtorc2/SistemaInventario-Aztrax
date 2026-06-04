/**
 * Pagination: control reutilizable de paginación.
 *
 * Recibe la página actual, total de elementos y tamaño de página, y emite
 * cambios de página. Calcula automáticamente las páginas y se oculta si todo
 * cabe en una sola. Soporta navegación anterior/siguiente y salto directo
 * a una página (con elipsis para listas largas).
 *
 * Es completamente controlado: la página actual la mantiene el padre. Esto
 * permite reusarlo tanto con paginación client-side (Categorías, Productos,
 * Proveedores) como server-side (Historial).
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  /** Si true, muestra siempre el control aunque haya una sola página. */
  alwaysShow?: boolean;
}

/**
 * Construye la lista de páginas a mostrar, con elipsis si hay muchas.
 * Ej.: total=10, current=5 -> [1, "...", 4, 5, 6, "...", 10]
 */
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  if (current > 3) out.push("…");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    out.push(p);
  }
  if (current < total - 2) out.push("…");
  out.push(total);
  return out;
}

export function Pagination({
  page,
  total,
  pageSize,
  onChange,
  alwaysShow = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1 && !alwaysShow) return null;

  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pages = buildPageList(safePage, totalPages);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-sm">
      <span className="text-ink-faint">
        {total === 0 ? "0 resultados" : `${start + 1}–${end} de ${total}`}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(safePage - 1)}
          disabled={safePage === 1}
          aria-label="Página anterior"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-line/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`gap-${idx}`}
              className="px-1 text-ink-faint"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === safePage ? "page" : undefined}
              className={[
                "h-8 min-w-8 rounded-lg px-2.5 text-sm font-medium transition-colors",
                p === safePage
                  ? "bg-accent text-white"
                  : "text-ink-soft hover:bg-line/60 hover:text-ink",
              ].join(" ")}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onChange(safePage + 1)}
          disabled={safePage === totalPages}
          aria-label="Página siguiente"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-line/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
