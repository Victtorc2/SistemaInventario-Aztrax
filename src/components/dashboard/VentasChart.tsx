/**
 * VentasChart: gráfico de área de ventas por día con navegación temporal.
 *
 * Maneja su propia ventana de fechas: un selector de tamaño (14 / 30 / 90 días)
 * y flechas para retroceder o avanzar por periodos anteriores (útil porque el
 * sistema opera desde junio y se quiere revisar meses pasados). Cada vez que
 * cambia la ventana consulta /dashboard/ventas-por-dia. La cabecera resume el
 * periodo (total facturado, promedio diario y día pico).
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronLeft, ChevronRight, LineChart } from "lucide-react";
import { formatMoney } from "@/utils/format";
import { getVentasPorDia } from "@/services/dashboardService";
import { getErrorMessage } from "@/utils/errorHandler";
import type { VentaPorDia } from "@/types/dashboard";

interface VentasChartProps {
  /** Cambia este valor para forzar una recarga (p. ej. desde el botón global). */
  reloadToken?: number;
}

/** Tamaños de ventana disponibles (en días). */
const VENTANAS = [
  { label: "14 días", dias: 14 },
  { label: "30 días", dias: 30 },
  { label: "3 meses", dias: 90 },
] as const;

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

/** Fecha local a ISO "YYYY-MM-DD" (sin corrimiento por zona horaria). */
function fmtISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Formatea "2026-05-28" -> "28 may". */
function fechaCorta(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
}

export function VentasChart({ reloadToken = 0 }: VentasChartProps) {
  const [dias, setDias] = useState(30);
  // offset = nº de ventanas hacia atrás (0 = ventana que termina hoy).
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<VentaPorDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rango de la ventana actual, según tamaño y desplazamiento.
  const { desde, hasta } = useMemo(() => {
    const fin = new Date();
    fin.setHours(0, 0, 0, 0);
    fin.setDate(fin.getDate() - offset * dias);
    const ini = new Date(fin);
    ini.setDate(ini.getDate() - (dias - 1));
    return { desde: fmtISO(ini), hasta: fmtISO(fin) };
  }, [dias, offset]);

  useEffect(() => {
    let vivo = true;
    setLoading(true);
    setError(null);
    getVentasPorDia(desde, hasta)
      .then((serie) => {
        if (vivo) setData(serie);
      })
      .catch((e) => {
        if (vivo) setError(getErrorMessage(e, "No se pudo cargar el gráfico"));
      })
      .finally(() => {
        if (vivo) setLoading(false);
      });
    return () => {
      vivo = false;
    };
  }, [desde, hasta, reloadToken]);

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

  const cambiarVentana = useCallback((n: number) => {
    setDias(n);
    setOffset(0); // al cambiar el tamaño, volvemos al periodo actual
  }, []);

  const rangoLabel = `${fechaCorta(desde)} – ${fechaCorta(hasta)}`;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Ventas por día</h2>
          <p className="text-xs text-ink-faint">{rangoLabel}</p>
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

      {/* Controles: navegación temporal + tamaño de ventana */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => o + 1)}
            disabled={loading}
            aria-label="Periodo anterior"
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={14} />
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={loading || offset === 0}
            aria-label="Periodo siguiente"
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
            <ChevronRight size={14} />
          </button>
          {offset > 0 ? (
            <button
              type="button"
              onClick={() => setOffset(0)}
              className="ml-1 rounded-lg px-2 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              Hoy
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-white p-1">
          {VENTANAS.map((v) => (
            <button
              key={v.dias}
              type="button"
              onClick={() => cambiarVentana(v.dias)}
              aria-pressed={dias === v.dias}
              className={[
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                dias === v.dias
                  ? "bg-accent text-white"
                  : "text-ink-soft hover:bg-line/60",
              ].join(" ")}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="flex h-64 flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
          <p className="text-xs text-ink-faint">Prueba a refrescar la página.</p>
        </div>
      ) : loading ? (
        <div className="h-64 w-full animate-pulse rounded-xl border border-line bg-line/40" />
      ) : chartData.length === 0 || resumen?.total === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
            <LineChart size={20} />
          </div>
          <p className="text-sm font-medium text-ink-soft">Sin ventas en el periodo</p>
          <p className="text-xs text-ink-faint">
            Usa las flechas para revisar otros meses.
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
