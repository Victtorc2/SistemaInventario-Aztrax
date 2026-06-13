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
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent text-white shadow-[0_8px_20px_-8px_rgba(124,108,255,0.8)]"
            : "text-slate-300 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={2}
            className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}
