/**
 * ProductosPage: pantalla del inventario (CRUD de productos).
 *
 * Orquesta: carga con filtros (categoría/proveedor/estado) y búsqueda en
 * tiempo real (debounce, por nombre o código), creación/edición/eliminación
 * vía modales, con toasts y estados de carga/error. Los catálogos de
 * categorías y proveedores se cargan una vez (useCatalogos) y alimentan tanto
 * el formulario como los filtros.
 */

import { useCallback, useEffect, useState } from "react";
import { FileText, Plus, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { SearchProducto } from "@/components/productos/SearchProducto";
import {
  ProductoFilters,
  type ProductoFilterState,
} from "@/components/productos/ProductoFilters";
import { ProductoTable } from "@/components/productos/ProductoTable";
import { ProductoModal } from "@/components/productos/ProductoModal";
import { DeleteProductoModal } from "@/components/productos/DeleteProductoModal";
import { EmptyProducts } from "@/components/productos/EmptyProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { useCatalogos } from "@/hooks/useCatalogos";
import { useToast } from "@/context/ToastContext";
import * as productoService from "@/services/productoService";
import type {
  EstadoProducto,
  OrdenProducto,
  Producto,
  ProductoFilters as Filters,
  ProductoPayload,
} from "@/types/producto";

export function ProductosPage() {
  const toast = useToast();
  const { categorias, proveedores } = useCatalogos();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [filters, setFilters] = useState<ProductoFilterState>({
    categoria: "",
    proveedor: "",
    estado: "",
    activo: "",
    orden: "",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [deleting, setDeleting] = useState<Producto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const load = useCallback(
    async (term: string, f: ProductoFilterState) => {
      setLoading(true);
      setError(null);
      try {
        const query: Filters = {
          search: term || undefined,
          categoria: f.categoria ? Number(f.categoria) : undefined,
          proveedor: f.proveedor ? Number(f.proveedor) : undefined,
          estado: (f.estado || undefined) as EstadoProducto | undefined,
          // "inactivos" -> activo=false; vacío -> por defecto (activos).
          activo: f.activo === "inactivos" ? false : undefined,
          orden: (f.orden || undefined) as OrdenProducto | undefined,
        };
        const data = await productoService.getProductos(query);
        setProductos(data);
      } catch {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Recarga cuando cambian búsqueda (debounced) o filtros.
  useEffect(() => {
    void load(debouncedSearch, filters);
  }, [debouncedSearch, filters, load]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (producto: Producto) => {
    setEditing(producto);
    setFormOpen(true);
  };

  const handleSubmit = async (payload: ProductoPayload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await productoService.updateProducto(editing.id, payload);
        toast.success("Producto actualizado");
      } else {
        await productoService.createProducto(payload);
        toast.success("Producto creado");
      }
      setFormOpen(false);
      setEditing(null);
      await load(debouncedSearch, filters);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await productoService.deleteProducto(deleting.id);
      toast.success("Producto eliminado");
      setDeleting(null);
      await load(debouncedSearch, filters);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      setDeleting(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReactivar = async (producto: Producto) => {
    try {
      await productoService.toggleActivoProducto(producto.id, true);
      toast.success("Producto reactivado");
      await load(debouncedSearch, filters);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo reactivar");
    }
  };

  // Genera y descarga el reporte PDF con los MISMOS filtros activos del listado.
  const handleReporte = async () => {
    setReportLoading(true);
    try {
      await productoService.downloadReporteProductos({
        search: debouncedSearch || undefined,
        categoria: filters.categoria ? Number(filters.categoria) : undefined,
        proveedor: filters.proveedor ? Number(filters.proveedor) : undefined,
        estado: (filters.estado || undefined) as EstadoProducto | undefined,
      });
      toast.success("Reporte generado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo generar el reporte");
    } finally {
      setReportLoading(false);
    }
  };

  const isEmpty = !loading && productos.length === 0;

  return (
    <PageContainer
      title="Productos"
      subtitle="Administra el inventario del negocio"
      wide
      actions={
        <>
          <SearchProducto value={search} onChange={setSearch} />
          <Button
            variant="secondary"
            onClick={handleReporte}
            loading={reportLoading}
            disabled={loading}
            title="Descargar reporte PDF del inventario (respeta los filtros)"
          >
            <FileText size={16} />
            Reporte PDF
          </Button>
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nuevo producto
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <ProductoFilters
          value={filters}
          categorias={categorias}
          proveedores={proveedores}
          onChange={setFilters}
        />
      </div>

      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => load(debouncedSearch, filters)}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : null}

      {isEmpty ? (
        <EmptyProducts />
      ) : (
        <ProductoTable
          productos={productos}
          loading={loading}
          onEdit={openEdit}
          onDelete={(p) => setDeleting(p)}
          onReactivar={handleReactivar}
        />
      )}

      <ProductoModal
        open={formOpen}
        producto={editing}
        categorias={categorias}
        proveedores={proveedores}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
      />

      <DeleteProductoModal
        open={Boolean(deleting)}
        producto={deleting}
        submitting={submitting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!submitting) setDeleting(null);
        }}
      />
    </PageContainer>
  );
}
