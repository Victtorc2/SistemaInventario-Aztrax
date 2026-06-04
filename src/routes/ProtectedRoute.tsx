/**
 * ProtectedRoute: guard de rutas privadas.
 *
 * - Mientras se verifica la sesión inicial (`loading`), muestra un loader a
 *   pantalla completa (evita parpadeos / redirecciones prematuras).
 * - Si no hay sesión, redirige a /login conservando la ruta de origen en el
 *   state, para poder volver tras autenticarse.
 * - Si hay sesión, renderiza las rutas hijas (<Outlet />).
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/Loader";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper text-ink-faint">
        <Loader size={22} label="Verificando sesión…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
