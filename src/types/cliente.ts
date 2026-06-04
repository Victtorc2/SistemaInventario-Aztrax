/**
 * Tipos del módulo de clientes (coinciden con los schemas del backend).
 *   GET/POST/PUT /clientes
 */

type Money = string | number;

/** Cliente tal como lo devuelve el backend (incluye su deuda total). */
export interface Cliente {
  id: number;
  nombre: string;
  documento: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  nota: string | null;
  is_active: boolean;
  created_at: string;
  deuda_total: Money;
}

/** Payload para crear/actualizar un cliente. */
export interface ClientePayload {
  nombre: string;
  documento?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  nota?: string | null;
}
