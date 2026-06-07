/**
 * ReposicionTable: listado de productos por pedir.
 *
 * Columnas: producto, marca... (el backend de reposición devuelve código,
 * nombre, stock, stock_minimo, estado, categoría y proveedor). Mostramos
 * producto, código, proveedor, stock, stock mínimo y estado. El orden lo
 * define el backend (agotados primero). Maneja loading (skeleton) y vacío.
 */

import { useState } from "react";
import { Package } from "lucide-react";
import { EstadoBadge } from "@/components/reposicion/EstadoBadge";
import { Pagination } from "@/components/ui/Pagination";
import type { ProductoPorPedir } from "@/services/reposicionService";

const PAGE_SIZE = 10;

interface ReposicionTableProps {
  items: ProductoPorPedir[];
  loading: boolean;
}

export function ReposicionTable({ items, loading }: ReposicionTableProps) {
  const [page, setPage] = useState(1);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="divide-y divide-line/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="h-3.5 w-40 animate-pulse rounded bg-line" />
              <div className="ml-auto h-5 w-20 animate-pulse rounded-full bg-line" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white px-5 py-16 shadow-card">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Package size={20} />
          </div>
          <p className="text-sm font-medium text-ink-soft">
            No existen productos pendientes
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Todo el inventario está por encima del stock mínimo.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = items.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-paper/50">
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3 font-medium">Código</th>
                <th className="px-5 py-3 font-medium">Producto</th>
                <th className="px-5 py-3 font-medium">Proveedor</th>
                <th className="px-5 py-3 text-right font-medium">Stock</th>
                <th className="px-5 py-3 text-right font-medium">Stock mínimo</th>
                <th className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
                >
                  <td className="px-5 py-4 font-mono text-xs text-ink-soft">
                    {p.codigo}
                  </td>
                  <td className="px-5 py-4 font-medium text-ink">{p.nombre}</td>
                  <td className="px-5 py-4 text-ink-soft">{p.proveedor}</td>
                  <td
                    className={[
                      "px-5 py-4 text-right font-semibold tabular-nums",
                      p.stock === 0 ? "text-danger" : "text-amber-600",
                    ].join(" ")}
                  >
                    {p.stock}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-ink-soft">
                    {p.stock_minimo}
                  </td>
                  <td className="px-5 py-4">
                    <EstadoBadge estado={p.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={safePage}
        total={items.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  );
}
