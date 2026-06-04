/**
 * ProveedoresPage: pantalla del CRUD de proveedores.
 *
 * Orquesta carga, búsqueda con debounce (por nombre o RUC), creación, edición
 * y eliminación mediante modales, con toasts y manejo de estados. Si el
 * backend impide eliminar (proveedor asociado a productos), el mensaje del
 * backend se muestra como toast de error.
 */

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { SearchProveedor } from "@/components/proveedores/SearchProveedor";
import { ProveedorTable } from "@/components/proveedores/ProveedorTable";
import { ProveedorModal } from "@/components/proveedores/ProveedorModal";
import { DeleteProveedorModal } from "@/components/proveedores/DeleteProveedorModal";
import type { ProveedorFormValues } from "@/components/proveedores/ProveedorForm";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import * as proveedorService from "@/services/proveedorService";
import type { Proveedor, ProveedorPayload } from "@/types/proveedor";

/** Convierte los valores del formulario al payload del backend (undefined -> null). */
function toPayload(values: ProveedorFormValues): ProveedorPayload {
  return {
    nombre: values.nombre,
    telefono: values.telefono ?? null,
    direccion: values.direccion ?? null,
    ruc: values.ruc ?? null,
    observaciones: values.observaciones ?? null,
  };
}

export function ProveedoresPage() {
  const toast = useToast();

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [deleting, setDeleting] = useState<Proveedor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedorService.getProveedores(term || undefined);
      setProveedores(data);
    } catch {
      setError("No se pudieron cargar los proveedores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(debouncedSearch);
  }, [debouncedSearch, load]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (proveedor: Proveedor) => {
    setEditing(proveedor);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ProveedorFormValues) => {
    setSubmitting(true);
    try {
      const payload = toPayload(values);
      if (editing) {
        await proveedorService.updateProveedor(editing.id, payload);
        toast.success("Proveedor actualizado");
      } else {
        await proveedorService.createProveedor(payload);
        toast.success("Proveedor creado correctamente");
      }
      setFormOpen(false);
      setEditing(null);
      await load(debouncedSearch);
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
      await proveedorService.deleteProveedor(deleting.id);
      toast.success("Proveedor eliminado");
      setDeleting(null);
      await load(debouncedSearch);
    } catch (e) {
      // Incluye el caso "No se puede eliminar un proveedor asociado a productos".
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      setDeleting(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Proveedores"
      subtitle="Administra los proveedores del sistema"
      actions={
        <>
          <SearchProveedor value={search} onChange={setSearch} />
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nuevo proveedor
          </Button>
        </>
      }
    >
      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => load(debouncedSearch)}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : null}

      <ProveedorTable
        proveedores={proveedores}
        loading={loading}
        onEdit={openEdit}
        onDelete={(p) => setDeleting(p)}
      />

      <ProveedorModal
        open={formOpen}
        proveedor={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
      />

      <DeleteProveedorModal
        open={Boolean(deleting)}
        proveedor={deleting}
        submitting={submitting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!submitting) setDeleting(null);
        }}
      />
    </PageContainer>
  );
}
