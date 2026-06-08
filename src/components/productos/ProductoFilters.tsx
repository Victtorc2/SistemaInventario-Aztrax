/**
 * ProductoFilters: barra de filtros por categoría, proveedor y estado.
 *
 * Es controlado: el estado de los filtros vive en la página. Permite limpiar
 * todos los filtros de una vez. Los selects de catálogo se pueblan con las
 * listas cargadas por la página.
 */

import { X } from "lucide-react";
import type { Categoria } from "@/types/categoria";
import type { Proveedor } from "@/types/proveedor";
import type { EstadoProducto } from "@/types/producto";

export interface ProductoFilterState {
  categoria: string;
  proveedor: string;
  estado: string;
  /** "" = activos (por defecto), "inactivos" = desactivados. */
  activo: string;
  /** "" / "reciente" = recientes, "nombre" = alfabético A-Z. */
  orden: string;
}

interface ProductoFiltersProps {
  value: ProductoFilterState;
  categorias: Categoria[];
  proveedores: Proveedor[];
  onChange: (next: ProductoFilterState) => void;
}

const ESTADOS: { value: EstadoProducto; label: string }[] = [
  { value: "disponible", label: "Disponible" },
  { value: "bajo_stock", label: "Bajo stock" },
  { value: "agotado", label: "Agotado" },
];

const selectCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-soft transition-all focus:border-accent focus:shadow-focus focus:outline-none";

export function ProductoFilters({
  value,
  categorias,
  proveedores,
  onChange,
}: ProductoFiltersProps) {
  const hasFilters =
    value.categoria ||
    value.proveedor ||
    value.estado ||
    value.activo ||
    value.orden;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3 shadow-card">
      <select
        className={selectCls}
        value={value.categoria}
        onChange={(e) => onChange({ ...value, categoria: e.target.value })}
        aria-label="Filtrar por categoría"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <select
        className={selectCls}
        value={value.proveedor}
        onChange={(e) => onChange({ ...value, proveedor: e.target.value })}
        aria-label="Filtrar por proveedor"
      >
        <option value="">Todos los proveedores</option>
        {proveedores.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>

      <select
        className={selectCls}
        value={value.estado}
        onChange={(e) => onChange({ ...value, estado: e.target.value })}
        aria-label="Filtrar por estado"
      >
        <option value="">Todos los estados</option>
        {ESTADOS.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>

      <select
        className={selectCls}
        value={value.activo}
        onChange={(e) => onChange({ ...value, activo: e.target.value })}
        aria-label="Filtrar por activación"
      >
        <option value="">Activos</option>
        <option value="inactivos">Desactivados</option>
      </select>

      <select
        className={selectCls}
        value={value.orden}
        onChange={(e) => onChange({ ...value, orden: e.target.value })}
        aria-label="Ordenar productos"
      >
        <option value="">Más recientes</option>
        <option value="nombre">Nombre (A-Z)</option>
      </select>

      {hasFilters ? (
        <button
          type="button"
          onClick={() =>
            onChange({
              categoria: "",
              proveedor: "",
              estado: "",
              activo: "",
              orden: "",
            })
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
