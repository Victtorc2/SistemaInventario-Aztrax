/**
 * CantidadSelector: control de cantidad [-] [n] [+].
 *
 * Deshabilita [-] en el mínimo (1) y [+] al alcanzar el stock máximo. Es
 * controlado: el valor y los callbacks vienen del componente padre (carrito).
 */

import { Minus, Plus } from "lucide-react";

interface CantidadSelectorProps {
  value: number;
  max: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function CantidadSelector({
  value,
  max,
  onIncrement,
  onDecrement,
}: CantidadSelectorProps) {
  const atMin = value <= 1;
  const atMax = value >= max;

  const btn =
    "flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-soft transition-colors hover:bg-line/60 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onDecrement}
        disabled={atMin}
        className={btn}
        aria-label="Disminuir cantidad"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={atMax}
        className={btn}
        aria-label="Aumentar cantidad"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
