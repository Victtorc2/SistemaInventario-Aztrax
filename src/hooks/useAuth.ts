/**
 * Hook de acceso al contexto de autenticación.
 *
 * Lanza un error claro si se usa fuera del AuthProvider, lo que ayuda a
 * detectar errores de integración temprano.
 */

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { AuthContextValue } from "@/types/auth";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
}
