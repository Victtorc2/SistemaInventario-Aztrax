/**
 * AuthLayout: contenedor de las pantallas de autenticación.
 *
 * Centra el contenido vertical y horizontalmente sobre un fondo claro con un
 * patrón de puntos sutil para dar atmósfera sin recargar (estilo dashboard
 * moderno). El contenido (la card) se pasa como children.
 */

import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4">
      {/* Fondo de puntos + un velo radial para enfocar el centro. */}
      <div className="pointer-events-none absolute inset-0 bg-dotgrid" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, transparent, rgba(246,247,249,0.9))",
        }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[380px]">{children}</div>
    </main>
  );
}
