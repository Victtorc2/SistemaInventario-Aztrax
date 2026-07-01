/**
 * Servicio de gastos / egresos y saldo de dinero.
 *
 * Encapsula las llamadas a /gastos usando el axiosClient (JWT automático):
 * registrar un gasto, listar con filtros, consultar el saldo por método y
 * eliminar un gasto.
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type {
  AjusteSaldo,
  AjusteSaldoPayload,
  Gasto,
  GastoFiltros,
  GastoPayload,
  MetodoPagoGasto,
  Saldo,
} from "@/types/gasto";

/** Dinero disponible por método de pago (efectivo/yape) y total. */
export async function getSaldo(): Promise<Saldo> {
  try {
    const { data } = await axiosClient.get<Saldo>("/gastos/saldo");
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo cargar el saldo"));
  }
}

/** Lista los gastos que cumplen los filtros, más recientes primero. */
export async function getGastos(filtros?: GastoFiltros): Promise<Gasto[]> {
  try {
    const { data } = await axiosClient.get<Gasto[]>("/gastos", {
      params: filtros && Object.keys(filtros).length ? filtros : undefined,
    });
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudieron cargar los gastos"));
  }
}

/** Registra un gasto (salida de dinero). */
export async function createGasto(payload: GastoPayload): Promise<Gasto> {
  try {
    const { data } = await axiosClient.post<Gasto>("/gastos", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo registrar el gasto"));
  }
}

/** Elimina un gasto (restaura el saldo del método). */
export async function deleteGasto(id: number): Promise<void> {
  try {
    await axiosClient.delete(`/gastos/${id}`);
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo eliminar el gasto"));
  }
}

/**
 * Agrega o modifica el saldo de un método (con motivo). Devuelve el saldo
 * actualizado.
 */
export async function createAjuste(
  payload: AjusteSaldoPayload,
): Promise<Saldo> {
  try {
    const { data } = await axiosClient.post<Saldo>("/gastos/ajustes", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo ajustar el saldo"));
  }
}

/** Historial de ajustes de saldo, más recientes primero. */
export async function getAjustes(
  metodo?: MetodoPagoGasto,
): Promise<AjusteSaldo[]> {
  try {
    const { data } = await axiosClient.get<AjusteSaldo[]>("/gastos/ajustes", {
      params: metodo ? { metodo_pago: metodo } : undefined,
    });
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudieron cargar los ajustes"));
  }
}
