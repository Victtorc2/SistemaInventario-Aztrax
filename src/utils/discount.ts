/**
 * Lógica de cálculo de descuentos y totales de venta.
 *
 * Centralizada aquí para no repetir cálculos en componentes ni en el hook.
 * Todos los importes se redondean a 2 decimales para evitar errores de coma
 * flotante en moneda.
 */

import type { CartItem, CartTotals, DescuentoState } from "@/types/cart";

/** Redondeo monetario a 2 decimales. */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Precio unitario de una línea como número (producto registrado o línea libre). */
export function precioVenta(item: CartItem): number {
  if (item.kind === "libre") {
    return Number.isNaN(item.precio) ? 0 : item.precio;
  }
  const p = item.producto.precio_venta;
  const n = typeof p === "string" ? parseFloat(p) : p;
  return Number.isNaN(n) ? 0 : n;
}

/** Subtotal de una línea: precio × cantidad. */
export function lineSubtotal(item: CartItem): number {
  return round2(precioVenta(item) * item.cantidad);
}

/**
 * Calcula el monto de descuento efectivo a partir del subtotal.
 *
 * - "monto":      `valor` es un importe fijo en soles.
 * - "porcentaje": `valor` es un % (0-100) del subtotal.
 * - "ninguno":    sin descuento.
 * El resultado nunca es negativo ni supera el subtotal.
 */
export function calculateDiscount(
  subtotal: number,
  descuento: DescuentoState,
): number {
  if (descuento.tipo === "ninguno" || descuento.valor <= 0) return 0;

  let monto: number;
  if (descuento.tipo === "porcentaje") {
    const pct = Math.min(Math.max(descuento.valor, 0), 100);
    monto = (subtotal * pct) / 100;
  } else {
    monto = descuento.valor;
  }
  return round2(Math.min(Math.max(monto, 0), subtotal));
}

/** Calcula todos los totales del carrito en una sola pasada. */
export function calculateTotals(
  items: CartItem[],
  descuento: DescuentoState,
): CartTotals {
  const subtotal = round2(
    items.reduce((acc, item) => acc + lineSubtotal(item), 0),
  );
  const montoDescuento = calculateDiscount(subtotal, descuento);
  const total = round2(subtotal - montoDescuento);
  return {
    unidades: items.reduce((acc, item) => acc + item.cantidad, 0),
    lineas: items.length,
    subtotal,
    descuento: montoDescuento,
    total,
  };
}

/**
 * Valida el descuento contra el subtotal. Devuelve un mensaje de error o null.
 */
export function validateDiscount(
  subtotal: number,
  descuento: DescuentoState,
): string | null {
  if (descuento.tipo === "ninguno") return null;
  if (descuento.valor < 0) return "Descuento inválido";
  if (descuento.tipo === "porcentaje" && descuento.valor > 100) {
    return "El porcentaje no puede superar 100%";
  }
  if (descuento.tipo === "monto" && descuento.valor > subtotal) {
    return "El descuento no puede superar el subtotal";
  }
  return null;
}
