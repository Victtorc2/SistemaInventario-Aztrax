/**
 * ResumenVenta: desglose numérico de la venta.
 *
 * Muestra cantidad de productos, subtotal, descuento y total final. El total
 * se destaca tipográficamente. Recibe los totales ya calculados (del useCart).
 */

import { formatMoney } from "@/utils/format";
import type { CartTotals } from "@/types/cart";

interface ResumenVentaProps {
  totals: CartTotals;
}

export function ResumenVenta({ totals }: ResumenVentaProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <Row label={`Productos (${totals.unidades})`} value={String(totals.lineas)} muted />
      <Row label="Subtotal" value={formatMoney(totals.subtotal)} />
      <Row
        label="Descuento"
        value={totals.descuento > 0 ? `- ${formatMoney(totals.descuento)}` : formatMoney(0)}
        accent={totals.descuento > 0}
      />
      <div className="my-1 border-t border-dashed border-line" />
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink-soft">Total</span>
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
          {formatMoney(totals.total)}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-faint">{label}</span>
      <span
        className={[
          "tabular-nums",
          accent ? "text-emerald-600" : muted ? "text-ink-faint" : "text-ink-soft",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
