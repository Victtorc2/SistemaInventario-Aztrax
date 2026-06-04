/**
 * InicioPage: dashboard principal del sistema.
 *
 * Consume GET /dashboard y muestra: KPIs (ventas, inventario), gráfico de
 * ventas por día, desglose por método de pago y ranking de productos más
 * vendidos. Maneja estados de carga (skeletons) y error (con reintento).
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

export function InicioPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getDashboard(14, 5));
    } catch (e) {
      setError(getErrorMessage(e, "No se pudo cargar el dashboard"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PageContainer
      title={`Hola, ${user?.nombre ?? "Administrador"}`}
      subtitle="Resumen general del sistema de inventario y ventas."
    >
      {error ? (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-6">
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
