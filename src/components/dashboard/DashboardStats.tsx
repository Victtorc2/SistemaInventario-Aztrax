/**
 * DashboardStats: tarjetas de indicadores rápidos (KPIs).
 *
 * Muestra ventas del día, monto del día, ticket promedio, valor de inventario
 * y alertas de stock. Diseño minimalista coherente con el resto del sistema.
 */

import {
  ShoppingCart,
  Wallet,
  Receipt,
  Boxes,
  AlertTriangle,
  PackageX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { ResumenDashboard } from "@/types/dashboard";

interface DashboardStatsProps {
  resumen: ResumenDashboard;
}

export function DashboardStats({ resumen }: DashboardStatsProps) {
  const cards: {
    label: string;
    value: string;
    hint?: string;
    icon: LucideIcon;
    tone?: "indigo" | "sky" | "emerald" | "violet" | "warning" | "danger";
  }[] = [
    {
      label: "Ventas de hoy",
      value: String(resumen.ventas_hoy),
      hint: `${formatMoney(resumen.monto_hoy)} facturado hoy`,
      icon: ShoppingCart,
      tone: "indigo",
    },
    {
      label: "Monto total",
      value: formatMoney(resumen.monto_total),
      hint: `${resumen.ventas_total} ventas en total`,
      icon: Wallet,
      tone: "emerald",
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
    },
    {
      label: "Bajo stock",
      value: String(resumen.productos_bajo_stock),
      hint: "Productos por reponer",
      icon: AlertTriangle,
      tone: resumen.productos_bajo_stock > 0 ? "warning" : "indigo",
    },
    {
      label: "Agotados",
      value: String(resumen.productos_agotados),
      hint: "Sin stock disponible",
      icon: PackageX,
      tone: resumen.productos_agotados > 0 ? "danger" : "emerald",
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

const TONES: Record<string, string> = {
  indigo: "bg-accent-soft text-accent",
  sky: "bg-sky-50 text-sky-500",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-500",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-rose-50 text-danger",
};

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "indigo",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "indigo" | "sky" | "emerald" | "violet" | "warning" | "danger";
}) {
  const iconWrap = TONES[tone] ?? TONES.indigo;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:shadow-md">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${iconWrap}`}
      >
        <Icon size={18} />
      </div>
      <p className="text-sm text-ink-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}
