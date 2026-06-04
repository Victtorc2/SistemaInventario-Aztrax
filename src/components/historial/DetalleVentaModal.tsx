/**
 * DetalleVentaModal: detalle completo de una venta.
 *
 * Muestra la cabecera (boleta, fecha), la tabla de productos vendidos
 * (cantidad, precio unitario, subtotal) y los totales. Permite saltar a ver
 * la boleta. Carga el detalle por id al abrirse.
 */

import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { formatMoney, formatDate } from "@/utils/format";
import { useToast } from "@/context/ToastContext";
import * as historialService from "@/services/historialService";
import type { Venta } from "@/types/venta";

interface DetalleVentaModalProps {
  open: boolean;
  ventaId: number | null;
  onClose: () => void;
  /** Abre la boleta de esta venta (pasa el detalle ya cargado). */
  onVerBoleta: (venta: Venta) => void;
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function DetalleVentaModal({
  open,
  ventaId,
  onClose,
  onVerBoleta,
}: DetalleVentaModalProps) {
  const toast = useToast();
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || ventaId == null) return;
    let active = true;
    setLoading(true);
    historialService
      .getDetalleVenta(ventaId)
      .then((data) => active && setVenta(data))
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "No se pudo cargar el detalle");
        onClose();
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [open, ventaId, toast, onClose]);

  const descuento = venta ? toNum(venta.descuento) : 0;

  return (
    <Modal
      open={open}
      title="Detalle de venta"
      onClose={onClose}
      widthClassName="max-w-lg"
    >
      {loading || !venta ? (
        <div className="flex justify-center py-12 text-ink-faint">
          <Loader size={22} label="Cargando detalle…" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Cabecera */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-paper/50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
                <Receipt size={17} />
              </div>
              <div>
                <p className="font-mono text-sm font-semibold">
                  {venta.numero_boleta}
                </p>
                <p className="text-xs text-ink-faint">{formatDate(venta.fecha)}</p>
              </div>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper/40 text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-3 py-2 font-medium">Producto</th>
                  <th className="px-3 py-2 text-center font-medium">Cant.</th>
                  <th className="px-3 py-2 text-right font-medium">P. unit.</th>
                  <th className="px-3 py-2 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.detalles.map((d) => (
                  <tr key={d.id} className="border-b border-line/60 last:border-0">
                    <td className="px-3 py-2">
                      <p className="font-medium text-ink">{d.producto}</p>
                      <p className="text-xs text-ink-faint">{d.marca}</p>
                    </td>
                    <td className="px-3 py-2 text-center tabular-nums">
                      {d.cantidad}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-ink-soft">
                      {formatMoney(toNum(d.precio))}
                    </td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">
                      {formatMoney(toNum(d.subtotal))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="ml-auto w-full max-w-[220px] space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-faint">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatMoney(toNum(venta.subtotal))}</span>
            </div>
            {descuento > 0 ? (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento</span>
                <span className="tabular-nums">- {formatMoney(descuento)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-line pt-1.5 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatMoney(toNum(venta.total))}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={() => onVerBoleta(venta)}>Ver boleta</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
