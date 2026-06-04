/**
 * BoletaModal: muestra la boleta de una venta con opciones de imprimir/descargar.
 *
 * Se abre desde el historial (reimprimir) o desde el detalle de venta. Carga
 * el detalle completo (si no se le pasa ya), renderiza BoletaPreview dentro de
 * un contenedor referenciado para impresión, y muestra BoletaActions.
 *
 * Reutilizable: tanto "Ver boleta" como "Reimprimir" usan este mismo modal
 * (no se duplica lógica).
 */

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Loader } from "@/components/ui/Loader";
import { BoletaPreview } from "@/components/historial/BoletaPreview";
import { BoletaActions } from "@/components/historial/BoletaActions";
import { useToast } from "@/context/ToastContext";
import * as historialService from "@/services/historialService";
import type { Venta } from "@/types/venta";

interface BoletaModalProps {
  open: boolean;
  /** Id de la venta cuya boleta se muestra. */
  ventaId: number | null;
  /** Detalle ya cargado (opcional); si falta, se carga por ventaId. */
  ventaPrecargada?: Venta | null;
  onClose: () => void;
}

export function BoletaModal({
  open,
  ventaId,
  ventaPrecargada,
  onClose,
}: BoletaModalProps) {
  const toast = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [venta, setVenta] = useState<Venta | null>(ventaPrecargada ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || ventaId == null) return;
    // Si ya tenemos el detalle precargado para esa venta, lo usamos.
    if (ventaPrecargada && ventaPrecargada.id === ventaId) {
      setVenta(ventaPrecargada);
      return;
    }
    let active = true;
    setLoading(true);
    historialService
      .getDetalleVenta(ventaId)
      .then((data) => {
        if (active) setVenta(data);
      })
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "No se pudo cargar la boleta");
        onClose();
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, ventaId, ventaPrecargada, toast, onClose]);

  return (
    <Modal open={open} title="Boleta" onClose={onClose} widthClassName="max-w-md">
      {loading || !venta ? (
        <div className="flex justify-center py-12 text-ink-faint">
          <Loader size={22} label="Cargando boleta…" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Vista previa del ticket dentro de un marco suave */}
          <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-line bg-paper/50 py-2">
            <BoletaPreview ref={printRef} venta={venta} />
          </div>

          <BoletaActions
            ventaId={venta.id}
            numeroBoleta={venta.numero_boleta}
            printRef={printRef}
            onClose={onClose}
          />
        </div>
      )}
    </Modal>
  );
}
