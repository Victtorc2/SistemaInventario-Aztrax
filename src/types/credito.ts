/**
 * Tipos de crédito (fiado): abonos y estado de cuenta.
 *   POST /ventas/{id}/abonos
 *   GET  /clientes/{id}/estado-cuenta
 */

type Money = string | number;

/** Forma de pago de un abono. */
export type MetodoPagoAbono = "efectivo" | "yape";

/** Payload para registrar un abono. */
export interface AbonoPayload {
  monto: number;
  metodo_pago: MetodoPagoAbono;
  nota?: string | null;
}

/** Un abono registrado. */
export interface Abono {
  id: number;
  venta_id: number;
  monto: Money;
  metodo_pago: string;
  nota: string | null;
  fecha: string;
}

/** Una venta al crédito dentro del estado de cuenta. */
export interface VentaCredito {
  id: number;
  numero_boleta: string;
  fecha: string;
  total: Money;
  pagado: Money;
  saldo_pendiente: Money;
  abonos: Abono[];
}

/** Estado de cuenta completo de un cliente. */
export interface EstadoCuenta {
  cliente_id: number;
  cliente_nombre: string;
  deuda_total: Money;
  ventas: VentaCredito[];
}
