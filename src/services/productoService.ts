/**
 * Servicio de productos.
 *
 * Encapsula las llamadas HTTP usando el axiosClient (JWT automático). El
 * listado admite filtros combinables que se envían como query params; la
 * búsqueda dedicada usa el endpoint /productos/buscar.
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type {
  PaginatedProductos,
  Producto,
  ProductoFilters,
  ProductoPayload,
} from "@/types/producto";

/**
 * Lista productos aplicando filtros opcionales (search, categoria, etc.).
 *
 * El backend ahora devuelve la respuesta PAGINADA ({ items, total, ... }) con
 * un máximo de 100 por página. Para mantener el contrato `Producto[]` que
 * esperan las pantallas (inventario y ventas muestran todo el listado),
 * recorremos todas las páginas y concatenamos los items. También se acepta
 * el formato antiguo (array directo) por compatibilidad.
 */
export async function getProductos(
  filters: ProductoFilters = {},
): Promise<Producto[]> {
  // Construimos params solo con los filtros definidos.
  const params: Record<string, string | number | boolean> = { page_size: 100 };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.proveedor) params.proveedor = filters.proveedor;
  if (filters.estado) params.estado = filters.estado;
  // activo: solo lo enviamos cuando se pide explícitamente desactivados
  // (false). Omitirlo deja el comportamiento por defecto del backend (activos).
  if (filters.activo === false) params.activo = false;
  if (filters.orden) params.orden = filters.orden;

  const { data } = await axiosClient.get<PaginatedProductos | Producto[]>(
    "/productos",
    { params: { ...params, page: 1 } },
  );

  // Compatibilidad: si el backend devolviera un array (formato antiguo).
  if (Array.isArray(data)) return data;

  let items = data.items;
  // Si hay más de una página, traemos el resto y concatenamos.
  for (let page = 2; page <= data.total_pages; page++) {
    const { data: next } = await axiosClient.get<PaginatedProductos>(
      "/productos",
      { params: { ...params, page } },
    );
    items = items.concat(next.items);
  }
  return items;
}

/** Búsqueda dedicada por nombre o código (endpoint /productos/buscar). */
export async function searchProductos(q: string): Promise<Producto[]> {
  const { data } = await axiosClient.get<Producto[]>("/productos/buscar", {
    params: { q },
  });
  return data;
}

/** Crea un producto. */
export async function createProducto(
  payload: ProductoPayload,
): Promise<Producto> {
  try {
    const { data } = await axiosClient.post<Producto>("/productos", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo crear el producto"));
  }
}

/** Actualiza un producto existente. */
export async function updateProducto(
  id: number,
  payload: ProductoPayload,
): Promise<Producto> {
  try {
    const { data } = await axiosClient.put<Producto>(
      `/productos/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo actualizar el producto"));
  }
}

/**
 * Activa o desactiva un producto (soft delete reversible).
 *
 * A diferencia de `deleteProducto`, esto permite REACTIVAR uno desactivado
 * (PUT /productos/{id}/activo?activo=true|false).
 */
export async function toggleActivoProducto(
  id: number,
  activo: boolean,
): Promise<Producto> {
  try {
    const { data } = await axiosClient.put<Producto>(
      `/productos/${id}/activo`,
      null,
      { params: { activo } },
    );
    return data;
  } catch (error) {
    throw new Error(
      resolveAxiosError(
        error,
        activo ? "No se pudo activar el producto" : "No se pudo desactivar el producto",
      ),
    );
  }
}

/** Elimina (soft delete) un producto. */
export async function deleteProducto(id: number): Promise<void> {
  try {
    await axiosClient.delete(`/productos/${id}`);
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo eliminar el producto"));
  }
}

/**
 * Descarga el reporte PDF del inventario (GET /productos/reporte/pdf) aplicando
 * los MISMOS filtros que el listado. El backend genera el PDF y aquí se dispara
 * la descarga en el navegador con un nombre con fecha.
 */
export async function downloadReporteProductos(
  filters: ProductoFilters = {},
): Promise<void> {
  // Mismos params que getProductos: solo los filtros definidos.
  const params: Record<string, string | number> = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.proveedor) params.proveedor = filters.proveedor;
  if (filters.estado) params.estado = filters.estado;

  try {
    const { data } = await axiosClient.get("/productos/reporte/pdf", {
      params,
      responseType: "blob",
    });
    const url = URL.createObjectURL(data as Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_inventario_${reporteTimestamp()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo generar el reporte"));
  }
}

/** Marca de tiempo para el nombre del archivo: 20260606_1530. */
function reporteTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `_${pad(now.getHours())}${pad(now.getMinutes())}`
  );
}