/**
 * DiscountSelector + DiscountInput.
 *
 * El selector elige el tipo (ninguno / monto fijo / porcentaje). Según el
 * tipo, se muestra el input con el adorno adecuado (S/ o %). La validación
 * del valor contra el subtotal la realiza la página con `validateDiscount`.
 */

import type { DescuentoTipo } from "@/types/cart";

interface DiscountControlsProps {
  tipo: DescuentoTipo;
  valor: number;
  error?: string | null;
  onTipoChange: (tipo: DescuentoTipo) => void;
  onValorChange: (valor: number) => void;
}

export function DiscountControls({
  tipo,
  valor,
  error,
  onTipoChange,
  onValorChange,
}: DiscountControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wide text-ink-faint">
        Descuento
      </label>

      <div className="flex gap-2">
        {/* Selector de tipo */}
        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value as DescuentoTipo)}
          className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-soft transition-all focus:border-accent focus:shadow-focus focus:outline-none"
          aria-label="Tipo de descuento"
        >
          <option value="ninguno">Sin descuento</option>
          <option value="monto">Monto fijo</option>
          <option value="porcentaje">Porcentaje</option>
        </select>

        {/* Input contextual (solo si hay tipo de descuento) */}
        {tipo !== "ninguno" ? (
          <div className="relative w-28">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-faint">
              {tipo === "monto" ? "S/" : "%"}
            </span>
            <input
              type="number"
              min={0}
              max={tipo === "porcentaje" ? 100 : undefined}
              step={tipo === "monto" ? "0.01" : "1"}
              value={Number.isNaN(valor) ? "" : valor}
              onChange={(e) => onValorChange(parseFloat(e.target.value))}
              className={[
                "w-full rounded-lg border bg-white py-2 pl-9 pr-2 text-sm text-ink",
                "transition-all focus:shadow-focus focus:outline-none",
                error ? "border-danger" : "border-line focus:border-accent",
              ].join(" ")}
              aria-label="Valor del descuento"
            />
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
