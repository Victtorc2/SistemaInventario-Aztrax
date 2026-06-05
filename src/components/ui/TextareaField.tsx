/**
 * TextareaField: área de texto con label y mensaje de error.
 *
 * Mismo patrón visual que InputField, compatible con el `register` de React
 * Hook Form (forwardRef). Admite texto de ayuda y marca de requerido. Útil
 * para campos largos como "observaciones".
 */

import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  /** Texto de ayuda mostrado bajo el campo cuando no hay error. */
  hint?: string;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextareaField({ label, error, hint, id, className = "", ...rest }, ref) {
  const fieldId = id ?? rest.name ?? label;
  const hasError = Boolean(error);
  const describedBy = hasError
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-ink-soft">
        {label}
        {rest.required ? <span className="ml-0.5 text-accent">*</span> : null}
      </label>
      <textarea
        id={fieldId}
        ref={ref}
        rows={3}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className={[
          "w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink",
          "placeholder:text-ink-faint/70 transition-all duration-150",
          "focus:outline-none focus:shadow-focus",
          hasError
            ? "border-danger focus:border-danger"
            : "border-line focus:border-accent",
          className,
        ].join(" ")}
        {...rest}
      />
      {hasError ? (
        <p id={`${fieldId}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-xs text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
