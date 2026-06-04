/**
 * Tipos del módulo de historial y boleta.
 *
 * Contrato del backend FastAPI:
 *   GET /historial        -> { total, page, page_size, items: HistorialItem[] }
 *   GET /historial/{id}    -> Venta (detalle completo, ver types/venta.ts)
 */

/** Resumen de una venta en el listado del historial. */
export interface HistorialItem {
  id: number;
  numero_boleta: string;
  fecha: string;
  subtotal: string | number;
  descuento: string | number;
  total: string | number;
  cantidad_productos: number;
}

/** Respuesta paginada del historial. */
export interface HistorialPaginado {
  total: number;
  page: number;
  page_size: number;
  items: HistorialItem[];
}

/** Filtros del historial. */
export interface HistorialFilters {
  boleta?: string;
  fecha?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  page_size?: number;
}

/**
 * Datos del negocio para el encabezado de la boleta. El backend genera el PDF
 * con estos datos; en el frontend los replicamos para la vista previa HTML.
 * Idealmente vendrían de una config/endpoint; por ahora son constantes.
 */
export interface DatosNegocio {
  nombre: string;
  ruc: string;
  direccion: string;
  ciudad: string;
  telefono: string;
}

export const DATOS_NEGOCIO: DatosNegocio = {
  nombre: "Mi Tienda SAC",
  ruc: "20456789123",
  direccion: "Av. Perú 123",
  ciudad: "Ica - Perú",
  telefono: "999 999 999",
};
