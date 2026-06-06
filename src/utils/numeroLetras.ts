/**
 * Conversión de un importe a su representación en letras (español).
 *
 * Se usa en la vista previa de la boleta para la línea "SON: ... SOLES",
 * habitual en los comprobantes peruanos. Refleja el mismo formato que genera
 * el backend en el PDF. Soporta importes hasta 999 999 999.99.
 */

const UNIDADES = [
  "", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO",
  "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS",
  "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE",
];
const DECENAS = [
  "", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA",
  "SETENTA", "OCHENTA", "NOVENTA",
];
const CENTENAS = [
  "", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS",
  "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS",
];

/** Convierte un número de 0 a 999 a letras. */
function centenaALetras(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "CIEN";
  const centena = Math.floor(n / 100);
  const resto = n % 100;
  const palabras = centena ? CENTENAS[centena] : "";
  let unidad: string;
  if (resto <= 20) {
    unidad = UNIDADES[resto];
  } else if (resto >= 21 && resto <= 29) {
    unidad = "VEINTI" + UNIDADES[resto - 20];
  } else {
    const decena = Math.floor(resto / 10);
    const u = resto % 10;
    unidad = DECENAS[decena] + (u ? ` Y ${UNIDADES[u]}` : "");
  }
  return `${palabras} ${unidad}`.trim();
}

/** Convierte un entero (0 - 999 999 999) a letras. */
function enteroALetras(n: number): string {
  if (n === 0) return "CERO";
  const millones = Math.floor(n / 1_000_000);
  const resto = n % 1_000_000;
  const miles = Math.floor(resto / 1_000);
  const centenas = resto % 1_000;

  const partes: string[] = [];
  if (millones) {
    partes.push(millones === 1 ? "UN MILLON" : `${centenaALetras(millones)} MILLONES`);
  }
  if (miles) {
    partes.push(miles === 1 ? "MIL" : `${centenaALetras(miles)} MIL`);
  }
  if (centenas) {
    partes.push(centenaALetras(centenas));
  }
  return partes.filter(Boolean).join(" ").trim();
}

/**
 * Devuelve el importe en letras con el formato típico de la boleta peruana.
 * Ejemplo: 1250.5 -> "MIL DOSCIENTOS CINCUENTA CON 50/100 SOLES".
 */
export function montoEnLetras(valor: number, moneda = "SOLES"): string {
  const seguro = Number.isFinite(valor) ? valor : 0;
  const entero = Math.floor(seguro);
  const centimos = Math.round((seguro - entero) * 100);
  const letras = enteroALetras(entero);
  return `${letras} CON ${String(centimos).padStart(2, "0")}/100 ${moneda}`;
}
