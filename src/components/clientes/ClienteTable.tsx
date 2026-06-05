/**
 * ClienteTable: listado de clientes con su deuda y acciones.
 *
 * Columnas: nombre, documento, teléfono, deuda, acciones (estado de cuenta,
 * editar, eliminar). La deuda se resalta en rojo cuando es > 0.
 */

import { Wallet, Pencil, Trash2 } from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import { formatMoney } from "@/utils/format";
import type { Cliente } from "@/types/cliente";

interface ClienteTableProps {
  clientes: Cliente[];
  loading: boolean;
  onEstadoCuenta: (cliente: Cliente) => void;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function ClienteTable({
  clientes,
  loading,
  onEstadoCuenta,
  onEdit,
  onDelete,
}: ClienteTableProps) {
  if (loading) return <TableSkeleton rows={6} columns={5} />;

  if (clientes.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No hay clientes registrados"
        description="Crea un cliente para poder venderle al crédito y llevar su cuenta."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-paper/50">
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Documento</th>
              <th className="px-5 py-3 font-medium">Teléfono</th>
              <th className="px-5 py-3 text-right font-medium">Deuda</th>
              <th className="px-5 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => {
              const deuda = toNum(c.deuda_total);
              return (
                <tr
                  key={c.id}
                  className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{c.nombre}</p>
                    {c.email ? (
                      <p className="text-xs text-ink-faint">{c.email}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{c.documento ?? "—"}</td>
                  <td className="px-5 py-4 text-ink-soft">{c.telefono ?? "—"}</td>
                  <td className="px-5 py-4 text-right">
                    {deuda > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-danger">
                        {formatMoney(deuda)}
                      </span>
                    ) : (
                      <span className="text-xs text-ink-faint">Sin deuda</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEstadoCuenta(c)}
                        title="Estado de cuenta"
                        aria-label="Estado de cuenta"
                        className="rounded-lg p-2 text-ink-faint transition-all duration-200 hover:bg-accent-soft hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      >
                        <Wallet size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(c)}
                        title="Editar"
                        aria-label="Editar"
                        className="rounded-lg p-2 text-ink-faint transition-all duration-200 hover:bg-line/60 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(c)}
                        title="Eliminar"
                        aria-label="Eliminar"
                        className="rounded-lg p-2 text-ink-faint transition-all duration-200 hover:bg-danger/10 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-danger/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
