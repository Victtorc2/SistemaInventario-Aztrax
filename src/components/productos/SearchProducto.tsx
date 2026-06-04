/**
 * SearchProducto: campo de búsqueda controlado (por nombre o código).
 */

import { Search } from "lucide-react";

interface SearchProductoProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchProducto({ value, onChange }: SearchProductoProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o código…"
        className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3.5 text-sm text-ink placeholder:text-ink-faint/70 transition-all focus:border-ink focus:shadow-focus focus:outline-none sm:w-72"
      />
    </div>
  );
}
