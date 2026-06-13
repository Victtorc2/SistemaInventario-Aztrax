/**
 * ProductoTable: listado del inventario.
 *
 * La primera columna "Producto" agrupa el código (chip), el nombre (que puede
 * ocupar varias líneas para apreciar nombres largos) y la representación. El
 * resto de columnas no se parten (whitespace-nowrap) para mantener las filas
 * ordenadas. Tiene scroll horizontal en pantallas estrechas, skeleton de carga
 * y paginación de 10; el estado vacío lo decide la página (EmptyProducts).
 */

import { useState } from "react";
import { Pencil, Power, Trash2 } from "lucide-react";
import { StockBadge } from "@/components/productos/StockBadge";
import { ActionIcon } from "@/components/ui/ActionIcon";
import { Pagination } from "@/components/ui/Pagination";
import { formatMoney } from "@/utils/format";
import { REPRESENTACIONES, type Producto } from "@/types/producto";

const PAGE_SIZE = 10;

/** Etiqueta legible de la representación (con respaldo si llegara un valor nuevo). */
function representacionLabel(value: string): string {
  return REPRESENTACIONES.find((r) => r.value === value)?.label ?? value;
}

/** Celda de texto que no se parte; muestra "—" tenue si está vacía. */
function TextCell({ value }: { value: string | null }) {
  return (
    <td className="whitespace-nowrap px-4 py-3.5 text-ink-soft">
      {value || <span className="text-ink-faint">—</span>}
    </td>
  );
}

interface ProductoTableProps {
  productos: Producto[];
  loading: boolean;
  onEdit: (p: Producto) => void;
  onDelete: (p: Producto) => void;
  /** Reactiva un producto desactivado. */
  onReactivar: (p: Producto) => void;
}

export function ProductoTable({
  productos,
  loading,
  onEdit,
  onDelete,
  onReactivar,
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
          <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="bg-paper/70 text-[11px] uppercase tracking-wider text-ink-faint">
                <th className="border-b border-line px-4 py-3 font-semibold">Producto</th>
                <th className="border-b border-line px-4 py-3 font-semibold">Marca</th>
                <th className="border-b border-line px-4 py-3 font-semibold">Modelo</th>
                <th className="border-b border-line px-4 py-3 font-semibold">Color</th>
                <th className="border-b border-line px-4 py-3 font-semibold">Categoría</th>
                <th className="border-b border-line px-4 py-3 font-semibold">Proveedor</th>
                <th className="border-b border-line px-4 py-3 text-right font-semibold">P. compra</th>
                <th className="border-b border-line px-4 py-3 text-right font-semibold">P. venta</th>
                <th className="border-b border-line px-4 py-3 text-right font-semibold">Stock</th>
                <th className="border-b border-line px-4 py-3 font-semibold">Estado</th>
                <th className="border-b border-line px-4 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 11 }).map((__, j) => (
                        <td key={j} className="border-b border-line/60 px-4 py-4">
                          <div className="h-3.5 w-20 animate-pulse rounded bg-line" />
                        </td>
                      ))}
                    </tr>
                  ))
                : visible.map((p) => (
                    <tr
                      key={p.id}
                      className={[
                        "align-top transition-colors hover:bg-accent-soft/30",
                        p.is_active ? "" : "bg-paper/40 opacity-70",
                      ].join(" ")}
                    >
                      {/* Producto: código (chip) + nombre (multilínea) + representación */}
                      <td className="border-b border-line/60 px-4 py-3.5">
                        <div className="min-w-[220px] max-w-[340px]">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="rounded-md bg-line/70 px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">
                              {p.codigo}
                            </span>
                            {!p.is_active ? (
                              <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-faint">
                                Inactivo
                              </span>
                            ) : null}
                          </div>
                          <p className="font-medium leading-snug text-ink">{p.nombre}</p>
                          <p className="mt-0.5 text-xs text-ink-faint">
                            {representacionLabel(p.representacion)}
                          </p>
                        </div>
                      </td>
                      <TextCell value={p.marca} />
                      <TextCell value={p.modelo} />
                      <TextCell value={p.color} />
                      <TextCell value={p.categoria} />
                      <TextCell value={p.proveedor} />
                      <td className="whitespace-nowrap border-b border-line/60 px-4 py-3.5 text-right tabular-nums text-ink-soft">
                        {formatMoney(p.precio_compra)}
                      </td>
                      <td className="whitespace-nowrap border-b border-line/60 px-4 py-3.5 text-right font-medium tabular-nums text-ink">
                        {formatMoney(p.precio_venta)}
                      </td>
                      <td className="whitespace-nowrap border-b border-line/60 px-4 py-3.5 text-right font-semibold tabular-nums text-ink">
                        {p.stock}
                      </td>
                      <td className="whitespace-nowrap border-b border-line/60 px-4 py-3.5">
                        <StockBadge estado={p.estado} />
                      </td>
                      <td className="whitespace-nowrap border-b border-line/60 px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <ActionIcon
                            intent="edit"
                            label={`Editar ${p.nombre}`}
                            onClick={() => onEdit(p)}
                          >
                            <Pencil size={16} />
                          </ActionIcon>
                          {p.is_active ? (
                            <ActionIcon
                              intent="delete"
                              label={`Desactivar ${p.nombre}`}
                              onClick={() => onDelete(p)}
                            >
                              <Trash2 size={16} />
                            </ActionIcon>
                          ) : (
                            <ActionIcon
                              intent="account"
                              label={`Reactivar ${p.nombre}`}
                              onClick={() => onReactivar(p)}
                            >
                              <Power size={16} />
                            </ActionIcon>
                          )}
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
