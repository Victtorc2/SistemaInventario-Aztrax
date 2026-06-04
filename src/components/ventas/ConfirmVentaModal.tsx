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
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmVentaModal({
  open,
  totals,
  metodoPago,
  submitting,
  onConfirm,
  onClose,
}: ConfirmVentaModalProps) {
  const metodoLabel = metodoPago === "yape" ? "Yape" : "Efectivo";
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

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
          Volver
        </Button>
        <Button type="button" onClick={onConfirm} loading={submitting}>
          Confirmar venta
        </Button>
      </div>
    </Modal>
  );
}
