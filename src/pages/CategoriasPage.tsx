/**
 * CategoriasPage: pantalla del CRUD de categorías.
 *
 * Orquesta: carga de la lista, búsqueda en tiempo real (debounce), creación,
 * edición y eliminación mediante modales, con toasts de feedback y manejo de
 * estados (loading, error). La lógica de datos vive en categoriaService.
 */

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { SearchCategoria } from "@/components/categorias/SearchCategoria";
import { CategoriaTable } from "@/components/categorias/CategoriaTable";
import { CategoriaModal } from "@/components/categorias/CategoriaModal";
import { DeleteCategoriaModal } from "@/components/categorias/DeleteCategoriaModal";
import type { CategoriaFormValues } from "@/components/categorias/CategoriaForm";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import * as categoriaService from "@/services/categoriaService";
import type { Categoria } from "@/types/categoria";

export function CategoriasPage() {
  const toast = useToast();

  // --- Datos / carga ---
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Búsqueda (con debounce) ---
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  // --- Modales ---
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [deleting, setDeleting] = useState<Categoria | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /** Carga la lista de categorías (opcionalmente filtrada). */
  const loadCategorias = useCallback(
    async (term: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await categoriaService.getCategorias(term || undefined);
        setCategorias(data);
      } catch {
        setError("No se pudieron cargar las categorías.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Recarga cuando cambia el término de búsqueda "debounced".
  useEffect(() => {
    void loadCategorias(debouncedSearch);
  }, [debouncedSearch, loadCategorias]);

  // --- Handlers de creación / edición ---
  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (categoria: Categoria) => {
    setEditing(categoria);
    setFormOpen(true);
  };

  const handleSubmit = async (values: CategoriaFormValues) => {
    setSubmitting(true);
    try {
      if (editing) {
        await categoriaService.updateCategoria(editing.id, values);
        toast.success("Categoría editada");
      } else {
        await categoriaService.createCategoria(values);
        toast.success("Categoría creada");
      }
      setFormOpen(false);
      setEditing(null);
      await loadCategorias(debouncedSearch);
    } catch (e) {
      // Errores del backend (p. ej. nombre duplicado) se muestran como toast.
      toast.error(e instanceof Error ? e.message : "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Handler de eliminación ---
  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try {
      await categoriaService.deleteCategoria(deleting.id);
      toast.success("Categoría eliminada");
      setDeleting(null);
      await loadCategorias(debouncedSearch);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Categorías"
      subtitle="Administra las categorías del sistema"
      actions={
        <>
          <SearchCategoria value={search} onChange={setSearch} />
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nueva categoría
          </Button>
        </>
      }
    >
      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadCategorias(debouncedSearch)}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : null}

      <CategoriaTable
        categorias={categorias}
        loading={loading}
        onEdit={openEdit}
        onDelete={(c) => setDeleting(c)}
      />

      {/* Modal crear / editar */}
      <CategoriaModal
        open={formOpen}
        categoria={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
      />

      {/* Modal eliminar */}
      <DeleteCategoriaModal
        open={Boolean(deleting)}
        categoria={deleting}
        submitting={submitting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!submitting) setDeleting(null);
        }}
      />
    </PageContainer>
  );
}
