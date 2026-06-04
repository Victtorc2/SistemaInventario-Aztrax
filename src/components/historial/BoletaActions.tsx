/**
 * BoletaActions: barra de acciones de la boleta (descargar, imprimir, cerrar).
 */

import type { RefObject } from "react";
import { DownloadButton } from "@/components/historial/DownloadButton";
import { PrintButton } from "@/components/historial/PrintButton";
import { Button } from "@/components/ui/Button";

interface BoletaActionsProps {
  ventaId: number;
  numeroBoleta: string;
  printRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function BoletaActions({
  ventaId,
  numeroBoleta,
  printRef,
  onClose,
}: BoletaActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="ghost" onClick={onClose}>
        Cerrar
      </Button>
      <PrintButton contentRef={printRef} documentTitle={`boleta_${numeroBoleta}`} />
      <DownloadButton ventaId={ventaId} numeroBoleta={numeroBoleta} />
    </div>
  );
}
