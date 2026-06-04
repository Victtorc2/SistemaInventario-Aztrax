/**
 * Tipos del dominio de autenticación.
 *
 * Reflejan los contratos del backend FastAPI:
 *  - POST /auth/login  -> { access_token, token_type }
 *  - GET  /auth/me     -> { id, nombre, correo }
 */

/** Credenciales que envía el formulario de login. */
export interface LoginCredentials {
  correo: string;
  password: string;
}

/** Respuesta del endpoint de login. */
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

/** Usuario autenticado (respuesta de /auth/me). */
export interface User {
  id: number;
  nombre: string;
  correo: string;
}

/** Forma del contexto global de autenticación. */
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** true mientras se verifica la sesión inicial o se procesa el login. */
  loading: boolean;
  /** Inicia sesión; lanza un Error con mensaje legible si falla. */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Cierra sesión: limpia token, contexto y redirige fuera. */
  logout: () => void;
  /** Verifica la sesión actual contra el backend. */
  checkAuth: () => Promise<void>;
}
