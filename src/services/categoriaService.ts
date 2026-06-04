/**
 * Servicio de categorías.
 *
 * Encapsula las llamadas HTTP al backend usando el axiosClient ya configurado
 * (que añade el JWT automáticamente). Traduce los errores a mensajes legibles.
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type { Categoria, CategoriaPayload } from "@/types/categoria";

/** Lista categorías. Si se pasa `search`, filtra por nombre en el backend. */
export async function getCategorias(search?: string): Promise<Categoria[]> {
  const { data } = await axiosClient.get<Categoria[]>("/categorias", {
    params: search ? { search } : undefined,
  });
  return data;
}

/** Crea una categoría. */
export async function createCategoria(
  payload: CategoriaPayload,
): Promise<Categoria> {
  try {
    const { data } = await axiosClient.post<Categoria>("/categorias", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo crear la categoría"));
  }
}

/** Actualiza una categoría existente. */
export async function updateCategoria(
  id: number,
  payload: CategoriaPayload,
): Promise<Categoria> {
  try {
    const { data } = await axiosClient.put<Categoria>(
      `/categorias/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo actualizar la categoría"));
  }
}

/** Elimina una categoría. */
export async function deleteCategoria(id: number): Promise<void> {
  try {
    await axiosClient.delete(`/categorias/${id}`);
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo eliminar la categoría"));
  }
}

/**
 * Traduce un error de Axios a un mensaje legible. Da prioridad al `detail`
 * que envía el backend (p. ej. "Ya existe una categoría con ese nombre").
 */