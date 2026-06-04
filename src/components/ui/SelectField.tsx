/**
 * SelectField: campo <select> con label y mensaje de error.
 *
 * Compatible con el `register` de React Hook Form (forwardRef). Las opciones
 * se pasan como array; admite un placeholder deshabilitado inicial.
 */

import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { label, error, options, placeholder, id, className = "", ...rest },
    ref,
  ) {
    const fieldId = id ?? rest.name ?? label;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
        <select
          id={fieldId}
          ref={ref}
          aria-invalid={hasError}
          className={[
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink",
            "transition-all duration-150 focus:outline-none focus:shadow-focus",
            hasError
              ? "border-danger focus:border-danger"
              : "border-line focus:border-ink",
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
        {hasError ? (
          <p className="text-xs text-danger">{error}</p>
        ) : null}
      </div>
    );
  },
);
