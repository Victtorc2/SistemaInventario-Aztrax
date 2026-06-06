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
  Producto,
  ProductoFilters,
  ProductoPayload,
} from "@/types/producto";

/** Lista productos aplicando filtros opcionales (search, categoria, etc.). */
export async function getProductos(
  filters: ProductoFilters = {},
): Promise<Producto[]> {
  // Construimos params solo con los filtros definidos.
  const params: Record<string, string | number> = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.proveedor) params.proveedor = filters.proveedor;
  if (filters.estado) params.estado = filters.estado;

  const { data } = await axiosClient.get<Producto[]>("/productos", { params });
  return data;
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