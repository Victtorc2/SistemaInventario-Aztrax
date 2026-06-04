/**
 * Tipos del carrito de venta (estado de cliente, no del backend).
 */

import type { Producto } from "@/types/producto";

/** Una línea del carrito: el producto + la cantidad elegida. */
export interface CartItem {
  producto: Producto;
  cantidad: number;
}

/** Tipo de descuento aplicable a la venta. */
export type DescuentoTipo = "ninguno" | "monto" | "porcentaje";

/** Forma de pago de la venta (coincide con el backend). */
export type MetodoPago = "efectivo" | "yape";

/** Tipo de pago: al contado o al crédito (fiado). */
export type TipoPago = "contado" | "credito";

/** Estado del descuento elegido por el usuario. */
export interface DescuentoState {
  tipo: DescuentoTipo;
  /** Valor numérico: soles (monto) o porcentaje (0-100). */
  valor: number;
}

/** Totales calculados de la venta. */
export interface CartTotals {
  /** Nº de unidades totales (suma de cantidades). */
  unidades: number;
  /** Nº de líneas distintas. */
  lineas: number;
  subtotal: number;
  descuento: number;
  total: number;
}
