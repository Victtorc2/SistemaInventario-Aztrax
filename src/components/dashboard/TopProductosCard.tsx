/**
 * TopProductosCard: ranking de productos más vendidos.
 *
 * Lista los productos por unidades vendidas, con su posición, código, nombre y
 * monto. Pensado como columna lateral del dashboard.
 */

import { TrendingUp } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { TopProducto } from "@/types/dashboard";

interface TopProductosCardProps {
  data: TopProducto[];
}

export function TopProductosCard({ data }: TopProductosCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-ink-soft" />
        <h2 className="text-sm font-semibold tracking-tight">Más vendidos</h2>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          Aún no hay ventas registradas.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {data.map((p, i) => (
            <li key={p.producto_id} className="flex items-center gap-3">
              <span
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                  i === 0
                    ? "bg-accent text-white"
                    : "bg-line/70 text-ink-soft",
                ].join(" ")}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{p.nombre}</p>
                <p className="text-xs text-ink-faint">
                  {p.unidades_vendidas} uds · {formatMoney(p.monto_vendido)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
