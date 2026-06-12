/**
 * Utilidades de exportación de tablas (sin dependencias externas).
 *
 * Las filas se representan como objetos clave -> valor; las cabeceras se
 * derivan de las claves (o se pasan explícitamente para fijar el orden).
 *
 *   - CSV:   archivo de texto separado por comas (compatible con Excel).
 *   - Excel: archivo .xls con una tabla HTML; Excel lo abre con formato.
 *   - PDF:   abre una ventana de impresión con la tabla estilada; el usuario
 *            elige "Guardar como PDF" desde el diálogo del navegador.
 */

export type ExportRow = Record<string, string | number | null | undefined>;

/** Resuelve las columnas a exportar (cabeceras explícitas o claves). */
function resolveCols(rows: ExportRow[], headers?: string[]): string[] {
  return headers ?? (rows[0] ? Object.keys(rows[0]) : []);
}

/** Escapa un valor para HTML (evita romper la tabla con < > &). */
function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Descarga un Blob como archivo. */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Exporta las filas a CSV (con BOM para que Excel respete los acentos). */
export function exportCsv(
  rows: ExportRow[],
  filename: string,
  headers?: string[],
): void {
  const cols = resolveCols(rows, headers);
  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [
    cols.join(","),
    ...rows.map((r) => cols.map((c) => escape(r[c])).join(",")),
  ];
  const blob = new Blob(["﻿" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, `${filename}.csv`);
}

/** Construye el cuerpo de una tabla HTML a partir de las filas. */
function buildTableHtml(rows: ExportRow[], cols: string[]): string {
  const thead = `<tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
  const tbody = rows
    .map(
      (r) =>
        `<tr>${cols.map((c) => `<td>${escapeHtml(r[c])}</td>`).join("")}</tr>`,
    )
    .join("");
  return `<thead>${thead}</thead><tbody>${tbody}</tbody>`;
}

/**
 * Exporta las filas a Excel (.xls). Genera una hoja con una tabla HTML, que
 * Excel interpreta nativamente conservando columnas y formato básico.
 */
export function exportExcel(
  rows: ExportRow[],
  filename: string,
  headers?: string[],
): void {
  const cols = resolveCols(rows, headers);
  const table = `<table border="1">${buildTableHtml(rows, cols)}</table>`;
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" ` +
    `xmlns:x="urn:schemas-microsoft-com:office:excel" ` +
    `xmlns="http://www.w3.org/TR/REC-html40">` +
    `<head><meta charset="UTF-8" /></head><body>${table}</body></html>`;
  const blob = new Blob(["﻿" + html], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  downloadBlob(blob, `${filename}.xls`);
}

/**
 * Exporta las filas a PDF mediante el diálogo de impresión del navegador.
 * Abre una ventana con la tabla estilada y lanza la impresión; el usuario
 * elige "Guardar como PDF" como destino.
 */
export function exportPdf(
  rows: ExportRow[],
  filename: string,
  options: { title?: string; headers?: string[] } = {},
): boolean {
  const cols = resolveCols(rows, options.headers);
  const title = options.title ?? filename;
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return false; // bloqueado por el navegador (popup)

  const styles = `
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; margin: 32px; }
    h1 { font-size: 18px; margin: 0 0 4px; }
    .meta { font-size: 12px; color: #6b7280; margin: 0 0 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f3f4f6; text-align: left; font-weight: 600; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 10px; }
    tbody tr:nth-child(even) { background: #fafafa; }
    @media print { body { margin: 0; } @page { margin: 16mm; } }
  `;
  const fecha = new Date().toLocaleString("es-PE");
  win.document.write(
    `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8" />` +
      `<title>${escapeHtml(title)}</title><style>${styles}</style></head>` +
      `<body><h1>${escapeHtml(title)}</h1>` +
      `<p class="meta">Generado el ${escapeHtml(fecha)} · ${rows.length} registro(s)</p>` +
      `<table>${buildTableHtml(rows, cols)}</table></body></html>`,
  );
  win.document.close();
  win.focus();
  // Esperar al render antes de imprimir.
  win.onload = () => {
    win.print();
  };
  // Respaldo por si onload no dispara (documento ya listo).
  setTimeout(() => {
    try {
      win.print();
    } catch {
      /* la ventana pudo cerrarse */
    }
  }, 400);
  return true;
}
