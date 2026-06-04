/**
 * Utilidades de formato.
 */

/**
 * Formatea un importe como moneda peruana: S/ 25.50.
 * Acepta string o number (el backend puede serializar Decimal como string).
 */
export function formatMoney(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "S/ 0.00";
  return `S/ ${n.toFixed(2)}`;
}

/** Formatea una fecha ISO a algo legible (26 may 2026). */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
