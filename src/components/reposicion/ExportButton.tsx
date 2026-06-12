/**
 * ExportButton: botón de exportación con menú desplegable.
 *
 * Soporta PDF, Excel y CSV de forma funcional (todo en el navegador, sin
 * dependencias externas) reutilizando las utilidades de `utils/exportTable`:
 *   - CSV / Excel (.xls): descargan un archivo a partir de las filas.
 *   - PDF: abre el diálogo de impresión para "Guardar como PDF".
 *
 * Se mantiene reutilizable: recibe los datos, el nombre de archivo y un título
 * opcional para el encabezado del PDF.
 */

import { useEffect, useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import {
  exportCsv,
  exportExcel,
  exportPdf,
  type ExportRow,
} from "@/utils/exportTable";

export type ExportFormat = "pdf" | "excel" | "csv";

interface ExportButtonProps {
  /** Filas a exportar (clave -> valor). */
  rows: ExportRow[];
  /** Cabeceras en orden; si se omite, se toman las claves de la primera fila. */
  headers?: string[];
  filename?: string;
  /** Título para el encabezado del PDF (por defecto, el filename). */
  title?: string;
  /** Aviso cuando un formato no se puede generar (p. ej. popup bloqueado). */
  onUnavailable?: (format: ExportFormat) => void;
  disabled?: boolean;
}

export function ExportButton({
  rows,
  headers,
  filename = "export",
  title,
  onUnavailable,
  disabled = false,
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSelect = (format: ExportFormat) => {
    setOpen(false);
    if (format === "csv") {
      exportCsv(rows, filename, headers);
    } else if (format === "excel") {
      exportExcel(rows, filename, headers);
    } else {
      const ok = exportPdf(rows, filename, { title: title ?? filename, headers });
      if (!ok) onUnavailable?.(format);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-line/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={16} />
        Exportar
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-card">
          <ExportItem icon={<FileText size={15} />} label="PDF" onClick={() => handleSelect("pdf")} />
          <ExportItem icon={<FileSpreadsheet size={15} />} label="Excel" onClick={() => handleSelect("excel")} />
          <ExportItem icon={<FileDown size={15} />} label="CSV" onClick={() => handleSelect("csv")} />
        </div>
      ) : null}
    </div>
  );
}

function ExportItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-line/60 hover:text-ink"
    >
      {icon}
      {label}
    </button>
  );
}
