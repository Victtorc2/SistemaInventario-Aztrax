/**
 * Tipos del módulo de caja diaria.
 *   POST /caja/abrir | GET /caja/actual | POST /caja/movimientos
 *   POST /caja/cerrar | GET /caja
 */

type Money = string | number;

export type TipoMovimientoCaja = "ingreso" | "egreso";

/** Un movimiento manual de efectivo dentro de la caja. */
export interface MovimientoCaja {
  id: number;
  tipo: string;
  monto: Money;
  motivo: string | null;
  fecha: string;
}

/** Estado de una sesión de caja con su arqueo. */
export interface Caja {
  id: number;
  estado: string; // "abierta" | "cerrada"
  monto_inicial: Money;
  ventas_efectivo: Money;
  total_ingresos: Money;
  total_egresos: Money;
  monto_esperado: Money;
  monto_declarado: Money | null;
  diferencia: Money | null;
  nota_apertura: string | null;
  nota_cierre: string | null;
  abierta_at: string;
  cerrada_at: string | null;
  movimientos: MovimientoCaja[];
}

/** Resumen de una sesión de caja en el historial. */
export interface CajaHistorialItem {
  id: number;
  estado: string;
  monto_inicial: Money;
  monto_esperado: Money | null;
  monto_declarado: Money | null;
  diferencia: Money | null;
  abierta_at: string;
  cerrada_at: string | null;
}

export interface AbrirCajaPayload {
  monto_inicial: number;
  nota?: string | null;
}

export interface CerrarCajaPayload {
  monto_declarado: number;
  nota?: string | null;
}

export interface MovimientoCajaPayload {
  tipo: TipoMovimientoCaja;
  monto: number;
  motivo?: string | null;
}
