/**
 * HistorialPage: consulta de ventas registradas.
 *
 * Orquesta listado paginado (server-side), búsqueda por boleta (debounce),
 * filtros por fecha (exacta o rango), modales de detalle y boleta, e
 * indicadores rápidos (HistorialStats). La reimpresión reutiliza el mismo
 * BoletaModal (no se duplica lógica).
 *
 * Optimizaciones: handlers estabilizados con useCallback; HistorialTable
 * memoiza sus filas para que la paginación o filtros no re-renderen lo que
 * no cambió.
 */

import { useCallback, useEffect, useState } from "react";
import { Receipt, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchHistorial } from "@/components/historial/SearchHistorial";
import {
  HistorialFilters,
  type FechaFilterState,
} from "@/components/historial/HistorialFilters";
import { HistorialTable } from "@/components/historial/HistorialTable";
import { HistorialStats } from "@/components/historial/HistorialStats";
import { DetalleVentaModal } from "@/components/historial/DetalleVentaModal";
import { BoletaModal } from "@/components/historial/BoletaModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/utils/errorHandler";
import * as historialService from "@/services/historialService";
import { anularVenta } from "@/services/ventaService";
import type { HistorialItem } from "@/types/historial";
import type { Venta } from "@/types/venta";

const PAGE_SIZE = 10;

export function HistorialPage() {
  const toast = useToast();
  const [items, setItems] = useState<HistorialItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [fechas, setFechas] = useState<FechaFilterState>({
    modo: "ninguno",
    fecha: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  // Modales
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [boletaId, setBoletaId] = useState<number | null>(null);
  const [boletaPrecargada, setBoletaPrecargada] = useState<Venta | null>(null);
  const [anulando, setAnulando] = useState<HistorialItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(
    async (term: string, f: FechaFilterState, pageNum: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await historialService.getHistorial({
          boleta: term || undefined,
          fecha: f.modo === "exacta" ? f.fecha || undefined : undefined,
          fecha_inicio: f.modo === "rango" ? f.fecha_inicio || undefined : undefined,
          fecha_fin: f.modo === "rango" ? f.fecha_fin || undefined : undefined,
          page: pageNum,
          page_size: PAGE_SIZE,
        });
        setItems(data.items);
        setTotal(data.total);
      } catch (e) {
        setError(getErrorMessage(e, "Error al obtener historial"));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Al cambiar búsqueda o filtros, volvemos a la página 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fechas]);

  useEffect(() => {
    void load(debouncedSearch, fechas, page);
  }, [debouncedSearch, fechas, page, load]);

  // Handlers estabilizados.
  const handleVerDetalle = useCallback(
    (item: HistorialItem) => setDetalleId(item.id),
    [],
  );
  const handleVerBoleta = useCallback((item: HistorialItem) => {
    setBoletaPrecargada(null);
    setBoletaId(item.id);
  }, []);
  const handleReimprimir = useCallback((item: HistorialItem) => {
    // Reimprimir = ver boleta (mismo modal, sin duplicar lógica).
    setBoletaPrecargada(null);
    setBoletaId(item.id);
  }, []);
  const handleAnular = useCallback((item: HistorialItem) => setAnulando(item), []);

  const confirmarAnular = async () => {
    if (!anulando) return;
    setSubmitting(true);
    try {
      await anularVenta(anulando.id);
      toast.success("Venta anulada: stock repuesto y puntos revertidos");
      setAnulando(null);
      await load(debouncedSearch, fechas, page);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo anular la venta");
      setAnulando(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Desde el detalle saltamos a la boleta pasando el detalle ya cargado.
  const handleVerBoletaDesdeDetalle = useCallback((venta: Venta) => {
    setDetalleId(null);
    setBoletaPrecargada(venta);
    setBoletaId(venta.id);
  }, []);

  const isEmpty = !loading && !error && items.length === 0;

  return (
    <PageContainer
      title="Historial de ventas"
      subtitle="Consulta las ventas registradas"
      actions={<SearchHistorial value={search} onChange={setSearch} />}
    >
      <div className="mb-4">
        <HistorialStats items={items} totalVentas={total} loading={loading} />
      </div>

      <div className="mb-4">
        <HistorialFilters value={fechas} onChange={setFechas} />
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => load(debouncedSearch, fechas, page)}
            className="inline-flex items-center gap-1.5 font-medium transition-colors hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : null}

      {isEmpty ? (
        <EmptyState
          icon={Receipt}
          title="No existen ventas registradas"
          description="Las ventas que se registren aparecerán aquí, con detalle y boleta."
        />
      ) : (
        <HistorialTable
          items={items}
          loading={loading}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onVerDetalle={handleVerDetalle}
          onVerBoleta={handleVerBoleta}
          onReimprimir={handleReimprimir}
          onAnular={handleAnular}
        />
      )}

      <DetalleVentaModal
        open={detalleId !== null}
        ventaId={detalleId}
        onClose={() => setDetalleId(null)}
        onVerBoleta={handleVerBoletaDesdeDetalle}
      />

      <BoletaModal
        open={boletaId !== null}
        ventaId={boletaId}
        ventaPrecargada={boletaPrecargada}
        onClose={() => {
          setBoletaId(null);
          setBoletaPrecargada(null);
        }}
      />

      <ConfirmModal
        open={Boolean(anulando)}
        title="Anular venta"
        tone="danger"
        confirmLabel="Anular"
        loading={submitting}
        onConfirm={confirmarAnular}
        onClose={() => {
          if (!submitting) setAnulando(null);
        }}
        message={
          <>
            ¿Anular la venta{" "}
            <span className="font-mono font-medium text-ink">
              {anulando?.numero_boleta}
            </span>
            ? Se repondrá el stock de sus productos y se revertirán los puntos
            otorgados. La venta dejará de contar en los reportes. Esta acción no
            se puede deshacer.
          </>
        }
      />
    </PageContainer>
  );
}
