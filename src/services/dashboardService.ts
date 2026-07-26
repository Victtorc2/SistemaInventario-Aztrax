/**
 * Servicio del dashboard.
 *
 * Encapsula las llamadas a /dashboard usando el axiosClient (JWT automático).
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type {
  DashboardCompleto,
  ResumenDashboard,
  VentaPorDia,
} from "@/types/dashboard";

/** Obtiene las métricas completas del dashboard. */
export async function getDashboard(
  dias = 14,
  top = 5,
): Promise<DashboardCompleto> {
  try {
    const { data } = await axiosClient.get<DashboardCompleto>("/dashboard", {
      params: { dias, top },
    });
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo cargar el dashboard"));
  }
}

/**
 * Serie de ventas por día en un rango de fechas (para el gráfico con
 * navegación temporal). Las fechas van en formato ISO "YYYY-MM-DD".
 */
export async function getVentasPorDia(
  desde: string,
  hasta: string,
): Promise<VentaPorDia[]> {
  try {
    const { data } = await axiosClient.get<VentaPorDia[]>(
      "/dashboard/ventas-por-dia",
      { params: { desde, hasta } },
    );
    return data;
  } catch (error) {
    throw new Error(
      resolveAxiosError(error, "No se pudieron cargar las ventas por día"),
    );
  }
}

/** Obtiene solo las tarjetas KPI (respuesta ligera). */
export async function getResumen(): Promise<ResumenDashboard> {
  try {
    const { data } = await axiosClient.get<ResumenDashboard>(
      "/dashboard/resumen",
    );
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo cargar el resumen"));
  }
}
