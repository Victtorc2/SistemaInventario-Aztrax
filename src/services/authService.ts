/**
 * Servicio de autenticación.
 *
 * Encapsula las llamadas HTTP a los endpoints de auth y traduce los errores
 * del backend a mensajes legibles para la UI. Los componentes nunca llaman a
 * axios directamente: usan este servicio.
 */

import { AxiosError } from "axios";
import { axiosClient } from "@/api/axiosClient";
import type { LoginCredentials, TokenResponse, User } from "@/types/auth";

/**
 * Inicia sesión. Devuelve el token si las credenciales son válidas.
 * @throws Error con un mensaje legible si la autenticación falla.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<TokenResponse> {
  try {
    const { data } = await axiosClient.post<TokenResponse>(
      "/auth/login",
      credentials,
    );
    return data;
  } catch (error) {
    throw new Error(resolveAuthError(error));
  }
}

/**
 * Obtiene el perfil del usuario autenticado (GET /auth/me).
 * El token lo añade automáticamente el interceptor de Axios.
 */
export async function getProfile(): Promise<User> {
  const { data } = await axiosClient.get<User>("/auth/me");
  return data;
}

/**
 * Traduce un error de Axios a un mensaje en español apto para mostrar.
 *
 * - 401: credenciales incorrectas.
 * - Sin respuesta (red caída): error de conexión.
 * - 5xx: error del servidor.
 */
function resolveAuthError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) return "Credenciales incorrectas";
      if (status >= 500) return "Error del servidor. Intenta más tarde.";
      // El backend suele enviar { detail: "..." }.
      const detail = (error.response.data as { detail?: string })?.detail;
      if (detail) return detail;
    } else if (error.request) {
      return "No se pudo conectar con el servidor";
    }
  }
  return "Ocurrió un error inesperado";
}
