/**
 * HistorialFilters: filtros por fecha.
 *
 * Permite elegir entre fecha exacta o un rango (inicio/fin). Es controlado;
 * el estado vive en la página. Al cambiar el modo se limpian los campos del
 * otro modo para no enviar filtros contradictorios.
 */

import { X } from "lucide-react";

export interface FechaFilterState {
  modo: "ninguno" | "exacta" | "rango";
  fecha: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface HistorialFiltersProps {
  value: FechaFilterState;
  onChange: (next: FechaFilterState) => void;
}

const inputCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-soft transition-all focus:border-accent focus:shadow-focus focus:outline-none";

export function HistorialFilters({ value, onChange }: HistorialFiltersProps) {
  const hasFilter =
    value.modo !== "ninguno" &&
    (value.fecha || value.fecha_inicio || value.fecha_fin);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3 shadow-card">
      {/* Modo de filtro */}
      <select
        className={inputCls}
        value={value.modo}
        onChange={(e) =>
          onChange({
            modo: e.target.value as FechaFilterState["modo"],
            fecha: "",
            fecha_inicio: "",
            fecha_fin: "",
          })
        }
        aria-label="Modo de filtro por fecha"
      >
        <option value="ninguno">Todas las fechas</option>
        <option value="exacta">Fecha exacta</option>
        <option value="rango">Rango de fechas</option>
      </select>

      {value.modo === "exacta" ? (
        <input
          type="date"
          className={inputCls}
          value={value.fecha}
          onChange={(e) => onChange({ ...value, fecha: e.target.value })}
          aria-label="Fecha exacta"
        />
      ) : null}

      {value.modo === "rango" ? (
        <>
          <input
            type="date"
            className={inputCls}
            value={value.fecha_inicio}
            onChange={(e) => onChange({ ...value, fecha_inicio: e.target.value })}
            aria-label="Fecha inicio"
          />
          <span className="text-sm text-ink-faint">—</span>
          <input
            type="date"
            className={inputCls}
            value={value.fecha_fin}
            onChange={(e) => onChange({ ...value, fecha_fin: e.target.value })}
            aria-label="Fecha fin"
          />
        </>
      ) : null}

      {hasFilter ? (
        <button
          type="button"
          onClick={() =>
            onChange({ modo: "ninguno", fecha: "", fecha_inicio: "", fecha_fin: "" })
          }
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-ink-faint transition-colors hover:bg-line/60 hover:text-ink"
        >
          <X size={14} />
          Limpiar
        </button>
      ) : null}
    </div>
  );
}
