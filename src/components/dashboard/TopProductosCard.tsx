/**
 * TopProductosCard: ranking de productos más vendidos.
 *
 * Lista los productos por unidades vendidas, con su posición, nombre, unidades
 * y monto (alineado a la derecha para escaneo rápido). El primer puesto se
 * destaca. Pensado como columna lateral del dashboard.
 */

import { TrendingUp } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { TopProducto } from "@/types/dashboard";

interface TopProductosCardProps {
  data: TopProducto[];
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function TopProductosCard({ data }: TopProductosCardProps) {
  // Unidades del líder para dimensionar la barra de proporción.
  const maxUnidades = data.reduce(
    (max, p) => Math.max(max, p.unidades_vendidas),
    0,
  );

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-accent">
          <TrendingUp size={14} />
        </span>
        <h2 className="text-sm font-semibold tracking-tight">Más vendidos</h2>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          Aún no hay ventas registradas.
        </p>
      ) : (
        <ol className="flex flex-col gap-1">
          {data.map((p, i) => {
            const monto = toNum(p.monto_vendido);
            const pct =
              maxUnidades > 0
                ? Math.round((p.unidades_vendidas / maxUnidades) * 100)
                : 0;
            return (
              <li
                key={p.producto_id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent-soft/50"
              >
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums",
                    i === 0 ? "bg-accent text-white" : "bg-line/70 text-ink-soft",
                  ].join(" ")}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium text-ink">
                      {p.nombre}
                    </p>
                    <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                      {formatMoney(monto)}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent/60 transition-all duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs tabular-nums text-ink-faint">
                      {p.unidades_vendidas} uds
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
