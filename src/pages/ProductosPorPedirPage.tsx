/**
 * ProductosPorPedirPage: vista de reposición automática.
 *
 * Lista los productos agotados o con bajo stock (orden del backend: agotados
 * primero). Permite filtrar por estado (todos/agotados/bajo stock), buscar por
 * nombre o código (debounce) y exportar la lista a CSV, Excel (.xls) o PDF.
 */

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchReposicion } from "@/components/reposicion/SearchReposicion";
import { ReposicionFilters } from "@/components/reposicion/ReposicionFilters";
import { ReposicionTable } from "@/components/reposicion/ReposicionTable";
import { ExportButton, type ExportFormat } from "@/components/reposicion/ExportButton";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import * as reposicionService from "@/services/reposicionService";
import type { ProductoPorPedir } from "@/services/reposicionService";

type EstadoFiltro = "" | "agotado" | "bajo_stock";

export function ProductosPorPedirPage() {
  const toast = useToast();

  const [items, setItems] = useState<ProductoPorPedir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [estado, setEstado] = useState<EstadoFiltro>("");

  const load = useCallback(async (term: string, est: EstadoFiltro) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reposicionService.getProductosPorPedir({
        search: term || undefined,
        estado: est || undefined,
      });
      setItems(data);
    } catch {
      setError("No se pudieron cargar los productos por pedir.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(debouncedSearch, estado);
  }, [debouncedSearch, estado, load]);

  // Filas para exportación (mismo orden que la tabla).
  const exportRows = items.map((p) => ({
    Código: p.codigo,
    Producto: p.nombre,
    Modelo: p.modelo ?? "—",
    Proveedor: p.proveedor,
    Stock: p.stock,
    "Stock mínimo": p.stock_minimo,
    Estado: p.estado === "agotado" ? "Agotado" : "Bajo stock",
  }));

  const handleUnavailable = (format: ExportFormat) => {
    toast.error(
      `No se pudo generar el ${format.toUpperCase()}. Permite las ventanas emergentes e inténtalo de nuevo.`,
    );
  };

  return (
    <PageContainer
      title="Productos por pedir"
      subtitle="Productos que requieren reposición"
      actions={
        <>
          <SearchReposicion value={search} onChange={setSearch} />
          <ExportButton
            rows={exportRows}
            filename="productos_por_pedir"
            title="Productos por pedir"
            onUnavailable={handleUnavailable}
            disabled={items.length === 0}
          />
        </>
      }
    >
      <div className="mb-4">
        <ReposicionFilters value={estado} onChange={setEstado} />
      </div>

      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => load(debouncedSearch, estado)}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : null}

      <ReposicionTable items={items} loading={loading} />
    </PageContainer>
  );
}
