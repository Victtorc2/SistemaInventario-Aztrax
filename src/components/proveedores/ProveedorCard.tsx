/**
 * ProveedorCard: representación de un proveedor en formato tarjeta.
 *
 * Se usa en la vista móvil (donde una tabla de muchas columnas no cabe bien).
 * Muestra los datos principales y las acciones de editar/eliminar.
 */

import { Pencil, Trash2, Phone, MapPin, Hash } from "lucide-react";
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
          <button
            type="button"
            onClick={() => onEdit(proveedor)}
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-line/60 hover:text-ink"
            aria-label={`Editar ${proveedor.nombre}`}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(proveedor)}
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-danger/10 hover:text-danger"
            aria-label={`Eliminar ${proveedor.nombre}`}
          >
            <Trash2 size={16} />
          </button>
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
