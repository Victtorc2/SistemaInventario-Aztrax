/**
 * LogoutButton: botón reutilizable para cerrar sesión.
 *
 * Llama a `logout` del contexto (limpia token y estado) y redirige a /login.
 */

import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LogoutButtonProps {
  className?: string;
  /** "light" (por defecto) o "dark" para el sidebar oscuro. */
  tone?: "light" | "dark";
}

export function LogoutButton({ className = "", tone = "light" }: LogoutButtonProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toneCls =
    tone === "dark"
      ? "text-slate-300 hover:bg-white/10 hover:text-white"
      : "text-ink-soft hover:bg-line/60 hover:text-ink";

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={[
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
        toneCls,
        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        className,
      ].join(" ")}
    >
      <LogOut size={16} />
      Cerrar sesión
    </button>
  );
}
