/**
 * MetodoPagoSelector: elige la forma de pago de la venta (efectivo o yape).
 *
 * Dos botones grandes y táctiles tipo "segmented control". El seleccionado se
 * resalta. Es controlado: el valor y el callback vienen del padre (useCart).
 */

import { Banknote, Smartphone } from "lucide-react";
import type { MetodoPago } from "@/types/cart";

interface MetodoPagoSelectorProps {
  value: MetodoPago;
  onChange: (metodo: MetodoPago) => void;
}

const OPCIONES: { value: MetodoPago; label: string; icon: typeof Banknote }[] = [
  { value: "efectivo", label: "Efectivo", icon: Banknote },
  { value: "yape", label: "Yape", icon: Smartphone },
];

export function MetodoPagoSelector({ value, onChange }: MetodoPagoSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
        Forma de pago
      </span>
      <div
        role="radiogroup"
        aria-label="Forma de pago"
        className="grid grid-cols-2 gap-2"
      >
        {OPCIONES.map(({ value: v, label, icon: Icon }) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(v)}
              className={[
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5",
                "text-sm font-medium transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20",
                active
                  ? "border-accent bg-accent text-white shadow-sm"
                  : "border-line bg-white text-ink-soft hover:border-ink/40 hover:bg-paper/60",
              ].join(" ")}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
