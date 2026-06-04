/**
 * VentasChart: gráfico de área de ventas por día.
 *
 * Usa recharts. El eje X muestra la fecha (corta) y el eje Y el monto. El
 * tooltip muestra el monto y la cantidad de ventas del día. Diseño sobrio,
 * acorde al estilo minimalista del sistema.
 */

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/utils/format";
import type { VentaPorDia } from "@/types/dashboard";

interface VentasChartProps {
  data: VentaPorDia[];
}

/** Formatea "2026-05-28" -> "28 may". */
function fechaCorta(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
}

export function VentasChart({ data }: VentasChartProps) {
  const chartData = data.map((d) => ({
    fecha: fechaCorta(d.fecha),
    monto: typeof d.monto === "string" ? parseFloat(d.monto) : d.monto,
    cantidad: d.cantidad,
  }));

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight">Ventas por día</h2>
        <p className="text-xs text-ink-faint">Monto facturado en el periodo</p>
      </div>

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
    </div>
  );
}
