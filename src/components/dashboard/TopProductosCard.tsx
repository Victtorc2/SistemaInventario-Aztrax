/**
 * TopProductosCard: ranking de productos más vendidos como gráfico de barras
 * horizontales.
 *
 * Cada barra representa un producto y su longitud las unidades vendidas
 * (ordenadas de mayor a menor). El líder se resalta con el color de acento y
 * el resto en un tono más suave, para comparar de un vistazo. El tooltip
 * añade el detalle (marca/modelo/color) y el monto facturado. Pensado como
 * columna lateral del dashboard.
 */

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

/** Recorta nombres largos para que quepan en el eje. */
function corto(nombre: string, max = 16): string {
  return nombre.length > max ? `${nombre.slice(0, max - 1)}…` : nombre;
}

export function TopProductosCard({ data }: TopProductosCardProps) {
  const chartData = data.map((p) => ({
    nombre: corto(p.nombre),
    nombreFull: p.nombre,
    detalle: [p.marca, p.modelo, p.color].filter(Boolean).join(" · "),
    unidades: p.unidades_vendidas,
    monto: toNum(p.monto_vendido),
  }));

  // Altura proporcional al nº de barras (mínimo cómodo para pocas).
  const altura = Math.max(200, chartData.length * 38);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-accent">
          <TrendingUp size={14} />
        </span>
        <h2 className="text-sm font-semibold tracking-tight">Más vendidos</h2>
        {chartData.length > 0 ? (
          <span className="ml-auto text-xs text-ink-faint">
            Top {chartData.length}
          </span>
        ) : null}
      </div>

      {chartData.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-faint">
          Aún no hay ventas registradas.
        </p>
      ) : (
        <div style={{ height: altura }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 32, left: 0, bottom: 0 }}
              barCategoryGap="22%"
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="nombre"
                width={104}
                tick={{ fontSize: 11, fill: "#6b6780" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(99,102,241,0.06)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ebe7f2",
                  fontSize: 12,
                  boxShadow: "0 4px 16px -4px rgba(99,102,241,0.15)",
                }}
                formatter={(value, _name, item) => {
                  const row = item?.payload ?? {};
                  const detalle = row.detalle ? ` · ${row.detalle}` : "";
                  return [
                    `${value} uds · ${formatMoney(row.monto ?? 0)}`,
                    `${row.nombreFull ?? ""}${detalle}`,
                  ];
                }}
              />
              <Bar dataKey="unidades" radius={[0, 6, 6, 0]} maxBarSize={22}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#6366f1" : "#c7d2fe"} />
                ))}
                <LabelList
                  dataKey="unidades"
                  position="right"
                  style={{ fontSize: 11, fill: "#6b6780", fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
