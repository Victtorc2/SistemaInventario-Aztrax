/**
 * Servicio de ventas.
 *
 * Encapsula las llamadas a /ventas usando el axiosClient (JWT automático).
 *
 * Nota de contrato: el enunciado menciona descuento_tipo "fijo", pero el
 * backend implementado espera "monto". Aquí enviamos "monto" (el real). Si tu
 * backend usara "fijo", cambia MAP_TIPO abajo — es el único punto a tocar.
 */

import { axiosClient } from "@/api/axiosClient";
import { resolveAxiosError } from "@/utils/errorHandler";
import type {
  CartItem,
  DescuentoState,
  MetodoPago,
  TipoPago,
} from "@/types/cart";
import type { Venta, VentaItemPayload, VentaPayload } from "@/types/venta";

/** Mapea el tipo de descuento del frontend al que espera el backend. */
const MAP_TIPO: Record<string, "monto" | "porcentaje"> = {
  monto: "monto",
  porcentaje: "porcentaje",
};

/** Datos de pago para construir el payload de venta. */
export interface PagoVenta {
  metodoPago: MetodoPago;
  tipoPago: TipoPago;
  clienteId: number | null;
  clienteNombre?: string;
  clienteDocumento?: string;
}

/** Construye el payload de venta a partir del carrito, descuento y forma de pago. */
export function buildVentaPayload(
  items: CartItem[],
  descuento: DescuentoState,
  pago: PagoVenta,
): VentaPayload {
  const esContado = pago.tipoPago !== "credito";
  const nombre = (pago.clienteNombre ?? "").trim();
  const documento = (pago.clienteDocumento ?? "").trim();
  // Si se eligió un cliente ya registrado (en contado o crédito), se envía su
  // id. Los datos rápidos (nombre/documento) solo aplican en contado cuando NO
  // hay un cliente registrado seleccionado.
  const usaClienteRegistrado = pago.clienteId != null;
  const mapItem = (it: CartItem): VentaItemPayload => {
    if (it.kind === "libre") {
      // Línea libre: descripción + precio (y costo opcional). Sin producto_id.
      return {
        descripcion: it.descripcion,
        precio: it.precio,
        costo: it.costo ?? undefined,
        cantidad: it.cantidad,
      };
    }
    return { producto_id: it.producto.id, cantidad: it.cantidad };
  };
  return {
    items: items.map(mapItem),
    descuento: descuento.tipo === "ninguno" ? 0 : descuento.valor,
    descuento_tipo:
      descuento.tipo === "ninguno" ? null : MAP_TIPO[descuento.tipo],
    metodo_pago: pago.metodoPago,
    tipo_pago: pago.tipoPago,
    cliente_id: pago.clienteId,
    cliente_nombre:
      esContado && !usaClienteRegistrado && nombre ? nombre : null,
    cliente_documento:
      esContado && !usaClienteRegistrado && documento ? documento : null,
  };
}

/** Registra una venta. Devuelve la venta creada (con número de boleta). */
export async function createVenta(payload: VentaPayload): Promise<Venta> {
  try {
    const { data } = await axiosClient.post<Venta>("/ventas", payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo registrar la venta"));
  }
}

/** Plazo (en días) durante el cual una venta puede modificarse. */
export const VENTA_EDIT_DIAS = 3;

/** True si la venta aún puede modificarse (no anulada y dentro del plazo). */
export function esVentaEditable(fecha: string, anulada: boolean): boolean {
  if (anulada) return false;
  const creada = new Date(fecha).getTime();
  if (Number.isNaN(creada)) return false;
  const dias = (Date.now() - creada) / (1000 * 60 * 60 * 24);
  return dias <= VENTA_EDIT_DIAS;
}

/** Modifica una venta existente (dentro del plazo). Devuelve la venta editada. */
export async function editarVenta(
  id: number,
  payload: VentaPayload,
): Promise<Venta> {
  try {
    const { data } = await axiosClient.put<Venta>(`/ventas/${id}`, payload);
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo modificar la venta"));
  }
}

/** Obtiene el detalle de una venta. */
export async function getVenta(id: number): Promise<Venta> {
  const { data } = await axiosClient.get<Venta>(`/historial/${id}`);
  return data;
}

/**
 * Anula una venta (devolución total): repone el stock, revierte los puntos y la
 * marca como anulada. Devuelve la venta anulada.
 */
export async function anularVenta(id: number, motivo?: string): Promise<Venta> {
  try {
    const { data } = await axiosClient.post<Venta>(`/ventas/${id}/anular`, {
      motivo: motivo?.trim() || null,
    });
    return data;
  } catch (error) {
    throw new Error(resolveAxiosError(error, "No se pudo anular la venta"));
  }
}