/**
 * Tipos del módulo de proveedores.
 *
 * Reflejan el contrato del backend FastAPI:
 *   GET    /proveedores        -> Proveedor[]
 *   POST   /proveedores        -> Proveedor
 *   PUT    /proveedores/{id}    -> Proveedor
 *   DELETE /proveedores/{id}    -> 204
 *
 * Los campos opcionales pueden venir como null desde el backend.
 */

export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  ruc: string | null;
  observaciones: string | null;
  created_at: string;
}

/**
 * Payload de creación/actualización. Los campos opcionales se envían como
 * string (el backend los normaliza); se omiten o envían vacíos si no aplican.
 */
export interface ProveedorPayload {
  nombre: string;
  telefono?: string | null;
  direccion?: string | null;
  ruc?: string | null;
  observaciones?: string | null;
}
