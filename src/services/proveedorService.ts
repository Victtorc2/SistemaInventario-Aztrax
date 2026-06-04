/**
 * Servicio de proveedores.
 *
 * Encapsula las llamadas HTTP usando el axiosClient ya configurado (JWT
 * automático) y traduce los errores del backend a mensajes legibles —
 * incluido el caso "proveedor asociado a productos" al eliminar.
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type { Proveedor, ProveedorPayload } from "@/types/proveedor";

/** Lista proveedores. Si se pasa `search`, filtra por nombre o RUC en backend. */
export async function getProveedores(search?: string): Promise<Proveedor[]> {
  const { data } = await axiosClient.get<Proveedor[]>("/proveedores", {
    params: search ? { search } : undefined,
  });
  return data;
}

/** Crea un proveedor. */
export async function createProveedor(
  payload: ProveedorPayload,
): Promise<Proveedor> {
  try {
    const { data } = await axiosClient.post<Proveedor>("/proveedores", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo crear el proveedor"));
  }
}

/** Actualiza un proveedor existente. */
export async function updateProveedor(
  id: number,
  payload: ProveedorPayload,
): Promise<Proveedor> {
  try {
    const { data } = await axiosClient.put<Proveedor>(
      `/proveedores/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo actualizar el proveedor"));
  }
}

/** Elimina un proveedor. */
export async function deleteProveedor(id: number): Promise<void> {
  try {
    await axiosClient.delete(`/proveedores/${id}`);
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo eliminar el proveedor"));
  }
}

/**
 * Traduce un error de Axios a un mensaje legible, priorizando el `detail` del
 * backend (p. ej. "Ya existe un proveedor con ese RUC" o el mensaje de
 * proveedor asociado a productos).
 */