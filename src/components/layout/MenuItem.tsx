/**
 * MenuItem: un enlace del menú lateral.
 *
 * Resalta el estado activo (vía NavLink) y muestra icono + etiqueta.
 * Al hacer clic en móvil, cierra el sidebar (callback opcional `onNavigate`).
 */

import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface MenuItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  onNavigate?: () => void;
}

export function MenuItem({ to, label, icon: Icon, onNavigate }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent text-white"
            : "text-ink-soft hover:bg-line/60 hover:text-ink",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={2}
            className={isActive ? "text-white" : "text-ink-faint group-hover:text-ink"}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}
