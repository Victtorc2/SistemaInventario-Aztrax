/**
 * Navbar: barra superior.
 *
 * Muestra (de izquierda a derecha): botón de menú en móvil, el breadcrumb,
 * la fecha actual (oculta en pantallas pequeñas) y el nombre del usuario con
 * un botón de logout compacto.
 */

import { Menu, CalendarDays } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  onOpenSidebar: () => void;
}

export function Navbar({ onOpenSidebar }: NavbarProps) {
  const { user } = useAuth();

  // Fecha actual legible en español (p. ej. "lun, 26 may 2026").
  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-paper/80 px-4 backdrop-blur-md md:px-6">
      {/* Botón de menú (solo móvil) */}
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-line/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      <Breadcrumb />

      <div className="ml-auto flex items-center gap-4">
        <span className="hidden items-center gap-1.5 text-sm text-ink-faint lg:inline-flex">
          <CalendarDays size={14} />
          {today}
        </span>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">
            {user?.nombre ?? "Administrador"}
          </p>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
