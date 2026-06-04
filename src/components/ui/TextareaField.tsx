/**
 * TextareaField: área de texto con label y mensaje de error.
 *
 * Mismo patrón visual que InputField, compatible con el `register` de React
 * Hook Form (forwardRef). Útil para campos largos como "observaciones".
 */

import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextareaField({ label, error, id, className = "", ...rest }, ref) {
  const fieldId = id ?? rest.name ?? label;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <textarea
        id={fieldId}
        ref={ref}
        rows={3}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${fieldId}-error` : undefined}
        className={[
          "w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink",
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
        <p id={`${fieldId}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
});
