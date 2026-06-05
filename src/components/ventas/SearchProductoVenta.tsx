/**
 * SearchProductoVenta: buscador de productos para agregar a la venta.
 *
 * Input controlado; la página aplica debounce y consulta el backend
 * (/productos/buscar). Busca por nombre, marca, código o categoría según lo
 * que soporte el backend.
 */

import { Search } from "lucide-react";

interface SearchProductoVentaProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchProductoVenta({
  value,
  onChange,
}: SearchProductoVentaProps) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar producto..."
        autoFocus
        className="w-full rounded-xl border border-line bg-white py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint/70 transition-all focus:border-accent focus:shadow-focus focus:outline-none"
      />
    </div>
  );
}
