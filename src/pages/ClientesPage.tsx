/**
 * ClientesPage: gestión de clientes, su fiado y fidelización.
 *
 * CRUD de clientes con búsqueda (debounce), estado de cuenta (ventas a crédito
 * y abonos) y perfil 360° (métricas de compra, favoritos y puntos). Permite
 * filtrar todos / deudores / inactivos (los que no compran hace tiempo, para
 * recuperarlos). Reutiliza el ConfirmModal para la baja.
 */

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SearchCliente } from "@/components/clientes/SearchCliente";
import { ClienteTable } from "@/components/clientes/ClienteTable";
import { InactivosTable } from "@/components/clientes/InactivosTable";
import { ClienteModal } from "@/components/clientes/ClienteModal";
import { EstadoCuentaModal } from "@/components/clientes/EstadoCuentaModal";
import { PerfilClienteModal } from "@/components/clientes/PerfilClienteModal";
import type { ClienteFormValues } from "@/components/clientes/ClienteForm";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import * as clienteService from "@/services/clienteService";
import type { Cliente, ClienteInactivo, ClientePayload } from "@/types/cliente";

type Vista = "todos" | "deudores" | "inactivos";

function toPayload(values: ClienteFormValues): ClientePayload {
  return {
    nombre: values.nombre,
    documento: values.documento ?? null,
    telefono: values.telefono ?? null,
    email: values.email ?? null,
    direccion: values.direccion ?? null,
    fecha_nacimiento: values.fecha_nacimiento ?? null,
    nota: values.nota ?? null,
  };
}

export function ClientesPage() {
  const toast = useToast();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [inactivos, setInactivos] = useState<ClienteInactivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [vista, setVista] = useState<Vista>("todos");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState<Cliente | null>(null);
  const [estadoCuenta, setEstadoCuenta] = useState<Cliente | null>(null);
  const [perfilId, setPerfilId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (term: string, v: Vista) => {
    setLoading(true);
    setError(null);
    try {
      if (v === "inactivos") {
        setInactivos(await clienteService.getClientesInactivos(30));
      } else if (v === "deudores") {
        setClientes(await clienteService.getDeudores());
      } else {
        setClientes(await clienteService.getClientes(term || undefined));
      }
    } catch {
      setError("No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(debouncedSearch, vista);
  }, [debouncedSearch, vista, load]);

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
      await load(debouncedSearch, vista);
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
      await load(debouncedSearch, vista);
    } catch (e) {
      // Incluye "El cliente tiene deuda pendiente".
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      setDeleting(null);
    } finally {
      setSubmitting(false);
    }
  };

  const filtros: { value: Vista; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "deudores", label: "Con deuda" },
    { value: "inactivos", label: "Inactivos" },
  ];

  return (
    <PageContainer
      title="Clientes"
      subtitle="Administra tus clientes, su crédito y fidelización"
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
      {/* Filtros de vista */}
      <div className="mb-4 flex items-center gap-2">
        {filtros.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setVista(f.value)}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              vista === f.value
                ? "bg-accent text-white"
                : "text-ink-soft hover:bg-line/60",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => load(debouncedSearch, vista)}
            className="inline-flex items-center gap-1.5 font-medium hover:underline"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      ) : null}

      {vista === "inactivos" ? (
        <InactivosTable inactivos={inactivos} loading={loading} />
      ) : (
        <ClienteTable
          clientes={clientes}
          loading={loading}
          onPerfil={(c) => setPerfilId(c.id)}
          onEstadoCuenta={(c) => setEstadoCuenta(c)}
          onEdit={(c) => {
            setEditing(c);
            setFormOpen(true);
          }}
          onDelete={(c) => setDeleting(c)}
        />
      )}

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
        onChanged={() => load(debouncedSearch, vista)}
      />

      <PerfilClienteModal
        open={perfilId !== null}
        clienteId={perfilId}
        onClose={() => setPerfilId(null)}
        onChanged={() => load(debouncedSearch, vista)}
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
