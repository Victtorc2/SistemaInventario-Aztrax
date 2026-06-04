/**
 * Servicio de clientes y crédito (fiado).
 *
 * Encapsula las llamadas a /clientes y a los abonos sobre ventas a crédito.
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type { Cliente, ClientePayload } from "@/types/cliente";
import type { AbonoPayload, Abono, EstadoCuenta } from "@/types/credito";

/** Lista clientes. Con `search`, filtra por nombre/documento/teléfono. */
export async function getClientes(search?: string): Promise<Cliente[]> {
  const { data } = await axiosClient.get<Cliente[]>("/clientes", {
    params: search ? { search } : undefined,
  });
  return data;
}

/** Lista solo los clientes con deuda pendiente (mayor deuda primero). */
export async function getDeudores(): Promise<Cliente[]> {
  const { data } = await axiosClient.get<Cliente[]>("/clientes/deudores");
  return data;
}

/** Obtiene un cliente por id. */
export async function getCliente(id: number): Promise<Cliente> {
  const { data } = await axiosClient.get<Cliente>(`/clientes/${id}`);
  return data;
}

/** Obtiene el estado de cuenta (ventas a crédito + abonos) de un cliente. */
export async function getEstadoCuenta(id: number): Promise<EstadoCuenta> {
  const { data } = await axiosClient.get<EstadoCuenta>(
    `/clientes/${id}/estado-cuenta`,
  );
  return data;
}

/** Crea un cliente. */
export async function createCliente(payload: ClientePayload): Promise<Cliente> {
  try {
    const { data } = await axiosClient.post<Cliente>("/clientes", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo crear el cliente"));
  }
}

/** Actualiza un cliente. */
export async function updateCliente(
  id: number,
  payload: ClientePayload,
): Promise<Cliente> {
  try {
    const { data } = await axiosClient.put<Cliente>(`/clientes/${id}`, payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo actualizar el cliente"));
  }
}

/** Da de baja (lógica) un cliente. */
export async function deleteCliente(id: number): Promise<void> {
  try {
    await axiosClient.delete(`/clientes/${id}`);
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo eliminar el cliente"));
  }
}

/** Registra un abono (pago parcial) sobre una venta al crédito. */
export async function createAbono(
  ventaId: number,
  payload: AbonoPayload,
): Promise<Abono> {
  try {
    const { data } = await axiosClient.post<Abono>(
      `/ventas/${ventaId}/abonos`,
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo registrar el abono"));
  }
}
