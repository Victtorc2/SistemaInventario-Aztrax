/**
 * ConfirmVentaModal: confirmación final antes de registrar la venta.
 *
 * Muestra un resumen breve (unidades y total) para que el usuario confirme
 * conscientemente. El botón principal queda en estado loading durante el POST.
 */

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/utils/format";
import type { CartTotals, MetodoPago } from "@/types/cart";

interface ConfirmVentaModalProps {
  open: boolean;
  totals: CartTotals;
  metodoPago: MetodoPago;
  submitting: boolean;
  fecha: string;
  onFechaChange: (fecha: string) => void;
  onConfirm: (fecha: string) => void;
  onClose: () => void;
}

export function ConfirmVentaModal({
  open,
  totals,
  metodoPago,
  submitting,
  fecha,
  onFechaChange,
  onConfirm,
  onClose,
}: ConfirmVentaModalProps) {
  const metodoLabel = metodoPago === "yape" ? "Yape" : "Efectivo";
  const hoy = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const limite = new Date(`${hoy}T12:00:00Z`);
  limite.setUTCDate(limite.getUTCDate() - 4);
  const minima = limite.toISOString().slice(0, 10);
  const fechaInvalida = !!fecha && (fecha < minima || fecha > hoy);
  return (
    <Modal
      open={open}
      title="¿Confirmar venta?"
      onClose={onClose}
      closeOnOverlay={!submitting}
    >
      <p className="text-sm text-ink-soft">
        Se registrará la venta de{" "}
        <span className="font-medium text-ink">{totals.unidades}</span>{" "}
        {totals.unidades === 1 ? "unidad" : "unidades"} por un total de{" "}
        <span className="font-medium text-ink">{formatMoney(totals.total)}</span>.
      </p>

      <div className="mt-3 rounded-xl border border-line bg-paper/60 px-4 py-3 text-sm">
        <div className="flex justify-between text-ink-faint">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatMoney(totals.subtotal)}</span>
        </div>
        {totals.descuento > 0 ? (
          <div className="flex justify-between text-emerald-600">
            <span>Descuento</span>
            <span className="tabular-nums">- {formatMoney(totals.descuento)}</span>
          </div>
        ) : null}
        <div className="mt-1 flex justify-between font-semibold text-ink">
          <span>Total</span>
          <span className="tabular-nums">{formatMoney(totals.total)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-line pt-2 text-ink-soft">
          <span>Forma de pago</span>
          <span className="font-medium text-ink">{metodoLabel}</span>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="fecha-boleta" className="block text-sm font-medium text-ink">
          Fecha de la boleta
        </label>
        <input
          id="fecha-boleta"
          type="date"
          value={fecha || hoy}
          min={minima}
          max={hoy}
          disabled={submitting}
          onChange={(event) => onFechaChange(event.target.value)}
          aria-describedby="fecha-boleta-ayuda"
          aria-invalid={fechaInvalida}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
        />
        <p id="fecha-boleta-ayuda" className="mt-1 text-xs text-ink-soft">
          Puedes elegir hoy o hasta 4 días anteriores, según la fecha de Perú.
        </p>
        {fechaInvalida && <p role="alert" className="mt-1 text-sm text-red-600">Elige una fecha dentro del plazo permitido.</p>}
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
          Volver
        </Button>
        <Button type="button" onClick={() => onConfirm(fecha || hoy)} loading={submitting} disabled={fechaInvalida}>
          Confirmar venta
        </Button>
      </div>
    </Modal>
  );
}
