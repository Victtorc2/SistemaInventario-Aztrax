/**
 * useCart: estado y lógica del carrito de venta.
 *
 * Concentra TODA la lógica para mantener los componentes "tontos":
 *   - addItem: agrega o incrementa (sin duplicar), respetando el stock.
 *   - increment / decrement / setCantidad: ajustan cantidad con límites.
 *   - removeItem / clear: eliminan una línea o vacían el carrito.
 *   - setDescuento: fija tipo y valor del descuento.
 *   - totals: subtotal, descuento y total calculados (memoizados).
 *
 * Reglas de stock: la cantidad de una línea nunca supera el stock del producto
 * ni baja de 1. Devuelve códigos de resultado para que la página muestre el
 * toast adecuado sin conocer la lógica.
 */

import { useCallback, useMemo, useState } from "react";
import type { Producto } from "@/types/producto";
import {
  cartItemKey,
  type CartItem,
  type DescuentoState,
  type DescuentoTipo,
  type MetodoPago,
  type TipoPago,
} from "@/types/cart";
import { calculateTotals } from "@/utils/discount";

type AddResult = "added" | "incremented" | "max_stock" | "out_of_stock";

/** Datos para agregar una línea libre (producto no registrado). */
export interface LibreInput {
  descripcion: string;
  precio: number;
  costo: number | null;
  cantidad: number;
}

/** Genera un id local único para una línea libre. */
function makeUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [descuento, setDescuentoState] = useState<DescuentoState>({
    tipo: "ninguno",
    valor: 0,
  });
  // Forma de pago de la venta. Por defecto efectivo (el caso más común).
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("efectivo");
  // Tipo de pago: contado (por defecto) o crédito (fiado).
  const [tipoPago, setTipoPago] = useState<TipoPago>("contado");
  // Cliente asociado (obligatorio si es crédito; opcional al contado).
  const [clienteId, setClienteId] = useState<number | null>(null);
  // Datos rápidos del cliente para ventas al contado (opcional).
  const [clienteNombre, setClienteNombre] = useState<string>("");
  const [clienteDocumento, setClienteDocumento] = useState<string>("");

  /** Cantidad máxima de una línea: el stock si es producto; sin tope si es libre. */
  const maxCantidad = (it: CartItem): number =>
    it.kind === "producto" ? it.producto.stock : Number.POSITIVE_INFINITY;

  /** Agrega un producto o incrementa su cantidad si ya está en el carrito. */
  const addItem = useCallback((producto: Producto): AddResult => {
    if (producto.stock <= 0) return "out_of_stock";

    let result: AddResult = "added";
    setItems((prev) => {
      const existing = prev.find(
        (it) => it.kind === "producto" && it.producto.id === producto.id,
      );
      if (!existing) {
        result = "added";
        return [...prev, { kind: "producto", producto, cantidad: 1 }];
      }
      // Ya existe: incrementamos si no superamos el stock.
      if (existing.cantidad >= producto.stock) {
        result = "max_stock";
        return prev;
      }
      result = "incremented";
      return prev.map((it) =>
        it.kind === "producto" && it.producto.id === producto.id
          ? { ...it, cantidad: it.cantidad + 1 }
          : it,
      );
    });
    return result;
  }, []);

  /** Agrega una línea libre (producto no registrado) al carrito. */
  const addLibre = useCallback((data: LibreInput) => {
    setItems((prev) => [
      ...prev,
      {
        kind: "libre",
        uid: makeUid(),
        descripcion: data.descripcion,
        precio: data.precio,
        costo: data.costo,
        cantidad: Math.max(1, data.cantidad),
      },
    ]);
  }, []);

  /** Fija una cantidad concreta (acotada entre 1 y el máximo de la línea). */
  const setCantidad = useCallback((key: string, cantidad: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (cartItemKey(it) !== key) return it;
        const clamped = Math.max(1, Math.min(cantidad, maxCantidad(it)));
        return { ...it, cantidad: clamped };
      }),
    );
  }, []);

  const increment = useCallback((key: string) => {
    setItems((prev) =>
      prev.map((it) =>
        cartItemKey(it) === key && it.cantidad < maxCantidad(it)
          ? { ...it, cantidad: it.cantidad + 1 }
          : it,
      ),
    );
  }, []);

  const decrement = useCallback((key: string) => {
    setItems((prev) =>
      prev.map((it) =>
        cartItemKey(it) === key && it.cantidad > 1
          ? { ...it, cantidad: it.cantidad - 1 }
          : it,
      ),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((it) => cartItemKey(it) !== key));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setDescuentoState({ tipo: "ninguno", valor: 0 });
    setMetodoPago("efectivo");
    setTipoPago("contado");
    setClienteId(null);
    setClienteNombre("");
    setClienteDocumento("");
  }, []);

  const setDescuento = useCallback((tipo: DescuentoTipo, valor: number) => {
    setDescuentoState({ tipo, valor: Number.isNaN(valor) ? 0 : valor });
  }, []);

  // Totales memoizados: se recalculan solo si cambian items o descuento.
  const totals = useMemo(
    () => calculateTotals(items, descuento),
    [items, descuento],
  );

  return {
    items,
    descuento,
    metodoPago,
    tipoPago,
    clienteId,
    clienteNombre,
    clienteDocumento,
    totals,
    isEmpty: items.length === 0,
    addItem,
    addLibre,
    increment,
    decrement,
    setCantidad,
    removeItem,
    clear,
    setDescuento,
    setMetodoPago,
    setTipoPago,
    setClienteId,
    setClienteNombre,
    setClienteDocumento,
  };
}

export type UseCart = ReturnType<typeof useCart>;
