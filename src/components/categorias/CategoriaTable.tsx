/**
 * CategoriaTable: tabla de categorías.
 *
 * Maneja sus estados de presentación:
 *   - loading: muestra filas "skeleton".
 *   - vacío: mensaje "No hay categorías registradas".
 *   - con datos: filas con acciones (editar/eliminar) y paginación de 10.
 *
 * Nota: la columna "Cantidad productos" se muestra como "—" porque el endpoint
 * actual de categorías del backend no devuelve ese conteo. Cuando el backend
 * lo exponga (p. ej. `productos_count`), basta con leerlo aquí.
 */

import { useState } from "react";
import { Pencil, Trash2, Tags } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import type { Categoria } from "@/types/categoria";

const PAGE_SIZE = 10;

interface CategoriaTableProps {
  categorias: Categoria[];
  loading: boolean;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

/** Formatea una fecha ISO a algo legible (26 may 2026). */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function CategoriaTable({
  categorias,
  loading,
  onEdit,
  onDelete,
}: CategoriaTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(categorias.length / PAGE_SIZE));
  // Si el filtro reduce los resultados, no quedarse en una página inexistente.
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = categorias.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-paper/50">
          <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
            <th className="px-5 py-3 font-medium">Nombre</th>
            <th className="px-5 py-3 font-medium">Productos</th>
            <th className="px-5 py-3 font-medium">Fecha creación</th>
            <th className="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Skeleton de carga.
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-line/60 last:border-0">
                {Array.from({ length: 4 }).map((__, j) => (
                  <td key={j} className="px-5 py-4">
                    <div className="h-3.5 w-24 animate-pulse rounded bg-line" />
                  </td>
                ))}
              </tr>
            ))
          ) : visible.length === 0 ? (
            // Estado vacío.
            <tr>
              <td colSpan={4} className="px-5 py-16">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-line/60 text-ink-faint">
                    <Tags size={20} />
                  </div>
                  <p className="text-sm font-medium text-ink-soft">
                    No hay categorías registradas
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    Crea una nueva categoría para empezar.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            visible.map((c) => (
              <tr
                key={c.id}
                className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
              >
                <td className="px-5 py-4 font-medium text-ink">{c.nombre}</td>
                <td className="px-5 py-4 text-ink-faint">—</td>
                <td className="px-5 py-4 text-ink-soft">{formatDate(c.created_at)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(c)}
                      className="rounded-lg p-2 text-ink-faint transition-all duration-200 hover:bg-line/60 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      aria-label={`Editar ${c.nombre}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(c)}
                      className="rounded-lg p-2 text-ink-faint transition-all duration-200 hover:bg-danger/10 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
                      aria-label={`Eliminar ${c.nombre}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {!loading ? (
        <Pagination
          page={safePage}
          total={categorias.length}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      ) : null}
    </div>
  );
}
