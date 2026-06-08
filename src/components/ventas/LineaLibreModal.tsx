/**
 * LineaLibreModal: agrega una "línea libre" al carrito.
 *
 * Una línea libre es un producto NO registrado en el inventario: se escribe a
 * mano la descripción y el precio (y opcionalmente el costo, para que la
 * rentabilidad calcule la ganancia real). No controla stock.
 */

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import type { LibreInput } from "@/hooks/useCart";

interface LineaLibreModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: LibreInput) => void;
}

const EMPTY = { descripcion: "", precio: "", costo: "", cantidad: "1" };

export function LineaLibreModal({ open, onClose, onAdd }: LineaLibreModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  // Limpia el formulario cada vez que se abre.
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setError(null);
    }
  }, [open]);

  const set = (campo: keyof typeof EMPTY) => (v: string) =>
    setForm((prev) => ({ ...prev, [campo]: v }));

  const handleAdd = () => {
    const descripcion = form.descripcion.trim();
    const precio = Number(form.precio);
    const cantidad = Number(form.cantidad);
    const costo = form.costo.trim() === "" ? null : Number(form.costo);

    if (!descripcion) {
      setError("Escribe una descripción del producto");
      return;
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      setError("La cantidad debe ser un entero mayor o igual a 1");
      return;
    }
    if (costo !== null && (!Number.isFinite(costo) || costo < 0)) {
      setError("El costo no puede ser negativo");
      return;
    }

    onAdd({ descripcion, precio, costo, cantidad });
    onClose();
  };

  return (
    <Modal open={open} title="Agregar línea libre" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink-faint">
          Para vender algo que no está registrado en el inventario. Tú pones el
          precio; el costo es opcional (sirve para calcular la ganancia real).
        </p>

        <InputField
          label="Descripción"
          placeholder="Ej. Anzuelos sueltos"
          autoFocus
          value={form.descripcion}
          onChange={(e) => set("descripcion")(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Precio venta"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.precio}
            onChange={(e) => set("precio")(e.target.value)}
          />
          <InputField
            label="Costo (opcional)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            hint="Lo que te costó, para la ganancia real"
            value={form.costo}
            onChange={(e) => set("costo")(e.target.value)}
          />
        </div>

        <InputField
          label="Cantidad"
          type="number"
          min="1"
          step="1"
          placeholder="1"
          value={form.cantidad}
          onChange={(e) => set("cantidad")(e.target.value)}
        />

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <div className="mt-1 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleAdd}>
            Agregar al carrito
          </Button>
        </div>
      </div>
    </Modal>
  );
}
