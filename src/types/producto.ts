/**
 * Tipos del módulo de productos.
 *
 * Reflejan el contrato del backend FastAPI:
 *   GET    /productos               -> { items, total, page, page_size, total_pages }  (paginado)
 *   GET    /productos/buscar?q=      -> Producto[]
 *   POST   /productos               -> Producto
 *   PUT    /productos/{id}           -> Producto
 *   DELETE /productos/{id}           -> 204 (soft delete)
 *
 * El backend devuelve `categoria` y `proveedor` como NOMBRES (string), y el
 * `estado` calculado automáticamente según el stock. El `codigo` es
 * autogenerado (P0001, ...). Los precios llegan como string o number según
 * el serializador; se tipan como string|number y se normalizan al mostrar.
 */

/** Estado de stock calculado por el backend. */
export type EstadoProducto = "disponible" | "bajo_stock" | "agotado";

/** Producto tal como lo devuelve el backend. */
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string | null;
  categoria: string;
  proveedor: string;
  precio_compra: string | number;
  precio_venta: string | number;
  stock: number;
  stock_minimo: number;
  estado: EstadoProducto;
  created_at: string;
}

/**
 * Payload de creación/actualización. El backend espera los IDs de categoría y
 * proveedor (no los nombres). El código y el estado NO se envían: se generan
 * en el servidor.
 */
export interface ProductoPayload {
  nombre: string;
  marca: string;
  modelo?: string | null;
  categoria_id: number;
  proveedor_id: number;
  precio_compra: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
}

/** Respuesta paginada del backend para GET /productos. */
export interface PaginatedProductos {
  items: Producto[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** Filtros disponibles para el listado de productos. */
export interface ProductoFilters {
  search?: string;
  categoria?: number;
  proveedor?: number;
  estado?: EstadoProducto;
}
