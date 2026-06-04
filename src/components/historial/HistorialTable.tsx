/**
 * HistorialTable: listado de ventas del historial.
 *
 * Columnas: boleta, fecha, productos, subtotal, descuento, total y acciones
 * (ver detalle, ver boleta, reimprimir). Paginación server-side reutilizando
 * el componente Pagination. Skeleton de carga reutilizable.
 *
 * Optimizaciones: las filas y los botones de acción están memoizados para
 * evitar re-renderizados innecesarios al cambiar de página.
 */

import { memo, useCallback } from "react";
import type { ReactNode } from "react";
import { Eye, FileText, Printer } from "lucide-react";
import { formatMoney, formatDate } from "@/utils/format";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import type { HistorialItem } from "@/types/historial";

interface HistorialTableProps {
  items: HistorialItem[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onVerDetalle: (item: HistorialItem) => void;
  onVerBoleta: (item: HistorialItem) => void;
  onReimprimir: (item: HistorialItem) => void;
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function HistorialTable({
  items,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onVerDetalle,
  onVerBoleta,
  onReimprimir,
}: HistorialTableProps) {
  if (loading) {
    return <TableSkeleton rows={6} columns={7} />;
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3 font-medium">Boleta</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 text-center font-medium">Prod.</th>
                <th className="px-5 py-3 text-right font-medium">Subtotal</th>
                <th className="px-5 py-3 text-right font-medium">Descuento</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <HistorialRow
                  key={item.id}
                  item={item}
                  onVerDetalle={onVerDetalle}
                  onVerBoleta={onVerBoleta}
                  onReimprimir={onReimprimir}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        onChange={onPageChange}
      />
    </div>
  );
}

// --- Fila memoizada -------------------------------------------------------
interface HistorialRowProps {
  item: HistorialItem;
  onVerDetalle: (item: HistorialItem) => void;
  onVerBoleta: (item: HistorialItem) => void;
  onReimprimir: (item: HistorialItem) => void;
}

const HistorialRow = memo(function HistorialRow({
  item,
  onVerDetalle,
  onVerBoleta,
  onReimprimir,
}: HistorialRowProps) {
  // useCallback estabiliza los handlers para que los hijos memoizados no
  // se vuelvan a renderizar si el item no ha cambiado.
  const handleDetalle = useCallback(() => onVerDetalle(item), [item, onVerDetalle]);
  const handleBoleta = useCallback(() => onVerBoleta(item), [item, onVerBoleta]);
  const handleReimp = useCallback(() => onReimprimir(item), [item, onReimprimir]);

  const descuento = toNum(item.descuento);

  return (
    <tr className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60">
      <td className="px-5 py-4 font-mono text-xs font-medium text-ink">
        {item.numero_boleta}
      </td>
      <td className="px-5 py-4 text-ink-soft">{formatDate(item.fecha)}</td>
      <td className="px-5 py-4 text-center tabular-nums text-ink-soft">
        {item.cantidad_productos}
      </td>
      <td className="px-5 py-4 text-right tabular-nums text-ink-soft">
        {formatMoney(toNum(item.subtotal))}
      </td>
      <td className="px-5 py-4 text-right tabular-nums">
        {descuento > 0 ? (
          <span className="text-emerald-600">- {formatMoney(descuento)}</span>
        ) : (
          <span className="text-ink-faint">—</span>
        )}
      </td>
      <td className="px-5 py-4 text-right font-semibold tabular-nums text-ink">
        {formatMoney(toNum(item.total))}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1">
          <ActionButton label="Ver detalle" onClick={handleDetalle}>
            <Eye size={16} />
          </ActionButton>
          <ActionButton label="Ver boleta" onClick={handleBoleta}>
            <FileText size={16} />
          </ActionButton>
          <ActionButton label="Reimprimir" onClick={handleReimp}>
            <Printer size={16} />
          </ActionButton>
        </div>
      </td>
    </tr>
  );
});

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded-lg p-2 text-ink-faint transition-all duration-200 hover:bg-line/60 hover:text-ink focus-visible:shadow-focus focus:outline-none"
    >
      {children}
    </button>
  );
}
