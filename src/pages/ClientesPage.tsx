/**
 * ClientesPage: gestión de clientes y su fiado.
 *
 * CRUD de clientes con búsqueda (debounce), más el estado de cuenta (ventas a
 * crédito y abonos). Permite filtrar solo deudores. Reutiliza el ConfirmModal
 * para la baja (que el backend bloquea si el cliente tiene deuda).
 */

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SearchCliente } from "@/components/clientes/SearchCliente";
import { ClienteTable } from "@/components/clientes/ClienteTable";
import { ClienteModal } from "@/components/clientes/ClienteModal";
import { EstadoCuentaModal } from "@/components/clientes/EstadoCuentaModal";
import type { ClienteFormValues } from "@/components/clientes/ClienteForm";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import * as clienteService from "@/services/clienteService";
import type { Cliente, ClientePayload } from "@/types/cliente";

function toPayload(values: ClienteFormValues): ClientePayload {
  return {
    nombre: values.nombre,
    documento: values.documento ?? null,
    telefono: values.telefono ?? null,
    email: values.email ?? null,
    direccion: values.direccion ?? null,
    nota: values.nota ?? null,
  };
}

export function ClientesPage() {
  const toast = useToast();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [soloDeudores, setSoloDeudores] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState<Cliente | null>(null);
  const [estadoCuenta, setEstadoCuenta] = useState<Cliente | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(
    async (term: string, deudores: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const data = deudores
          ? await clienteService.getDeudores()
          : await clienteService.getClientes(term || undefined);
        setClientes(data);
      } catch {
        setError("No se pudieron cargar los clientes.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load(debouncedSearch, soloDeudores);
  }, [debouncedSearch, soloDeudores, load]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ClienteFormValues) => {
    setSubmitting(true);
    try {
      const payload = toPayload(values);
      if (editing) {
        await clienteService.updateCliente(editing.id, payload);
        toast.success("Cliente actualizado");
      } else {
        await clienteService.createCliente(payload);
        toast.success("Cliente creado correctamente");
      }
      setFormOpen(false);
      setEditing(null);
      await load(debouncedSearch, soloDeudores);
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
      await clienteService.deleteCliente(deleting.id);
      toast.success("Cliente eliminado");
      setDeleting(null);
      await load(debouncedSearch, soloDeudores);
    } catch (e) {
      // Incluye "El cliente tiene deuda pendiente".
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      setDeleting(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Clientes"
      subtitle="Administra tus clientes y sus cuentas al crédito"
      actions={
        <>
          <SearchCliente value={search} onChange={setSearch} />
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nuevo cliente
          </Button>
        </>
      }
    >
      {/* Filtro deudores */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSoloDeudores(false)}
          className={[
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            !soloDeudores
              ? "bg-accent text-white"
              : "text-ink-soft hover:bg-line/60",
          ].join(" ")}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setSoloDeudores(true)}
          className={[
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            soloDeudores
              ? "bg-accent text-white"
              : "text-ink-soft hover:bg-line/60",
          ].join(" ")}
        >
          Con deuda
        </button>
      </div>

      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => load(debouncedSearch, soloDeudores)}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : null}

      <ClienteTable
        clientes={clientes}
        loading={loading}
        onEstadoCuenta={(c) => setEstadoCuenta(c)}
        onEdit={(c) => {
          setEditing(c);
          setFormOpen(true);
        }}
        onDelete={(c) => setDeleting(c)}
      />

      <ClienteModal
        open={formOpen}
        cliente={editing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
      />

      <EstadoCuentaModal
        open={Boolean(estadoCuenta)}
        cliente={estadoCuenta}
        onClose={() => setEstadoCuenta(null)}
        onChanged={() => load(debouncedSearch, soloDeudores)}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        title="Eliminar cliente"
        tone="danger"
        confirmLabel="Eliminar"
        loading={submitting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!submitting) setDeleting(null);
        }}
        message={
          <>
            ¿Eliminar al cliente{" "}
            <span className="font-medium text-ink">{deleting?.nombre}</span>? Si
            tiene deuda pendiente, el sistema no permitirá eliminarlo.
          </>
        }
      />
    </PageContainer>
  );
}
