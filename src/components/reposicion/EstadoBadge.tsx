/**
 * EstadoBadge: badge de estado para la lista de reposición.
 *
 * En reposición solo aparecen "agotado" y "bajo_stock". Reutiliza el mismo
 * StockBadge del módulo de productos para mantener una sola fuente de estilos.
 */

import { StockBadge } from "@/components/productos/StockBadge";

interface EstadoBadgeProps {
  estado: "agotado" | "bajo_stock";
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  return <StockBadge estado={estado} />;
}
