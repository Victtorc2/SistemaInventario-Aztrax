/**
 * Servicio del dashboard.
 *
 * Encapsula las llamadas a /dashboard usando el axiosClient (JWT automático).
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type { DashboardCompleto, ResumenDashboard } from "@/types/dashboard";

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
