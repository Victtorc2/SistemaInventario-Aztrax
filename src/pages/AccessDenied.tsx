/**
 * AccessDenied: pantalla mostrada cuando se intenta acceder a un recurso
 * sin permiso. Ofrece volver al inicio de sesión.
 */

import { Link } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";

export function AccessDenied() {
  return (
    <AuthLayout>
      <div className="animate-fade-up rounded-xl2 border border-line bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 9v4m0 4h.01M10.3 3.86l-8.5 14.7A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.44l-8.5-14.7a2 2 0 0 0-3.4 0z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">Acceso denegado</h1>
        <p className="mt-1 text-sm text-ink-faint">
          No tienes permiso para ver esta página.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </AuthLayout>
  );
}
