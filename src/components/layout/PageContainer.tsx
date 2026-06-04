/**
 * PageContainer: envoltorio estándar del contenido de cada página.
 *
 * Da el ancho máximo, el espaciado y un encabezado consistente (título a la
 * izquierda, acciones a la derecha) reutilizable en todos los módulos.
 */

import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  /** Acciones alineadas a la derecha del encabezado (botones, buscador...). */
  actions?: ReactNode;
  children: ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  actions,
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-6xl animate-fade-up">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-ink-faint">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
