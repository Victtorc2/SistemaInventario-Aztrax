/**
 * InicioPage: dashboard principal del sistema.
 *
 * Consume GET /dashboard y muestra: KPIs (ventas, inventario), gráfico de
 * ventas por día, desglose por método de pago y ranking de productos más
 * vendidos. Maneja estados de carga (skeletons), error (con reintento) y un
 * refresco manual que conserva los datos en pantalla mientras recarga.
 */

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { VentasChart } from "@/components/dashboard/VentasChart";
import { MetodosPagoCard } from "@/components/dashboard/MetodosPagoCard";
import { TopProductosCard } from "@/components/dashboard/TopProductosCard";
import { CardSkeleton } from "@/components/ui/skeletons/CardSkeleton";
import { getDashboard } from "@/services/dashboardService";
import { getErrorMessage } from "@/utils/errorHandler";
import type { DashboardCompleto } from "@/types/dashboard";

/** Días de historial mostrados en el gráfico de ventas. */
const DIAS_PERIODO = 14;

export function InicioPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // `silent` evita el skeleton en refrescos manuales: conserva los datos
  // actuales y solo marca el botón como cargando.
  const load = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        setData(await getDashboard(DIAS_PERIODO, 5));
        setLastUpdated(new Date());
      } catch (e) {
        setError(getErrorMessage(e, "No se pudo cargar el dashboard"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
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
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-soft sm:inline-flex">
            Últimos {DIAS_PERIODO} días
          </span>
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
          <DashboardStats resumen={data.resumen} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
            <VentasChart data={data.ventas_por_dia} />
            <div className="flex flex-col gap-6">
              <MetodosPagoCard data={data.metodos_pago} />
              <TopProductosCard data={data.top_productos} />
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
