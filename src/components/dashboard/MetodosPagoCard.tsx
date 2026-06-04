/**
 * MetodosPagoCard: desglose de ventas por método de pago (efectivo / yape).
 *
 * Muestra, por cada método, la cantidad de ventas, el monto y una barra de
 * proporción sobre el total. Pensado para visualizar de un vistazo qué medio
 * de pago domina.
 */

import { Banknote, Smartphone } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { MetodoPagoResumen } from "@/types/dashboard";

interface MetodosPagoCardProps {
  data: MetodoPagoResumen[];
}

const META: Record<string, { label: string; icon: typeof Banknote; color: string }> = {
  efectivo: { label: "Efectivo", icon: Banknote, color: "bg-emerald-500" },
  yape: { label: "Yape", icon: Smartphone, color: "bg-violet-500" },
};

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function MetodosPagoCard({ data }: MetodosPagoCardProps) {
  const totalMonto = data.reduce((acc, m) => acc + toNum(m.monto), 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight">Métodos de pago</h2>
        <p className="text-xs text-ink-faint">Distribución de las ventas</p>
      </div>

      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          Aún no hay ventas registradas.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((m) => {
            const meta = META[m.metodo_pago] ?? {
              label: m.metodo_pago,
              icon: Banknote,
              color: "bg-ink",
            };
            const Icon = meta.icon;
            const monto = toNum(m.monto);
            const pct = totalMonto > 0 ? Math.round((monto / totalMonto) * 100) : 0;
            return (
              <div key={m.metodo_pago}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <Icon size={16} className="text-ink-soft" />
                    {meta.label}
                  </span>
                  <span className="tabular-nums text-ink-soft">
                    {formatMoney(monto)}{" "}
                    <span className="text-ink-faint">· {m.cantidad}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${meta.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-xs tabular-nums text-ink-faint">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
