/**
 * Tipos del módulo de fidelización (puntos).
 *   GET  /clientes/{id}/puntos
 *   POST /clientes/{id}/puntos/canjear
 */

/** Un movimiento del historial de puntos. */
export interface MovimientoPuntos {
  id: number;
  tipo: string; // "ganado" | "canjeado" | "revertido"
  puntos: number; // con signo: + ganado, - canjeado/revertido
  venta_id: number | null;
  descripcion: string | null;
  fecha: string;
}

/** Saldo de puntos del cliente con su historial. */
export interface PuntosResumen {
  cliente_id: number;
  cliente_nombre: string;
  puntos: number;
  movimientos: MovimientoPuntos[];
}

/** Payload para canjear puntos. */
export interface CanjePayload {
  puntos: number;
  descripcion?: string | null;
}
