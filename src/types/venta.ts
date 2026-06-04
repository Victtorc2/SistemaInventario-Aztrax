/**
 * Tipos del módulo de ventas.
 *
 * Contrato del backend FastAPI:
 *   POST /ventas      -> registra una venta
 *   GET  /ventas/{id}  -> detalle de una venta
 *
 * Payload de POST /ventas (según backend implementado): los items van en
 * `items`, y el tipo de descuento es "monto" | "porcentaje".
 */

import type { DescuentoTipo, MetodoPago, TipoPago } from "@/types/cart";

/** Un item del payload de venta. */
export interface VentaItemPayload {
  producto_id: number;
  cantidad: number;
}

/** Payload para registrar una venta. */
export interface VentaPayload {
  items: VentaItemPayload[];
  descuento: number;
  // El backend acepta "monto" | "porcentaje"; null/omitido si no hay descuento.
  descuento_tipo?: Exclude<DescuentoTipo, "ninguno"> | null;
  // Forma de pago: efectivo o yape.
  metodo_pago: MetodoPago;
  // Tipo de pago: contado o crédito.
  tipo_pago: TipoPago;
  // Cliente: obligatorio si tipo_pago === "credito".
  cliente_id?: number | null;
  // Datos rápidos del cliente para ventas al contado (opcional).
  cliente_nombre?: string | null;
  cliente_documento?: string | null;
}

/** Línea de detalle devuelta por el backend. */
export interface VentaDetalle {
  id: number;
  producto_id: number;
  producto: string;
  marca: string;
  codigo: string;
  cantidad: number;
  precio: string | number;
  subtotal: string | number;
}

/** Venta devuelta por el backend (detalle completo). */
export interface Venta {
  id: number;
  numero_boleta: string;
  fecha: string;
  subtotal: string | number;
  descuento: string | number;
  descuento_tipo: string | null;
  metodo_pago: string;
  tipo_pago: string;
  saldo_pendiente: string | number;
  cliente_id: number | null;
  cliente_nombre: string | null;
  total: string | number;
  detalles: VentaDetalle[];
}
