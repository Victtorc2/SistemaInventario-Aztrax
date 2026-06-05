/**
 * SelectField: campo <select> con label y mensaje de error.
 *
 * Compatible con el `register` de React Hook Form (forwardRef). Las opciones
 * se pasan como array; admite un placeholder deshabilitado inicial. Usa un
 * chevron propio (la flecha nativa se oculta) para un look consistente.
 */

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  /** Texto de ayuda mostrado bajo el campo cuando no hay error. */
  hint?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { label, error, hint, options, placeholder, id, className = "", ...rest },
    ref,
  ) {
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
        <div className="relative">
          <select
            id={fieldId}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={[
              "w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-ink",
              "transition-all duration-150 focus:outline-none focus:shadow-focus",
              hasError
                ? "border-danger focus:border-danger"
                : "border-line focus:border-accent",
              className,
            ].join(" ")}
            {...rest}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
        </div>
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
  },
);
