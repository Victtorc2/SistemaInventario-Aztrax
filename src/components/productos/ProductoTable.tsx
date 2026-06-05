/**
 * ProductoTable: listado del inventario.
 *
 * Columnas: código, nombre, marca, categoría, proveedor, precio compra,
 * precio venta, stock, estado (badge) y acciones. Tiene scroll horizontal en
 * pantallas estrechas. Maneja loading (skeleton) y paginación de 10; el estado
 * vacío lo decide la página (EmptyProducts).
 */

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { StockBadge } from "@/components/productos/StockBadge";
import { ActionIcon } from "@/components/ui/ActionIcon";
import { Pagination } from "@/components/ui/Pagination";
import { formatMoney } from "@/utils/format";
import type { Producto } from "@/types/producto";

const PAGE_SIZE = 10;

interface ProductoTableProps {
  productos: Producto[];
  loading: boolean;
  onEdit: (p: Producto) => void;
  onDelete: (p: Producto) => void;
}

export function ProductoTable({
  productos,
  loading,
  onEdit,
  onDelete,
}: ProductoTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(productos.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = productos.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-paper/50">
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Marca</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Proveedor</th>
                <th className="px-4 py-3 text-right font-medium">P. compra</th>
                <th className="px-4 py-3 text-right font-medium">P. venta</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-line/60 last:border-0">
                      {Array.from({ length: 10 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3.5 w-16 animate-pulse rounded bg-line" />
                        </td>
                      ))}
                    </tr>
                  ))
                : visible.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
                    >
                      <td className="px-4 py-4 font-mono text-xs text-ink-soft">
                        {p.codigo}
                      </td>
                      <td className="px-4 py-4 font-medium text-ink">
                        <div>{p.nombre}</div>
                        {p.modelo ? (
                          <div className="text-xs font-normal text-ink-faint">
                            {p.modelo}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 text-ink-soft">{p.marca}</td>
                      <td className="px-4 py-4 text-ink-soft">{p.categoria}</td>
                      <td className="px-4 py-4 text-ink-soft">{p.proveedor}</td>
                      <td className="px-4 py-4 text-right tabular-nums text-ink-soft">
                        {formatMoney(p.precio_compra)}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums text-ink-soft">
                        {formatMoney(p.precio_venta)}
                      </td>
                      <td className="px-4 py-4 text-right font-medium tabular-nums text-ink">
                        {p.stock}
                      </td>
                      <td className="px-4 py-4">
                        <StockBadge estado={p.estado} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <ActionIcon
                            intent="edit"
                            label={`Editar ${p.nombre}`}
                            onClick={() => onEdit(p)}
                          >
                            <Pencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            intent="delete"
                            label={`Eliminar ${p.nombre}`}
                            onClick={() => onDelete(p)}
                          >
                            <Trash2 size={16} />
                          </ActionIcon>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading ? (
        <Pagination
          page={safePage}
          total={productos.length}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
      ) : null}
    </div>
  );
}
