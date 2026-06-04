/**
 * EmptyCart: estado mostrado cuando el carrito no tiene productos.
 * Variante compacta (sin tarjeta), porque vive dentro del TotalCard.
 */

import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-line/60 text-ink-faint">
        <ShoppingCart size={22} />
      </div>
      <p className="text-sm font-medium text-ink-soft">Carrito vacío</p>
      <p className="mt-1 text-xs text-ink-faint">
        Busca y agrega productos para iniciar la venta.
      </p>
    </div>
  );
}
