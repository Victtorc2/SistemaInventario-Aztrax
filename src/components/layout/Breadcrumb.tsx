/**
 * Breadcrumb: ruta de navegación generada automáticamente.
 *
 * Construye las migas a partir de la URL actual. "Inicio" es la raíz; si la
 * ruta corresponde a un módulo conocido, se añade su etiqueta legible
 * (p. ej. "/categorias" -> "Inicio / Categorías").
 */

import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTE_LABELS } from "@/utils/navigation";

export function Breadcrumb() {
  const { pathname } = useLocation();

  // Migas: siempre empieza por Inicio.
  const crumbs: { label: string; to: string }[] = [
    { label: "Inicio", to: "/inicio" },
  ];

  if (pathname !== "/inicio") {
    const label = ROUTE_LABELS[pathname];
    if (label) {
      crumbs.push({ label, to: pathname });
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.to} className="flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight size={14} className="text-ink-faint" />
            ) : null}
            {isLast ? (
              <span className="font-medium text-ink">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                className="text-ink-faint transition-colors hover:text-ink"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
