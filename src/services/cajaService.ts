/**
 * Servicio de caja diaria.
 *
 * Encapsula las llamadas a /caja usando el axiosClient (JWT automático):
 * abrir, consultar la actual, registrar movimientos, cerrar (arqueo) e
 * historial de sesiones.
 */

import { AxiosError } from "axios";
import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type {
  AbrirCajaPayload,
  Caja,
  CajaHistorialItem,
  CerrarCajaPayload,
  MovimientoCajaPayload,
} from "@/types/caja";

/**
 * Devuelve la caja abierta actual, o `null` si no hay ninguna (el backend
 * responde 409 en ese caso, que aquí traducimos a null para simplificar la UI).
 */
export async function getCajaActual(): Promise<Caja | null> {
  try {
    const { data } = await axiosClient.get<Caja>("/caja/actual");
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 409) {
      return null;
    }
    throw new Error(resolveAxiosError(error, "No se pudo cargar la caja"));
  }
}

/** Abre la caja con un fondo inicial. */
export async function abrirCaja(payload: AbrirCajaPayload): Promise<Caja> {
  try {
    const { data } = await axiosClient.post<Caja>("/caja/abrir", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo abrir la caja"));
  }
}

/** Registra un ingreso/egreso manual de efectivo en la caja abierta. */
export async function registrarMovimiento(
  payload: MovimientoCajaPayload,
): Promise<Caja> {
  try {
    const { data } = await axiosClient.post<Caja>("/caja/movimientos", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo registrar el movimiento"));
  }
}

/** Cierra la caja (arqueo: esperado vs declarado). */
export async function cerrarCaja(payload: CerrarCajaPayload): Promise<Caja> {
  try {
    const { data } = await axiosClient.post<Caja>("/caja/cerrar", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo cerrar la caja"));
  }
}

/** Historial de sesiones de caja, más recientes primero. */
export async function getHistorialCajas(): Promise<CajaHistorialItem[]> {
  const { data } = await axiosClient.get<CajaHistorialItem[]>("/caja");
  return data;
}
