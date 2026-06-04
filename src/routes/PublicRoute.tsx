/**
 * PublicRoute: guard para rutas públicas (como /login).
 *
 * Si el usuario YA está autenticado, lo redirige automáticamente al
 * dashboard (no tiene sentido mostrarle el login). Mientras se verifica la
 * sesión, muestra un loader para evitar mostrar el login por un instante.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/Loader";

export function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-ink-faint">
        <Loader size={22} label="Cargando…" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/inicio" replace />;
  }

  return <Outlet />;
}
