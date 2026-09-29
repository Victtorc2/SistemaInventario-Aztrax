/**
 * InicioPage: dashboard principal del sistema.
 *
 * Consume GET /dashboard y muestra: KPIs (ventas, inventario), gráfico de
 * ventas por día, desglose por método de pago y ranking de productos más
 * vendidos. Maneja estados de carga (skeletons), error (con reintento) y un
 * refresco manual que conserva los datos en pantalla mientras recarga.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { SaldoDisponibleCard } from "@/components/dashboard/SaldoDisponibleCard";
import { VentasChart } from "@/components/dashboard/VentasChart";
import { MetodosPagoCard } from "@/components/dashboard/MetodosPagoCard";
import { TopProductosCard } from "@/components/dashboard/TopProductosCard";
import { CardSkeleton } from "@/components/ui/skeletons/CardSkeleton";
import { getDashboard } from "@/services/dashboardService";
import { getSaldo } from "@/services/gastoService";
import { getErrorMessage } from "@/utils/errorHandler";
import type { DashboardCompleto } from "@/types/dashboard";
import type { Saldo } from "@/types/gasto";

/** Nº de productos mostrados en el ranking de más vendidos. */
const TOP_PRODUCTOS = 10;

export function InicioPage() {
  const { user } = useAuth();
  const [mes, setMes] = useState(() => {
    const partes = new Intl.DateTimeFormat("en", {
      timeZone: "America/Lima", year: "numeric", month: "2-digit",
    }).formatToParts(new Date());
    return partes.find(p => p.type === "year")!.value + "-" + partes.find(p => p.type === "month")!.value;
  });
  const requestId = useRef(0);
  const periodo = mes
    ? new Date(mes + "-01T12:00:00").toLocaleDateString("es-PE", { month: "long", year: "numeric" })
    : "Histórico";
  const [data, setData] = useState<DashboardCompleto | null>(null);
  const [saldo, setSaldo] = useState<Saldo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // `silent` evita el skeleton en refrescos manuales: conserva los datos
  // actuales y solo marca el botón como cargando.
  const load = useCallback(
    async (silent = false) => {
      const id = ++requestId.current;
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        // La serie de ventas por día la maneja el propio VentasChart (con su
        // navegación temporal), así que aquí pedimos una ventana mínima; solo
        // nos interesan KPIs, métodos de pago y top productos.
        // El saldo es secundario: si su endpoint falla (p. ej. backend sin
        // migrar) no debe tumbar el dashboard, así que toleramos su error.
        const [dash, sal] = await Promise.all([
          getDashboard(1, TOP_PRODUCTOS, mes || undefined),
          getSaldo().catch(() => null),
        ]);
        if (id !== requestId.current) return;
        setData(dash);
        setSaldo(sal);
        setLastUpdated(new Date());
      } catch (e) {
        if (id !== requestId.current) return;
        setError(getErrorMessage(e, "No se pudo cargar el dashboard"));
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [mes],
  );

  useEffect(() => {
    void load();
    return () => { requestId.current += 1; };
  }, [load]);

  const updatedLabel = lastUpdated
    ? `Actualizado ${lastUpdated.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : null;

  return (
    <PageContainer
      title={`Hola, ${user?.nombre ?? "Administrador"}`}
      subtitle="Resumen general del sistema de inventario y ventas."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {updatedLabel ? (
              <span className="hidden text-xs text-ink-faint md:inline">
                {updatedLabel}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => load(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-soft transition-all hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:shadow-focus focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              Refrescar
            </button>
          </div>
        </div>
      }
    >
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink" htmlFor="mes-ventas">
          Consultar ventas por mes
          <input id="mes-ventas" type="month" value={mes} min="1000-01" max="9998-12"
            onChange={(event) => {
              const value = event.target.value;
              if (value === mes || (value && (!event.target.validity.valid || !/^\d{4}-\d{2}$/.test(value)))) return;
              requestId.current += 1;
              setLoading(true);
              setMes(value);
            }}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm" />
        </label>
        <button type="button" disabled={!mes} onClick={() => {
          requestId.current += 1;
          setLoading(true);
          setMes("");
        }} className="rounded-lg border border-line px-3 py-2 text-sm disabled:opacity-50">
          Ver histórico
        </button>
        <p className="text-xs text-ink-faint">
          {mes ? "Ventas de " + periodo + ". Ranking por unidades vendidas." : "Totales y ranking históricos; gráfico con navegación por fechas."}
          {" "}No incluye ventas anuladas. Fechas del mes en hora de Perú.
        </p>
      </div>
      {error ? (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => load()}
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div
          className={`flex flex-col gap-6 transition-opacity duration-200 ${
            refreshing ? "opacity-60" : "opacity-100"
          }`}
        >
          <DashboardStats resumen={data.resumen} periodo={mes ? periodo : undefined} />

          <SaldoDisponibleCard saldo={saldo} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <VentasChart monthlyData={mes ? data.ventas_por_dia : undefined} reloadToken={lastUpdated?.getTime() ?? 0} />
            <div className="flex flex-col gap-6">
              <MetodosPagoCard data={data.metodos_pago} />
              <TopProductosCard data={data.top_productos} periodo={mes ? periodo : undefined} />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

/** Esqueleto de carga del dashboard. */
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-80 animate-pulse rounded-2xl border border-line bg-line/40" />
        <div className="flex flex-col gap-6">
          <div className="h-40 animate-pulse rounded-2xl border border-line bg-line/40" />
          <div className="h-40 animate-pulse rounded-2xl border border-line bg-line/40" />
        </div>
      </div>
    </div>
  );
}
