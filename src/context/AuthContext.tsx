/**
 * Contexto global de autenticación.
 *
 * Mantiene `user`, `token`, `isAuthenticated` y `loading`, y expone
 * `login`, `logout` y `checkAuth`. Al montar:
 *   1. Si hay token guardado, llama a /auth/me para validarlo.
 *   2. Si es válido, guarda el usuario; si no, cierra sesión.
 * También escucha el evento global de 401 para cerrar sesión automáticamente
 * cuando el token expira durante el uso de la app.
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UNAUTHORIZED_EVENT } from "@/api/axiosClient";
import * as authService from "@/services/authService";
import { getToken, removeToken, setToken } from "@/utils/auth";
import type { AuthContextValue, LoginCredentials, User } from "@/types/auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getToken());
  // Empieza en true: hasta verificar la sesión inicial no sabemos el estado.
  const [loading, setLoading] = useState<boolean>(true);

  /** Limpia toda la sesión (memoria + almacenamiento). */
  const clearSession = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  /**
   * Verifica la sesión actual contra el backend.
   * Si no hay token o el token es inválido, deja la sesión cerrada.
   */
  const checkAuth = useCallback(async () => {
    const stored = getToken();
    if (!stored) {
      clearSession();
      setLoading(false);
      return;
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setTokenState(stored);
    } catch {
      // Token inválido o expirado: cerramos sesión silenciosamente.
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  /** Inicia sesión: guarda token y carga el perfil. */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const { access_token } = await authService.login(credentials);
      setToken(access_token);
      setTokenState(access_token);
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      // Si algo falla, no dejamos un token a medias.
      removeToken();
      setTokenState(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Cierra sesión manualmente. */
  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  // Verificación de sesión al montar la app.
  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  // Logout automático cuando el interceptor detecta un 401.
  useEffect(() => {
    const handler = () => clearSession();
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loading,
      login,
      logout,
      checkAuth,
    }),
    [user, token, loading, login, logout, checkAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
