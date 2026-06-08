/**
 * Tipos del carrito de venta (estado de cliente, no del backend).
 */

import type { Producto } from "@/types/producto";

/** Línea del carrito de un producto registrado en el inventario. */
export interface CartProductoItem {
  kind: "producto";
  producto: Producto;
  cantidad: number;
}

/**
 * Línea "libre": un producto NO registrado, escrito a mano. El vendedor fija el
 * precio (y opcionalmente el costo, para la rentabilidad). No controla stock.
 */
export interface CartLibreItem {
  kind: "libre";
  /** Id local único de la línea (no es un id de producto). */
  uid: string;
  descripcion: string;
  precio: number;
  /** Costo unitario opcional (null = no informado → ganancia 100%). */
  costo: number | null;
  cantidad: number;
}

/** Una línea del carrito: producto registrado o línea libre. */
export type CartItem = CartProductoItem | CartLibreItem;

/** Clave estable de una línea del carrito (sirve de React key y de id de operación). */
export function cartItemKey(item: CartItem): string {
  return item.kind === "producto" ? `p-${item.producto.id}` : `l-${item.uid}`;
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
