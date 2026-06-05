/**
 * ProductoVentaTable: resultados de búsqueda de productos para agregar.
 *
 * Columnas: código, producto, marca, precio, stock, estado y acción "Agregar".
 * El botón Agregar se deshabilita si el producto está agotado. Maneja loading
 * (skeleton) y estado sin resultados.
 */

import { Plus, PackageSearch } from "lucide-react";
import { StockBadge } from "@/components/productos/StockBadge";
import { formatMoney } from "@/utils/format";
import type { Producto } from "@/types/producto";

interface ProductoVentaTableProps {
  productos: Producto[];
  loading: boolean;
  onAdd: (producto: Producto) => void;
}

export function ProductoVentaTable({
  productos,
  loading,
  onAdd,
}: ProductoVentaTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="divide-y divide-line/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="h-3.5 w-40 animate-pulse rounded bg-line" />
              <div className="ml-auto h-8 w-20 animate-pulse rounded-lg bg-line" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white px-5 py-14 shadow-card">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-line/60 text-ink-faint">
            <PackageSearch size={20} />
          </div>
          <p className="text-sm font-medium text-ink-soft">Sin resultados</p>
          <p className="mt-1 text-xs text-ink-faint">
            Prueba con otro nombre, marca o código.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper/50">
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <th className="hidden px-4 py-3 font-medium md:table-cell">Código</th>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Marca</th>
              <th className="px-4 py-3 text-right font-medium">Precio</th>
              <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">Stock</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => {
              const agotado = p.stock <= 0;
              return (
                <tr
                  key={p.id}
                  className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
                >
                  <td className="hidden px-4 py-3 font-mono text-xs text-ink-soft md:table-cell">
                    {p.codigo}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {p.nombre}
                    {/* En móvil, marca y stock van como subtexto (esas columnas se ocultan). */}
                    <span className="mt-0.5 block text-xs font-normal text-ink-faint md:hidden">
                      {p.marca} · Stock: {p.stock}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{p.marca}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-ink-soft">
                    {formatMoney(p.precio_venta)}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-medium tabular-nums text-ink sm:table-cell">
                    {p.stock}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <StockBadge estado={p.estado} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onAdd(p)}
                      disabled={agotado}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-indigo-600 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint disabled:active:scale-100"
                      aria-label={`Agregar ${p.nombre}`}
                    >
                      <Plus size={14} />
                      <span className="hidden sm:inline">Agregar</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
