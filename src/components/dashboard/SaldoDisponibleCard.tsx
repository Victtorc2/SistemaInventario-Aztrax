/**
 * SaldoDisponibleCard: dinero disponible por método de pago en el dashboard.
 *
 * Muestra, de un vistazo, el saldo de efectivo, de Yape y el total, con enlace
 * al módulo de Gastos para el detalle. Los datos vienen de GET /gastos/saldo
 * (cargado por InicioPage). Si el saldo no está disponible (p. ej. backend sin
 * migrar), el componente no se renderiza para no romper el dashboard.
 */

import { Link } from "react-router-dom";
import { Banknote, Smartphone, Wallet, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { Saldo } from "@/types/gasto";

interface SaldoDisponibleCardProps {
  saldo: Saldo | null;
}

interface Item {
  label: string;
  icon: LucideIcon;
  saldo: string | number;
  ingresos: string | number;
  egresos: string | number;
  chip: string;
}

export function SaldoDisponibleCard({ saldo }: SaldoDisponibleCardProps) {
  if (!saldo) return null;

  const items: Item[] = [
    {
      label: "Efectivo",
      icon: Banknote,
      saldo: saldo.efectivo.saldo,
      ingresos: saldo.efectivo.ingresos,
      egresos: saldo.efectivo.egresos,
      chip: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Yape",
      icon: Smartphone,
      saldo: saldo.yape.saldo,
      ingresos: saldo.yape.ingresos,
      egresos: saldo.yape.egresos,
      chip: "bg-accent-soft text-accent",
    },
  ];

  return (
    <Link
      to="/gastos"
      aria-label="Ver gastos y saldo"
      className="group relative block rounded-2xl border border-line bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:shadow-focus focus-visible:ring-2 focus-visible:ring-accent/30"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Wallet size={18} />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-ink">
              Dinero disponible
            </h2>
            <p className="text-xs text-ink-faint">Saldo por método de pago</p>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="text-ink-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.label}
              className="rounded-xl border border-line bg-paper/40 px-4 py-3"
            >
              <div className="mb-1 flex items-center gap-1.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md ${it.chip}`}
                >
                  <Icon size={13} />
                </span>
                <span className="text-xs font-medium text-ink-soft">
                  {it.label}
                </span>
              </div>
              <p className="text-lg font-semibold tabular-nums text-ink">
                {formatMoney(it.saldo)}
              </p>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600">
                  + {formatMoney(it.ingresos)}
                </span>
                <span className="text-danger">− {formatMoney(it.egresos)}</span>
              </div>
            </div>
          );
        })}

        {/* Total */}
        <div className="rounded-xl border border-ink bg-ink px-4 py-3 text-white">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15">
              <Wallet size={13} />
            </span>
            <span className="text-xs font-medium text-white/80">Total</span>
          </div>
          <p className="text-lg font-semibold tabular-nums">
            {formatMoney(saldo.total)}
          </p>
          <p className="mt-1 text-[11px] text-white/50">Efectivo + Yape</p>
        </div>
      </div>
    </Link>
  );
}
