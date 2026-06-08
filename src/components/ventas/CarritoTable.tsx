/**
 * CarritoTable: líneas del carrito de venta.
 *
 * Columnas: producto, precio, cantidad (CantidadSelector), subtotal y acción
 * de eliminar. El subtotal de cada línea se recalcula automáticamente. En
 * móvil colapsa a un layout apilado por línea.
 */

import { Trash2 } from "lucide-react";
import { CantidadSelector } from "@/components/ventas/CantidadSelector";
import { formatMoney } from "@/utils/format";
import { lineSubtotal, precioVenta } from "@/utils/discount";
import { cartItemKey, type CartItem } from "@/types/cart";

interface CarritoTableProps {
  items: CartItem[];
  onIncrement: (key: string) => void;
  onDecrement: (key: string) => void;
  onRemove: (item: CartItem) => void;
}

/** Nombre y subtítulo a mostrar de una línea (producto registrado o libre). */
function lineInfo(item: CartItem): { nombre: string; sub: string } {
  if (item.kind === "libre") {
    return { nombre: item.descripcion, sub: "Venta libre" };
  }
  const modelo = item.producto.modelo ? ` / ${item.producto.modelo}` : "";
  return { nombre: item.producto.nombre, sub: `${item.producto.marca}${modelo}` };
}

export function CarritoTable({
  items,
  onIncrement,
  onDecrement,
  onRemove,
}: CarritoTableProps) {
  return (
    <ul className="divide-y divide-line/70">
      {items.map((item) => {
        const key = cartItemKey(item);
        const { nombre, sub } = lineInfo(item);
        // Las líneas libres no tienen tope de cantidad (no controlan stock).
        const max =
          item.kind === "producto" ? item.producto.stock : Number.POSITIVE_INFINITY;
        return (
          <li key={key} className="flex flex-wrap items-center gap-3 py-3">
            {/* Producto + precio unitario */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{nombre}</p>
              <p className="text-xs text-ink-faint">
                {formatMoney(precioVenta(item))} c/u · {sub}
              </p>
            </div>

            {/* Selector de cantidad */}
            <CantidadSelector
              value={item.cantidad}
              max={max}
              onIncrement={() => onIncrement(key)}
              onDecrement={() => onDecrement(key)}
            />

            {/* Subtotal de la línea */}
            <span className="w-20 text-right text-sm font-semibold tabular-nums text-ink">
              {formatMoney(lineSubtotal(item))}
            </span>

            {/* Eliminar */}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-danger/10 hover:text-danger"
              aria-label={`Quitar ${nombre}`}
            >
              <Trash2 size={16} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
