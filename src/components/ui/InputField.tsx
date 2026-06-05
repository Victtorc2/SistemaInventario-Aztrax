/**
 * InputField: campo de formulario con label y mensaje de error.
 *
 * Usa forwardRef para ser compatible con el `register` de React Hook Form.
 * Muestra el error debajo del input y aplica estilos de estado de error
 * (borde y anillo rojos). Admite un texto de ayuda (`hint`), marca de campo
 * requerido y un `rightSlot` (p. ej. un botón mostrar/ocultar contraseña).
 * El resto de props nativas de <input> se reenvían.
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Texto de ayuda mostrado bajo el campo cuando no hay error. */
  hint?: string;
  /** Contenido posicionado a la derecha dentro del input (icono/botón). */
  rightSlot?: ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    { label, error, hint, rightSlot, id, className = "", ...rest },
    ref,
  ) {
    const inputId = id ?? rest.name ?? label;
    const hasError = Boolean(error);
    const describedBy = hasError
      ? `${inputId}-error`
      : hint
        ? `${inputId}-hint`
        : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink-soft">
          {label}
          {rest.required ? <span className="ml-0.5 text-accent">*</span> : null}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={[
              "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink",
              "placeholder:text-ink-faint/70 transition-all duration-150",
              "focus:outline-none focus:shadow-focus",
              rightSlot ? "pr-10" : "",
              hasError
                ? "border-danger focus:border-danger"
                : "border-line focus:border-accent",
              className,
            ].join(" ")}
            {...rest}
          />
          {rightSlot ? (
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          ) : null}
        </div>
        {hasError ? (
          <p id={`${inputId}-error`} className="text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-ink-faint">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
