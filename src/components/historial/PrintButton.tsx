/**
 * PrintButton: abre el diálogo de impresión del navegador con la boleta.
 *
 * Usa react-to-print apuntando a una ref del nodo de la boleta (BoletaPreview).
 * La ref se pasa desde el contenedor (BoletaModal), que es quien tiene acceso
 * al nodo a imprimir.
 */

import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import type { RefObject } from "react";

interface PrintButtonProps {
  /** Ref al nodo que se va a imprimir (la boleta). */
  contentRef: RefObject<HTMLDivElement | null>;
  documentTitle?: string;
}

export function PrintButton({ contentRef, documentTitle }: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: documentTitle ?? "boleta",
  });

  return (
    <button
      type="button"
      onClick={() => handlePrint()}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-line/60 hover:text-ink"
    >
      <Printer size={16} />
      Imprimir
    </button>
  );
}
