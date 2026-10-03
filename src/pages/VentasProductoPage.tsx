import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { getVentasProducto, type VentasProductoResultado } from "@/services/dashboardService";

export function VentasProductoPage() {
  const [search, setSearch] = useState("");
  const query = useDebounce(search.trim(), 350);
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<VentasProductoResultado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getVentasProducto(query, page).then((result) => {
      if (active) setData(result);
    }).catch((e: unknown) => {
      if (active) setError(e instanceof Error ? e.message : "No se pudo consultar las ventas");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [query, page, revision]);

  const pending = loading || search.trim() !== query;
  return (
    <PageContainer title="Ventas por producto" subtitle="Consulta cuántas veces se vendió cada producto">
      <div className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-card">
        <label htmlFor="buscar-ventas-producto" className="mb-2 block text-sm font-medium text-ink">Buscar producto</label>
        <div className="flex flex-wrap gap-2">
          <input id="buscar-ventas-producto" type="search" maxLength={150} value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Nombre, código, marca, modelo o color"
            className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none" />
          <Button onClick={() => setRevision((v) => v + 1)} disabled={pending}>Actualizar</Button>
        </div>
        <p className="mt-3 text-sm text-ink-soft">Todo el historial. “Veces vendido” cuenta boletas distintas; “Unidades” suma las cantidades. No incluye ventas anuladas ni líneas libres sin producto registrado.</p>
      </div>
      <div aria-live="polite" aria-busy={pending}>
        {pending ? <p className="p-4 text-ink-soft">Buscando ventas…</p> : error ? (
          <div role="alert" className="rounded-xl border border-danger/30 p-4 text-danger">
            <p>{error}</p><Button onClick={() => setRevision((v) => v + 1)}>Reintentar</Button>
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-paper text-ink-soft"><tr>
                  <th scope="col" className="p-4">Producto</th>
                  <th scope="col" className="p-4 text-right">Veces vendido</th>
                  <th scope="col" className="p-4 text-right">Unidades</th>
                </tr></thead>
                <tbody>{data.items.map((p) => (
                  <tr key={p.producto_id} className="border-t border-line">
                    <td className="p-4"><p className="font-medium text-ink">{p.nombre} {!p.activo && <span className="text-xs text-ink-faint">(Inactivo)</span>}</p>
                      <p className="mt-1 text-xs text-ink-soft">{[p.codigo, p.marca, p.modelo, p.color].filter(Boolean).join(" · ")}</p></td>
                    <td className="p-4 text-right font-semibold tabular-nums">{p.veces_vendido}</td>
                    <td className="p-4 text-right tabular-nums">{p.unidades_vendidas}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-soft">
              <span>{data.total} productos · Página {page} de {Math.ceil(data.total / data.page_size)}</span>
              <div className="flex gap-2">
                <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                <Button disabled={page * data.page_size >= data.total} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
              </div>
            </div>
          </>
        ) : <p className="rounded-xl border border-line bg-white p-6 text-ink-soft">No se encontraron productos con esa búsqueda.</p>}
      </div>
    </PageContainer>
  );
}
