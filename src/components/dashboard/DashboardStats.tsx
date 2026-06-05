/**
 * DashboardStats: tarjetas de indicadores rápidos (KPIs).
 *
 * Muestra ventas del día, monto del día, ticket promedio, valor de inventario
 * y alertas de stock. Las tarjetas que tienen una pantalla asociada son
 * clicables (navegan a ella); las de alerta destacan visualmente cuando hay un
 * problema que atender. Diseño coherente con el resto del sistema.
 */

import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Wallet,
  Receipt,
  Boxes,
  AlertTriangle,
  PackageX,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { ResumenDashboard } from "@/types/dashboard";

interface DashboardStatsProps {
  resumen: ResumenDashboard;
}

type Tone = "indigo" | "sky" | "emerald" | "violet" | "warning" | "danger";

interface StatCardData {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  /** Si se define, la tarjeta navega a esta ruta al hacer clic. */
  to?: string;
  /** Resalta la tarjeta como alerta accionable (borde de color + énfasis). */
  alert?: boolean;
}

export function DashboardStats({ resumen }: DashboardStatsProps) {
  const bajoStock = resumen.productos_bajo_stock;
  const agotados = resumen.productos_agotados;

  const cards: StatCardData[] = [
    {
      label: "Ventas de hoy",
      value: String(resumen.ventas_hoy),
      hint: `${formatMoney(resumen.monto_hoy)} facturado hoy`,
      icon: ShoppingCart,
      tone: "indigo",
      to: "/historial",
    },
    {
      label: "Monto total",
      value: formatMoney(resumen.monto_total),
      hint: `${resumen.ventas_total} ventas en total`,
      icon: Wallet,
      tone: "emerald",
      to: "/historial",
    },
    {
      label: "Ticket promedio",
      value: formatMoney(resumen.ticket_promedio),
      hint: "Por venta registrada",
      icon: Receipt,
      tone: "sky",
    },
    {
      label: "Valor inventario",
      value: formatMoney(resumen.valor_inventario),
      hint: `${resumen.productos_activos} productos activos`,
      icon: Boxes,
      tone: "violet",
      to: "/productos",
    },
    {
      label: "Bajo stock",
      value: String(bajoStock),
      hint: bajoStock > 0 ? "Revisar productos por reponer" : "Todo en orden",
      icon: AlertTriangle,
      tone: bajoStock > 0 ? "warning" : "indigo",
      to: "/productos-por-pedir",
      alert: bajoStock > 0,
    },
    {
      label: "Agotados",
      value: String(agotados),
      hint: agotados > 0 ? "Sin stock disponible" : "Sin productos agotados",
      icon: PackageX,
      tone: agotados > 0 ? "danger" : "emerald",
      to: "/productos-por-pedir",
      alert: agotados > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </div>
  );
}

const TONES: Record<Tone, string> = {
  indigo: "bg-accent-soft text-accent",
  sky: "bg-sky-50 text-sky-500",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-500",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-rose-50 text-danger",
};

/** Anillo/borde de énfasis para tarjetas de alerta activas. */
const ALERT_RING: Partial<Record<Tone, string>> = {
  warning: "border-amber-300/70 ring-1 ring-amber-200/60",
  danger: "border-danger/40 ring-1 ring-danger/15",
};

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "indigo",
  to,
  alert = false,
}: StatCardData) {
  const iconWrap = TONES[tone] ?? TONES.indigo;
  const ring = alert ? ALERT_RING[tone] ?? "" : "";

  const base = [
    "group relative block rounded-2xl border bg-white p-5 shadow-card",
    "transition-all duration-200",
    ring || "border-line",
    to ? "hover:-translate-y-0.5 hover:shadow-md" : "hover:shadow-md",
    to
      ? "focus:outline-none focus-visible:shadow-focus focus-visible:ring-2 focus-visible:ring-accent/30"
      : "",
  ].join(" ");

  const inner = (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconWrap}`}
        >
          <Icon size={18} />
        </div>
        {to ? (
          <ArrowUpRight
            size={16}
            className="text-ink-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <p className="text-sm text-ink-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-faint">{hint}</p> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={base} aria-label={`${label}: ${value}. Ver detalle`}>
        {inner}
      </Link>
    );
  }

  return <div className={base}>{inner}</div>;
}
