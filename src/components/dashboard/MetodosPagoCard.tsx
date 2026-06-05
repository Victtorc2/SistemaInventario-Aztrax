/**
 * MetodosPagoCard: desglose de ventas por método de pago (efectivo / yape).
 *
 * Muestra, por cada método, la cantidad de ventas, el monto y una barra de
 * proporción sobre el total. La cabecera resume el total para dar contexto.
 * Pensado para visualizar de un vistazo qué medio de pago domina.
 */

import { Banknote, Smartphone, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { MetodoPagoResumen } from "@/types/dashboard";

interface MetodosPagoCardProps {
  data: MetodoPagoResumen[];
}

const META: Record<
  string,
  { label: string; icon: LucideIcon; bar: string; chip: string }
> = {
  efectivo: {
    label: "Efectivo",
    icon: Banknote,
    bar: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-600",
  },
  yape: {
    label: "Yape",
    icon: Smartphone,
    bar: "bg-violet-500",
    chip: "bg-violet-50 text-violet-500",
  },
};

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function MetodosPagoCard({ data }: MetodosPagoCardProps) {
  const totalMonto = data.reduce((acc, m) => acc + toNum(m.monto), 0);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Métodos de pago</h2>
          <p className="text-xs text-ink-faint">Distribución de las ventas</p>
        </div>
        {totalMonto > 0 ? (
          <p className="text-sm font-semibold tabular-nums text-ink">
            {formatMoney(totalMonto)}
          </p>
        ) : null}
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
              icon: CreditCard,
              bar: "bg-ink",
              chip: "bg-line text-ink-soft",
            };
            const Icon = meta.icon;
            const monto = toNum(m.monto);
            const pct = totalMonto > 0 ? Math.round((monto / totalMonto) * 100) : 0;
            return (
              <div key={m.metodo_pago}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-ink">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${meta.chip}`}
                    >
                      <Icon size={14} />
                    </span>
                    {meta.label}
                    <span className="text-xs font-normal text-ink-faint">
                      · {m.cantidad} {m.cantidad === 1 ? "venta" : "ventas"}
                    </span>
                  </span>
                  <span className="tabular-nums font-medium text-ink-soft">
                    {formatMoney(monto)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${meta.bar} transition-all duration-700 ease-out`}
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
