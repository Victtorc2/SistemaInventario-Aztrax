/**
 * Servicio de historial de ventas.
 *
 * Encapsula GET /historial (paginado + filtros) y GET /historial/{id}
 * (detalle). Usa el axiosClient con JWT automático.
 */

import { AxiosError } from "axios";
import { axiosClient } from "@/api/axiosClient";
import type { HistorialFilters, HistorialPaginado } from "@/types/historial";
import type { Venta } from "@/types/venta";

/** Lista el historial con filtros y paginación. */
export async function getHistorial(
  filters: HistorialFilters = {},
): Promise<HistorialPaginado> {
  const params: Record<string, string | number> = {};
  if (filters.boleta?.trim()) params.boleta = filters.boleta.trim();
  if (filters.fecha) params.fecha = filters.fecha;
  if (filters.fecha_inicio) params.fecha_inicio = filters.fecha_inicio;
  if (filters.fecha_fin) params.fecha_fin = filters.fecha_fin;
  params.page = filters.page ?? 1;
  params.page_size = filters.page_size ?? 10;

  try {
    const { data } = await axiosClient.get<HistorialPaginado>("/historial", {
      params,
    });
    return data;
  } catch (error) {
    throw new Error(resolveError(error, "Error al obtener historial"));
  }
}

/** Atajo: historial por fecha exacta. */
export function getHistorialByFecha(
  fecha: string,
  page = 1,
): Promise<HistorialPaginado> {
  return getHistorial({ fecha, page });
}

/** Atajo: historial por número de boleta (parcial). */
export function getHistorialByBoleta(
  boleta: string,
  page = 1,
): Promise<HistorialPaginado> {
  return getHistorial({ boleta, page });
}

/** Detalle completo de una venta. */
export async function getDetalleVenta(id: number): Promise<Venta> {
  try {
    const { data } = await axiosClient.get<Venta>(`/historial/${id}`);
    return data;
  } catch (error) {
    throw new Error(resolveError(error, "No se pudo obtener el detalle"));
  }
}

function resolveError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as { detail?: string })?.detail;
    if (detail) return detail;
    if (!error.response) return "No se pudo conectar con el servidor";
    if (error.response.status >= 500) return "Error del servidor";
  }
  return fallback;
}
