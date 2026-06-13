/**
 * AccessDenied: pantalla mostrada cuando se intenta acceder a un recurso
 * sin permiso. Ofrece volver al inicio de sesión.
 */

import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";

export function AccessDenied() {
  return (
    <AuthLayout>
      <div className="animate-fade-up rounded-xl2 border border-line bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
          <ShieldAlert size={22} />
        </div>
        <h1 className="text-lg font-semibold tracking-tight">Acceso denegado</h1>
        <p className="mt-1 text-sm text-ink-faint">
          No tienes permiso para ver esta página.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </AuthLayout>
  );
}
