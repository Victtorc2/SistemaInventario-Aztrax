/**
 * LogoutButton: botón reutilizable para cerrar sesión.
 *
 * Llama a `logout` del contexto (limpia token y estado) y redirige a /login.
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={[
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
        "text-ink-soft transition-colors hover:bg-line/60 hover:text-ink",
        className,
      ].join(" ")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Cerrar sesión
    </button>
  );
}
