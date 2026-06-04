/**
 * HistorialStats: indicadores rápidos del historial de ventas.
 *
 * Muestra tres KPIs minimalistas: total de ventas, monto total vendido y
 * ventas del día. Las cifras se calculan a partir de los items recibidos —
 * "ventas del día" sobre la fecha actual del cliente.
 *
 * Mientras la página está cargando, muestra un esqueleto coherente.
 */

import { Receipt, Wallet, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatMoney } from "@/utils/format";
import { CardSkeleton } from "@/components/ui/skeletons/CardSkeleton";
import type { HistorialItem } from "@/types/historial";

interface HistorialStatsProps {
  items: HistorialItem[];
  /** Total absoluto del historial (incluyendo páginas no visibles). */
  totalVentas: number;
  loading?: boolean;
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function HistorialStats({ items, totalVentas, loading }: HistorialStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  // Monto total: sumamos los items VISIBLES (suficiente para el dashboard de
  // la página actual; un total global requeriría endpoint específico).
  const montoPagina = items.reduce((acc, it) => acc + toNum(it.total), 0);

  // Ventas del día: comparamos por fecha local (yyyy-mm-dd).
  const hoy = new Date().toISOString().slice(0, 10);
  const ventasHoy = items.filter((it) => it.fecha.slice(0, 10) === hoy).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Stat
        icon={Receipt}
        label="Total ventas"
        value={String(totalVentas)}
        hint="Registradas en el sistema"
      />
      <Stat
        icon={Wallet}
        label="Monto en página"
        value={formatMoney(montoPagina)}
        hint="Suma de las ventas mostradas"
      />
      <Stat
        icon={CalendarDays}
        label="Ventas del día"
        value={String(ventasHoy)}
        hint={`En la página actual · ${new Date().toLocaleDateString("es-PE")}`}
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:shadow-md">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-line/60 text-ink-soft">
        <Icon size={18} />
      </div>
      <p className="text-sm text-ink-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-faint">{hint}</p>
    </div>
  );
}
