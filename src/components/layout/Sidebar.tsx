/**
 * Sidebar: navegación lateral fija.
 *
 * - Escritorio: fijo a la izquierda, siempre visible.
 * - Móvil: se muestra como panel deslizante con overlay; `open` y `onClose`
 *   controlan su visibilidad desde el MainLayout.
 * El menú hace scroll si crece, y el footer muestra el usuario actual y el
 * botón de cerrar sesión.
 */

import { Boxes } from "lucide-react";
import { NAV_ITEMS } from "@/utils/navigation";
import { MenuItem } from "@/components/layout/MenuItem";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const initial = user?.nombre?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      {/* Overlay para móvil */}
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-ink/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-white",
          "transition-transform duration-300 ease-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
            <Boxes size={19} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight tracking-tight">
              Sistema Inventario
            </p>
            <p className="text-xs text-ink-faint">Administración</p>
          </div>
        </div>

        {/* Menú (scroll si crece) */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <MenuItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* Footer: usuario + logout */}
        <div className="border-t border-line p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-none">
                {user?.nombre ?? "Usuario"}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-faint">
                {user?.correo ?? ""}
              </p>
            </div>
          </div>
          <LogoutButton className="w-full justify-start" />
        </div>
      </aside>
    </>
  );
}
