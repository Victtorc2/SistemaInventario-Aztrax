/**
 * VentasChart: gráfico de área de ventas por día.
 *
 * Usa recharts. La cabecera resume el periodo (total facturado, promedio diario
 * y día pico) para dar contexto de un vistazo; el eje X muestra la fecha corta
 * y el eje Y el monto. Diseño sobrio, acorde al estilo minimalista del sistema.
 */

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LineChart } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { VentaPorDia } from "@/types/dashboard";

interface VentasChartProps {
  data: VentaPorDia[];
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

/** Formatea "2026-05-28" -> "28 may". */
function fechaCorta(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
}

export function VentasChart({ data }: VentasChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        fecha: fechaCorta(d.fecha),
        monto: toNum(d.monto),
        cantidad: d.cantidad,
      })),
    [data],
  );

  // Resumen del periodo: total, promedio diario y día con mayor monto.
  const resumen = useMemo(() => {
    if (chartData.length === 0) return null;
    const total = chartData.reduce((acc, d) => acc + d.monto, 0);
    const pico = chartData.reduce((max, d) => (d.monto > max.monto ? d : max));
    return {
      total,
      promedio: total / chartData.length,
      picoMonto: pico.monto,
      picoFecha: pico.fecha,
    };
  }, [chartData]);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Ventas por día</h2>
          <p className="text-xs text-ink-faint">Monto facturado en el periodo</p>
        </div>
        {resumen ? (
          <div className="flex items-center gap-5">
            <Stat label="Total" value={formatMoney(resumen.total)} />
            <Stat label="Promedio/día" value={formatMoney(resumen.promedio)} />
            <Stat
              label={`Pico · ${resumen.picoFecha}`}
              value={formatMoney(resumen.picoMonto)}
            />
          </div>
        ) : null}
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
            <LineChart size={20} />
          </div>
          <p className="text-sm font-medium text-ink-soft">Sin ventas en el periodo</p>
          <p className="text-xs text-ink-faint">
            Las ventas que registres aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe7f2" vertical={false} />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 11, fill: "#8b86a0" }}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8b86a0" }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) => `S/${v}`}
              />
              <Tooltip
                cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ebe7f2",
                  fontSize: 12,
                  boxShadow: "0 4px 16px -4px rgba(99,102,241,0.15)",
                }}
                formatter={(value: number, name: string) =>
                  name === "monto"
                    ? [formatMoney(value), "Monto"]
                    : [value, "Ventas"]
                }
              />
              <Area
                type="monotone"
                dataKey="monto"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#ventasGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/** Mini-indicador de la cabecera del gráfico. */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="text-sm font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
