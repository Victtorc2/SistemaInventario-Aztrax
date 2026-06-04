/**
 * Servicio de rentabilidad.
 *   GET /rentabilidad?desde=&hasta=&agrupar=
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type { ReporteRentabilidad } from "@/types/rentabilidad";

export interface RentabilidadParams {
  desde?: string;
  hasta?: string;
  agrupar?: "dia" | "mes";
}

/** Obtiene el reporte de rentabilidad para el rango/agrupación indicados. */
export async function getRentabilidad(
  params: RentabilidadParams = {},
): Promise<ReporteRentabilidad> {
  try {
    const { data } = await axiosClient.get<ReporteRentabilidad>("/rentabilidad", {
      params: {
        desde: params.desde || undefined,
        hasta: params.hasta || undefined,
        agrupar: params.agrupar ?? "dia",
      },
    });
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo cargar la rentabilidad"));
  }
}
