/**
 * Utilidades de manejo del token JWT.
 *
 * Centraliza el acceso al almacenamiento (localStorage) para que el resto de
 * la app no toque `localStorage` directamente. Si en el futuro se cambia a
 * sessionStorage o cookies, solo se edita este archivo.
 */

const TOKEN_KEY = "inventario.access_token";

/** Guarda el access token. */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Devuelve el access token almacenado, o null si no hay. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Elimina el access token (usado al cerrar sesión o ante 401). */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
