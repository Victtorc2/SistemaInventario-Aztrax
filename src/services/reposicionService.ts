/**
 * Servicio del módulo de reposición ("productos por pedir").
 *
 * Consume GET /productos/por-pedir, que devuelve productos agotados o con bajo
 * stock (el backend ya aplica la regla y el orden: agotados primero). Admite
 * filtros opcionales por estado, búsqueda, categoría y proveedor.
 */

import { axiosClient } from "@/api/axiosClient";

/** Producto en la lista de reposición (proyección del backend). */
export interface ProductoPorPedir {
  id: number;
  codigo: string;
  nombre: string;
  modelo: string | null;
  stock: number;
  stock_minimo: number;
  estado: "agotado" | "bajo_stock";
  categoria: string;
  proveedor: string;
}

export interface ReposicionFilters {
  search?: string;
  estado?: "agotado" | "bajo_stock";
}

/** Obtiene los productos que requieren reposición. */
export async function getProductosPorPedir(
  filters: ReposicionFilters = {},
): Promise<ProductoPorPedir[]> {
  const params: Record<string, string> = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.estado) params.estado = filters.estado;

  const { data } = await axiosClient.get<ProductoPorPedir[]>(
    "/productos/por-pedir",
    { params },
  );
  return data;
}
