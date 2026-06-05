/**
 * ProveedorCard: representación de un proveedor en formato tarjeta.
 *
 * Se usa en la vista móvil (donde una tabla de muchas columnas no cabe bien).
 * Muestra los datos principales y las acciones de editar/eliminar.
 */

import { Pencil, Trash2, Phone, MapPin, Hash } from "lucide-react";
import { ActionIcon } from "@/components/ui/ActionIcon";
import type { Proveedor } from "@/types/proveedor";

interface ProveedorCardProps {
  proveedor: Proveedor;
  onEdit: (p: Proveedor) => void;
  onDelete: (p: Proveedor) => void;
}

export function ProveedorCard({ proveedor, onEdit, onDelete }: ProveedorCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-ink">{proveedor.nombre}</p>
        <div className="flex shrink-0 items-center gap-1">
          <ActionIcon
            intent="edit"
            label={`Editar ${proveedor.nombre}`}
            onClick={() => onEdit(proveedor)}
          >
            <Pencil size={16} />
          </ActionIcon>
          <ActionIcon
            intent="delete"
            label={`Eliminar ${proveedor.nombre}`}
            onClick={() => onDelete(proveedor)}
          >
            <Trash2 size={16} />
          </ActionIcon>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-ink-soft">
        <p className="flex items-center gap-2">
          <Phone size={14} className="text-ink-faint" />
          {proveedor.telefono || "—"}
        </p>
        <p className="flex items-center gap-2">
          <Hash size={14} className="text-ink-faint" />
          {proveedor.ruc || "—"}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={14} className="text-ink-faint" />
          {proveedor.direccion || "—"}
        </p>
      </div>
    </div>
  );
}
