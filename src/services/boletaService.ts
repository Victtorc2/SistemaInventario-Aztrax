/**
 * Servicio de boleta.
 *
 * Descarga el PDF generado por el backend (GET /ventas/{id}/boleta) como
 * binario (responseType blob) y dispara la descarga en el navegador con el
 * nombre boleta_<numero>.pdf.
 */

import { AxiosError } from "axios";
import { axiosClient } from "@/api/axiosClient";

/** Obtiene el PDF de la boleta como Blob. */
export async function getBoletaBlob(ventaId: number): Promise<Blob> {
  try {
    const { data } = await axiosClient.get(`/ventas/${ventaId}/boleta`, {
      responseType: "blob",
    });
    return data as Blob;
  } catch (error) {
    throw new Error(resolveError(error));
  }
}

/**
 * Descarga la boleta de una venta como archivo PDF.
 * @param ventaId id de la venta
 * @param numeroBoleta para nombrar el archivo (boleta_B001-000001.pdf)
 */
export async function downloadBoleta(
  ventaId: number,
  numeroBoleta: string,
): Promise<void> {
  const blob = await getBoletaBlob(ventaId);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `boleta_${numeroBoleta}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function resolveError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) return "Boleta no disponible";
    if (!error.response) return "No se pudo conectar con el servidor";
  }
  return "No se pudo descargar la boleta";
}
