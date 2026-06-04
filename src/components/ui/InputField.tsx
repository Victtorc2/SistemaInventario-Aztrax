/**
 * InputField: campo de formulario con label y mensaje de error.
 *
 * Usa forwardRef para ser compatible con el `register` de React Hook Form.
 * Muestra el error debajo del input y aplica estilos de estado de error
 * (borde y anillo rojos). El resto de props nativas de <input> se reenvían.
 */

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, error, id, className = "", ...rest }, ref) {
    const inputId = id ?? rest.name ?? label;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink-soft"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={[
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink",
            "placeholder:text-ink-faint/70 transition-all duration-150",
            "focus:outline-none focus:shadow-focus",
            hasError
              ? "border-danger focus:border-danger"
              : "border-line focus:border-ink",
            className,
          ].join(" ")}
          {...rest}
        />
        {hasError ? (
          <p id={`${inputId}-error`} className="text-xs text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
