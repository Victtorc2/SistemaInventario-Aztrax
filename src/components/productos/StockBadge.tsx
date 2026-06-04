/**
 * StockBadge: indicador visual del estado de stock de un producto.
 *
 *   - disponible  -> verde
 *   - bajo_stock  -> amarillo/ámbar
 *   - agotado     -> rojo
 *
 * Reutilizable tanto en el módulo de Productos como en Productos por pedir
 * (allí cumple el rol de "EstadoBadge"). Diseño discreto: badge pequeño con
 * bordes suaves, sin colores estridentes.
 */

import type { EstadoProducto } from "@/types/producto";

interface StockBadgeProps {
  estado: EstadoProducto;
}

const CONFIG: Record<EstadoProducto, { label: string; className: string }> = {
  disponible: {
    label: "Disponible",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  bajo_stock: {
    label: "Bajo stock",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  agotado: {
    label: "Agotado",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

export function StockBadge({ estado }: StockBadgeProps) {
  const { label, className } = CONFIG[estado] ?? CONFIG.disponible;
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
