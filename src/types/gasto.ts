/**
 * Tipos del módulo de gastos / egresos y del saldo de dinero.
 *   POST   /gastos        -> Gasto
 *   GET    /gastos        -> Gasto[]
 *   GET    /gastos/saldo  -> Saldo
 *   DELETE /gastos/{id}   -> 204
 */

type Money = string | number;

export type MetodoPagoGasto = "efectivo" | "yape";

export type CategoriaGasto =
  | "pedido"
  | "servicio"
  | "sueldo"
  | "alquiler"
  | "otro";

/** Un gasto (salida de dinero) registrado. */
export interface Gasto {
  id: number;
  categoria: string;
  monto: Money;
  metodo_pago: string;
  proveedor_id: number | null;
  proveedor_nombre: string | null;
  descripcion: string | null;
  caja_id: number | null;
  fecha: string;
}

/** Desglose del saldo disponible de un método de pago. */
export interface SaldoMetodo {
  ingresos: Money;
  egresos: Money;
  saldo: Money;
}

/** Dinero disponible por método de pago. */
export interface Saldo {
  efectivo: SaldoMetodo;
  yape: SaldoMetodo;
  total: Money;
}

export interface GastoPayload {
  categoria: CategoriaGasto;
  monto: number;
  metodo_pago: MetodoPagoGasto;
  proveedor_id?: number | null;
  descripcion?: string | null;
}

/** Filtros opcionales para el listado de gastos. */
export interface GastoFiltros {
  categoria?: CategoriaGasto;
  metodo_pago?: MetodoPagoGasto;
  proveedor?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
}

/** Etiquetas legibles de cada categoría (para selects y tablas). */
export const CATEGORIA_LABELS: Record<CategoriaGasto, string> = {
  pedido: "Pedido / compra",
  servicio: "Servicio",
  sueldo: "Sueldo",
  alquiler: "Alquiler",
  otro: "Otro",
};
