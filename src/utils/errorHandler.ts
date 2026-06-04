/**
 * Manejador centralizado de errores de Axios.
 *
 * Convierte cualquier error (Axios, Error, otro) en un mensaje legible en
 * español. Da prioridad al `detail` que envía el backend FastAPI, y mapea
 * códigos HTTP comunes (401/403/404/422/5xx) a textos claros.
 *
 * Los servicios usan `resolveAxiosError` para no repetir la misma lógica en
 * cada función; los componentes usan `getErrorMessage` cuando reciben un
 * error genérico desde `catch`.
 */

import { AxiosError } from "axios";

/** Texto base por código HTTP. */
const STATUS_MESSAGES: Record<number, string> = {
  400: "Solicitud inválida",
  401: "Sesión expirada",
  403: "No tienes permiso para realizar esta acción",
  404: "Recurso no encontrado",
  409: "Conflicto con el estado actual",
  422: "Datos inválidos",
  500: "Error interno del servidor",
  502: "El servidor no responde",
  503: "Servicio no disponible",
};

/**
 * Resuelve un error de Axios a un mensaje legible.
 * @param error  error capturado en un catch
 * @param fallback texto a usar si no se puede inferir nada útil
 */
export function resolveAxiosError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    // 1) Prioridad al `detail` del backend.
    const detail = (error.response?.data as { detail?: string })?.detail;
    if (detail) return detail;

    // 2) Sin respuesta -> red caída.
    if (!error.response) return "No se pudo conectar con el servidor";

    // 3) Mapeo por código.
    const byStatus = STATUS_MESSAGES[error.response.status];
    if (byStatus) return byStatus;

    // 4) >=500 genérico.
    if (error.response.status >= 500) return "Error del servidor";
  }
  return fallback;
}

/** Extrae el mensaje de cualquier error capturado. */
export function getErrorMessage(error: unknown, fallback = "Ocurrió un error"): string {
  if (error instanceof AxiosError) return resolveAxiosError(error, fallback);
  if (error instanceof Error) return error.message;
  return fallback;
}
