/**
 * RentabilidadPage: reportes de ganancia.
 *
 * Muestra el resumen global (ingresos, costo, ganancia, margen), la ganancia
 * por periodo (gráfico de barras día/mes) y la rentabilidad por producto
 * (tabla ordenada por ganancia). Permite filtrar por rango de fechas y
 * cambiar la agrupación.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  Wallet,
  Coins,
  Percent,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardSkeleton } from "@/components/ui/skeletons/CardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatMoney } from "@/utils/format";
import { getRentabilidad } from "@/services/rentabilidadService";
import { getErrorMessage } from "@/utils/errorHandler";
import type { ReporteRentabilidad } from "@/types/rentabilidad";

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function RentabilidadPage() {
  const [data, setData] = useState<ReporteRentabilidad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [agrupar, setAgrupar] = useState<"dia" | "mes">("dia");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(
        await getRentabilidad({
          desde: desde || undefined,
          hasta: hasta || undefined,
          agrupar,
        }),
      );
    } catch (e) {
      setError(getErrorMessage(e, "No se pudo cargar la rentabilidad"));
    } finally {
      setLoading(false);
    }
  }, [desde, hasta, agrupar]);

  useEffect(() => {
    void load();
  }, [load]);

  const inputCls =
    "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-soft focus:border-accent focus:shadow-focus focus:outline-none";

  return (
    <PageContainer
      title="Rentabilidad"
      subtitle="Cuánto ganas: por producto y por periodo"
      actions={
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-soft transition-all hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:shadow-focus focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refrescar
        </button>
      }
    >
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3 shadow-card">
        <label className="text-sm text-ink-faint">Desde</label>
        <input
          type="date"
          className={inputCls}
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
        />
        <label className="text-sm text-ink-faint">Hasta</label>
        <input
          type="date"
          className={inputCls}
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
        />
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAgrupar("dia")}
            aria-pressed={agrupar === "dia"}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
              agrupar === "dia" ? "bg-accent text-white" : "text-ink-soft hover:bg-line/60",
            ].join(" ")}
          >
            Por día
          </button>
          <button
            type="button"
            onClick={() => setAgrupar("mes")}
            aria-pressed={agrupar === "mes"}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
              agrupar === "mes" ? "bg-accent text-white" : "text-ink-soft hover:bg-line/60",
            ].join(" ")}
          >
            Por mes
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : loading || !data ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl border border-line bg-line/40" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Resumen */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResumenCard
              icon={Wallet}
              label="Ingresos"
              value={formatMoney(data.resumen.ingresos)}
              tone="sky"
            />
            <ResumenCard
              icon={Coins}
              label="Costo"
              value={formatMoney(data.resumen.costo)}
              tone="violet"
            />
            <ResumenCard
              icon={TrendingUp}
              label="Ganancia"
              value={formatMoney(data.resumen.ganancia)}
              tone="emerald"
            />
            <ResumenCard
              icon={Percent}
              label="Margen"
              value={`${toNum(data.resumen.margen_pct).toFixed(1)}%`}
              tone="indigo"
            />
          </div>

          {/* Gráfico por periodo */}
          <GananciaPorPeriodo data={data} />

          {/* Tabla por producto */}
          <RentabilidadPorProducto data={data} />
        </div>
      )}
    </PageContainer>
  );
}

const TONES: Record<string, string> = {
  indigo: "bg-accent-soft text-accent",
  sky: "bg-sky-50 text-sky-500",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-500",
};

function ResumenCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${TONES[tone]}`}
      >
        <Icon size={18} />
      </div>
      <p className="text-sm text-ink-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

function GananciaPorPeriodo({ data }: { data: ReporteRentabilidad }) {
  const chartData = data.por_periodo.map((p) => ({
    periodo: p.periodo,
    ganancia: toNum(p.ganancia),
  }));

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight">Ganancia por periodo</h2>
        <p className="text-xs text-ink-faint">Utilidad neta en cada periodo</p>
      </div>
      {chartData.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-faint">
          No hay ventas en el rango seleccionado.
        </p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe7f2" vertical={false} />
              <XAxis
                dataKey="periodo"
                tick={{ fontSize: 11, fill: "#8b86a0" }}
                axisLine={false}
                tickLine={false}
                minTickGap={16}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8b86a0" }}
                axisLine={false}
                tickLine={false}
                width={48}
                tickFormatter={(v) => `S/${v}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(99,102,241,0.06)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ebe7f2",
                  fontSize: 12,
                }}
                formatter={(value: number) => [formatMoney(value), "Ganancia"]}
              />
              <Bar dataKey="ganancia" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/** Productos por página en la tabla de rentabilidad. */
const POR_PAGINA = 10;

function RentabilidadPorProducto({ data }: { data: ReporteRentabilidad }) {
  const [pagina, setPagina] = useState(1);

  const total = data.por_producto.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  // Si cambian los datos (nuevo filtro/refresco), vuelve a la primera página.
  useEffect(() => {
    setPagina(1);
  }, [data]);

  // Recorta la página vigente sin mutar el array original.
  const visibles = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    return data.por_producto.slice(inicio, inicio + POR_PAGINA);
  }, [data.por_producto, pagina]);

  if (total === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="Sin datos de productos"
        description="Registra ventas para ver qué artículos te dejan más ganancia."
      />
    );
  }

  const desde = (pagina - 1) * POR_PAGINA + 1;
  const hasta = Math.min(pagina * POR_PAGINA, total);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight">Rentabilidad por producto</h2>
        <p className="text-xs text-ink-faint">Ordenado por ganancia</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-paper/50">
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-5 py-3 font-medium">Producto</th>
              <th className="px-5 py-3 text-center font-medium">Uds.</th>
              <th className="px-5 py-3 text-right font-medium">Ingresos</th>
              <th className="px-5 py-3 text-right font-medium">Costo</th>
              <th className="px-5 py-3 text-right font-medium">Ganancia</th>
              <th className="px-5 py-3 text-right font-medium">Margen</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr
                key={p.producto_id ?? `libre-${p.nombre}`}
                className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{p.nombre}</p>
                  <p className="text-xs text-ink-faint">
                    {p.producto_id === null
                      ? "Productos no registrados"
                      : [p.marca, p.modelo, p.color].filter(Boolean).join(" · ")}
                  </p>
                </td>
                <td className="px-5 py-4 text-center tabular-nums text-ink-soft">
                  {p.unidades_vendidas}
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-ink-soft">
                  {formatMoney(p.ingresos)}
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-ink-soft">
                  {formatMoney(p.costo)}
                </td>
                <td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-600">
                  {formatMoney(p.ganancia)}
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-ink">
                  {toNum(p.margen_pct).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
          <p className="text-xs text-ink-faint">
            Mostrando <span className="font-medium text-ink-soft">{desde}</span>–
            <span className="font-medium text-ink-soft">{hasta}</span> de{" "}
            <span className="font-medium text-ink-soft">{total}</span> productos
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={14} />
              Anterior
            </button>
            <span className="px-2 text-sm tabular-nums text-ink-soft">
              {pagina} / {totalPaginas}
            </span>
            <button
              type="button"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
