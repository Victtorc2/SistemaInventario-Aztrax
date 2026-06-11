/**
 * Servicio de clientes y crédito (fiado).
 *
 * Encapsula las llamadas a /clientes y a los abonos sobre ventas a crédito.
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type {
  Cliente,
  ClienteInactivo,
  ClientePayload,
  PerfilCliente,
} from "@/types/cliente";
import type { AbonoPayload, Abono, EstadoCuenta } from "@/types/credito";
import type { CanjePayload, PuntosResumen } from "@/types/puntos";

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

/** Perfil 360° del cliente: métricas de compra, favoritos e historial. */
export async function getPerfilCliente(id: number): Promise<PerfilCliente> {
  const { data } = await axiosClient.get<PerfilCliente>(
    `/clientes/${id}/perfil`,
  );
  return data;
}

/** Clientes que no compran hace al menos `dias` días (para recuperar). */
export async function getClientesInactivos(
  dias = 30,
): Promise<ClienteInactivo[]> {
  const { data } = await axiosClient.get<ClienteInactivo[]>(
    "/clientes/inactivos",
    { params: { dias } },
  );
  return data;
}

/** Saldo de puntos del cliente y su historial de movimientos. */
export async function getPuntos(id: number): Promise<PuntosResumen> {
  const { data } = await axiosClient.get<PuntosResumen>(
    `/clientes/${id}/puntos`,
  );
  return data;
}

/** Canjea puntos del cliente. Devuelve el saldo actualizado. */
export async function canjearPuntos(
  id: number,
  payload: CanjePayload,
): Promise<PuntosResumen> {
  try {
    const { data } = await axiosClient.post<PuntosResumen>(
      `/clientes/${id}/puntos/canjear`,
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudieron canjear los puntos"));
  }
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
