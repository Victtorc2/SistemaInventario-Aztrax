/**
 * LoginForm: formulario de inicio de sesión.
 *
 * Validación con React Hook Form + Zod:
 *   - correo: obligatorio y con formato válido.
 *   - password: obligatorio, mínimo 6 caracteres.
 * Al enviar, llama a `login` del contexto. Si falla, muestra el mensaje de
 * error devuelto por el servicio (credenciales incorrectas, error de red...).
 * En éxito, redirige a /inicio.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

// Esquema de validación. Los mensajes se muestran bajo cada input.
const loginSchema = z.object({
  correo: z
    .string()
    .min(1, "Correo requerido")
    .email("Ingresa un correo válido"),
  password: z
    .string()
    .min(1, "Contraseña requerida")
    .min(6, "Mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values);
      navigate("/inicio", { replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Error al iniciar sesión",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <InputField
        label="Correo"
        type="email"
        placeholder="admin@sistema.com"
        autoComplete="email"
        error={errors.correo?.message}
        {...register("correo")}
      />

      <InputField
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register("password")}
      />

      {/* Mensaje de error global (credenciales, servidor, red). */}
      {formError ? (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-sm text-danger"
        >
          {formError}
        </div>
      ) : null}

      <div className="flex items-center justify-end">
        <button
          type="button"
          className="rounded text-xs text-ink-faint transition-colors hover:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button type="submit" fullWidth loading={isSubmitting}>
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
