/**
 * ExportButton: botón de exportación con menú desplegable.
 *
 * Estructura preparada para PDF, Excel y CSV. La exportación CSV se implementa
 * de forma funcional (genera el archivo en el navegador a partir de los datos
 * recibidos); PDF y Excel quedan como interfaz lista para conectar más
 * adelante (muestran un aviso vía `onUnavailable`).
 *
 * Se mantiene reutilizable: recibe los datos y el nombre de archivo.
 */

import { useEffect, useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet, FileDown } from "lucide-react";

export type ExportFormat = "pdf" | "excel" | "csv";

interface ExportButtonProps {
  /** Filas a exportar (clave -> valor). */
  rows: Record<string, string | number>[];
  /** Cabeceras en orden; si se omite, se toman las claves de la primera fila. */
  headers?: string[];
  filename?: string;
  /** Aviso cuando un formato aún no está disponible (PDF/Excel). */
  onUnavailable?: (format: ExportFormat) => void;
  disabled?: boolean;
}

export function ExportButton({
  rows,
  headers,
  filename = "export",
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

  /** Exporta a CSV (funcional, en cliente). */
  const exportCsv = () => {
    const cols = headers ?? (rows[0] ? Object.keys(rows[0]) : []);
    const escape = (v: string | number) => {
      const s = String(v ?? "");
      // Entrecomillar si hay comas, comillas o saltos de línea.
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      cols.join(","),
      ...rows.map((r) => cols.map((c) => escape(r[c])).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelect = (format: ExportFormat) => {
    setOpen(false);
    if (format === "csv") {
      exportCsv();
    } else {
      // PDF / Excel: interfaz lista, implementación futura.
      onUnavailable?.(format);
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
