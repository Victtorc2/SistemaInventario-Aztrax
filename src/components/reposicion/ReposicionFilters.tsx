/**
 * ReposicionFilters: filtro por estado (segmented control).
 *
 * Opciones: Todos, Agotados, Bajo stock. Es controlado; el valor "" significa
 * "todos". Diseño tipo segmented control minimalista.
 */

type EstadoFiltro = "" | "agotado" | "bajo_stock";

interface ReposicionFiltersProps {
  value: EstadoFiltro;
  onChange: (value: EstadoFiltro) => void;
}

const OPTIONS: { value: EstadoFiltro; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "agotado", label: "Agotados" },
  { value: "bajo_stock", label: "Bajo stock" },
];

export function ReposicionFilters({ value, onChange }: ReposicionFiltersProps) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-white p-1 shadow-card">
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value || "todos"}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-white"
                : "text-ink-soft hover:bg-line/60 hover:text-ink",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
