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
import type { CartItem } from "@/types/cart";

interface CarritoTableProps {
  items: CartItem[];
  onIncrement: (productoId: number) => void;
  onDecrement: (productoId: number) => void;
  onRemove: (item: CartItem) => void;
}

export function CarritoTable({
  items,
  onIncrement,
  onDecrement,
  onRemove,
}: CarritoTableProps) {
  return (
    <ul className="divide-y divide-line/70">
      {items.map((item) => (
        <li
          key={item.producto.id}
          className="flex flex-wrap items-center gap-3 py-3"
        >
          {/* Producto + precio unitario */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {item.producto.nombre}
            </p>
            <p className="text-xs text-ink-faint">
              {formatMoney(precioVenta(item))} c/u · {item.producto.marca}
              {item.producto.modelo ? ` / ${item.producto.modelo}` : ""}
            </p>
          </div>

          {/* Selector de cantidad */}
          <CantidadSelector
            value={item.cantidad}
            max={item.producto.stock}
            onIncrement={() => onIncrement(item.producto.id)}
            onDecrement={() => onDecrement(item.producto.id)}
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
            aria-label={`Quitar ${item.producto.nombre}`}
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
