/**
 * ProveedorTable: listado de proveedores.
 *
 * - Escritorio (md+): tabla con scroll horizontal si hace falta.
 * - Móvil: lista de ProveedorCard.
 * Maneja sus estados de presentación: loading (skeleton), vacío y con datos,
 * con paginación de 10.
 *
 * Nota: "Cantidad productos" se muestra como "—" porque el endpoint actual de
 * proveedores no devuelve ese conteo (igual que en categorías). Cuando el
 * backend lo exponga, basta con leerlo aquí.
 */

import { useState } from "react";
import { Pencil, Trash2, Truck } from "lucide-react";
import { ProveedorCard } from "@/components/proveedores/ProveedorCard";
import { ActionIcon } from "@/components/ui/ActionIcon";
import { Pagination } from "@/components/ui/Pagination";
import type { Proveedor } from "@/types/proveedor";

const PAGE_SIZE = 10;

interface ProveedorTableProps {
  proveedores: Proveedor[];
  loading: boolean;
  onEdit: (p: Proveedor) => void;
  onDelete: (p: Proveedor) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ProveedorTable({
  proveedores,
  loading,
  onEdit,
  onDelete,
}: ProveedorTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(proveedores.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = proveedores.slice(start, start + PAGE_SIZE);

  // --- Estado de carga (skeleton) ---
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        <div className="divide-y divide-line/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="h-3.5 w-40 animate-pulse rounded bg-line" />
              <div className="ml-auto h-3.5 w-24 animate-pulse rounded bg-line" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Estado vacío ---
  if (visible.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white px-5 py-16 shadow-card">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-line/60 text-ink-faint">
            <Truck size={20} />
          </div>
          <p className="text-sm font-medium text-ink-soft">
            No existen proveedores registrados
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Crea un nuevo proveedor para empezar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* --- Vista móvil: tarjetas --- */}
      <div className="space-y-3 md:hidden">
        {visible.map((p) => (
          <ProveedorCard
            key={p.id}
            proveedor={p}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* --- Vista escritorio: tabla --- */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-paper/50">
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Teléfono</th>
                <th className="px-5 py-3 font-medium">RUC</th>
                <th className="px-5 py-3 font-medium">Dirección</th>
                <th className="px-5 py-3 font-medium">Productos</th>
                <th className="px-5 py-3 font-medium">Creación</th>
                <th className="px-5 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
                >
                  <td className="px-5 py-4 font-medium text-ink">{p.nombre}</td>
                  <td className="px-5 py-4 text-ink-soft">{p.telefono || "—"}</td>
                  <td className="px-5 py-4 text-ink-soft">{p.ruc || "—"}</td>
                  <td className="px-5 py-4 text-ink-soft">{p.direccion || "—"}</td>
                  <td className="px-5 py-4 text-ink-faint">—</td>
                  <td className="px-5 py-4 text-ink-soft">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <ActionIcon
                        intent="edit"
                        label={`Editar ${p.nombre}`}
                        onClick={() => onEdit(p)}
                      >
                        <Pencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        intent="delete"
                        label={`Eliminar ${p.nombre}`}
                        onClick={() => onDelete(p)}
                      >
                        <Trash2 size={16} />
                      </ActionIcon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Paginación --- */}
      <Pagination
        page={safePage}
        total={proveedores.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  );
}
