/**
 * LoginPage: pantalla de inicio de sesión.
 *
 * Card minimalista centrada (vía AuthLayout) con el wordmark del sistema,
 * subtítulo y el formulario de login. Animación sutil de entrada.
 */

import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPage() {
  return (
    <AuthLayout>
      <div className="animate-fade-up rounded-xl2 border border-line bg-white p-8 shadow-card">
        {/* Marca / nombre del sistema */}
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4M21 7v10l-9 4M12 11v10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">
            Sistema Inventario
          </h1>
          <p className="mt-1 text-sm text-ink-faint">Iniciar sesión</p>
        </div>

        <LoginForm />
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">
        Acceso restringido · Panel de administración
      </p>
    </AuthLayout>
  );
}
