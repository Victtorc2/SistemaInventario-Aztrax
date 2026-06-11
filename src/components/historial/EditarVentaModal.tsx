/**
 * EditarVentaModal: modifica una venta dentro del plazo permitido (3 días).
 *
 * Carga el detalle, permite ajustar cantidades, quitar líneas, editar el precio
 * de las líneas libres y cambiar el descuento y el método de pago. Al guardar,
 * el backend repone/descuenta stock, recalcula totales y puntos, y conserva el
 * número de boleta. El tipo de pago y el cliente se mantienen.
 */

import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext";
import { formatMoney } from "@/utils/format";
import { getDetalleVenta } from "@/services/historialService";
import { editarVenta } from "@/services/ventaService";
import type { DescuentoTipo, MetodoPago } from "@/types/cart";
import type { Venta, VentaItemPayload, VentaPayload } from "@/types/venta";

interface EditarVentaModalProps {
  open: boolean;
  ventaId: number | null;
  onClose: () => void;
  /** Se llama tras editar con éxito, para refrescar el historial. */
  onSaved?: () => void;
}

interface EditableLine {
  key: string;
  esLibre: boolean;
  productoId: number | null;
  nombre: string;
  marca: string;
  cantidad: number;
  precio: number;
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function EditarVentaModal({
  open,
  ventaId,
  onClose,
  onSaved,
}: EditarVentaModalProps) {
  const toast = useToast();
  const [venta, setVenta] = useState<Venta | null>(null);
  const [lines, setLines] = useState<EditableLine[]>([]);
  const [descTipo, setDescTipo] = useState<DescuentoTipo>("ninguno");
  const [descValor, setDescValor] = useState("");
  const [metodo, setMetodo] = useState<MetodoPago>("efectivo");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || ventaId == null) return;
    let active = true;
    setLoading(true);
    getDetalleVenta(ventaId)
      .then((data) => {
        if (!active) return;
        setVenta(data);
        setLines(
          data.detalles.map((d) => ({
            key: String(d.id),
            esLibre: d.es_libre,
            productoId: d.producto_id,
            nombre: d.producto,
            marca: d.marca,
            cantidad: d.cantidad,
            precio: toNum(d.precio),
          })),
        );
        const tipo = (data.descuento_tipo as DescuentoTipo | null) ?? "ninguno";
        setDescTipo(tipo === "monto" || tipo === "porcentaje" ? tipo : "ninguno");
        setDescValor(toNum(data.descuento) > 0 ? String(toNum(data.descuento)) : "");
        setMetodo((data.metodo_pago as MetodoPago) === "yape" ? "yape" : "efectivo");
      })
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "No se pudo cargar la venta");
        onClose();
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [open, ventaId, toast, onClose]);

  const subtotal = useMemo(
    () => lines.reduce((acc, l) => acc + l.precio * l.cantidad, 0),
    [lines],
  );
  const descuento = useMemo(() => {
    const v = parseFloat(descValor || "0");
    if (Number.isNaN(v) || v <= 0 || descTipo === "ninguno") return 0;
    const monto = descTipo === "porcentaje" ? (subtotal * Math.min(v, 100)) / 100 : v;
    return Math.min(monto, subtotal);
  }, [descValor, descTipo, subtotal]);
  const total = Math.max(0, subtotal - descuento);

  const setCantidad = (key: string, cantidad: number) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, cantidad: Math.max(1, cantidad) } : l)),
    );
  const setPrecio = (key: string, precio: number) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, precio: Math.max(0, precio) } : l)),
    );
  const removeLine = (key: string) =>
    setLines((prev) => prev.filter((l) => l.key !== key));

  const handleGuardar = async () => {
    if (venta == null) return;
    if (lines.length === 0) {
      toast.error("La venta debe tener al menos una línea");
      return;
    }
    const items: VentaItemPayload[] = lines.map((l) =>
      l.esLibre || l.productoId == null
        ? { descripcion: l.nombre, precio: l.precio, cantidad: l.cantidad }
        : { producto_id: l.productoId, cantidad: l.cantidad },
    );
    const payload: VentaPayload = {
      items,
      descuento: descTipo === "ninguno" ? 0 : parseFloat(descValor || "0") || 0,
      descuento_tipo: descTipo === "ninguno" ? null : descTipo,
      metodo_pago: metodo,
      tipo_pago: (venta.tipo_pago as VentaPayload["tipo_pago"]) ?? "contado",
      cliente_id: venta.cliente_id,
    };
    setSubmitting(true);
    try {
      await editarVenta(venta.id, payload);
      toast.success("Venta modificada");
      onSaved?.();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo modificar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={venta ? `Modificar ${venta.numero_boleta}` : "Modificar venta"}
      onClose={onClose}
      widthClassName="max-w-xl"
      closeOnOverlay={!submitting}
    >
      {loading || !venta ? (
        <div className="flex justify-center py-12 text-ink-faint">
          <Loader size={22} label="Cargando venta…" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs text-amber-700">
            Las boletas solo se pueden modificar dentro de los 3 días desde su
            registro. Para productos registrados, el precio vigente lo aplica el
            sistema al guardar.
          </p>

          {/* Líneas */}
          <div className="flex flex-col gap-2">
            {lines.map((l) => (
              <div
                key={l.key}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-line px-3 py-2"
              >
                <div className="min-w-[120px] flex-1">
                  <p className="text-sm font-medium text-ink">{l.nombre}</p>
                  <p className="text-xs text-ink-faint">
                    {l.esLibre ? "Línea libre" : l.marca}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-ink-faint">
                    Cant.
                  </label>
                  <input
                    type="number"
                    min={1}
                    step="1"
                    value={l.cantidad}
                    onChange={(e) => setCantidad(l.key, parseInt(e.target.value, 10) || 1)}
                    className="w-16 rounded-lg border border-line bg-white px-2 py-1.5 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-ink-faint">
                    Precio
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={l.precio}
                    disabled={!l.esLibre}
                    onChange={(e) => setPrecio(l.key, parseFloat(e.target.value) || 0)}
                    className="w-20 rounded-lg border border-line bg-white px-2 py-1.5 text-sm focus:border-accent focus:outline-none disabled:bg-paper/60 disabled:text-ink-faint"
                  />
                </div>
                <div className="w-20 text-right">
                  <label className="block text-[10px] uppercase text-ink-faint">
                    Subt.
                  </label>
                  <span className="text-sm font-medium tabular-nums">
                    {formatMoney(l.precio * l.cantidad)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(l.key)}
                  aria-label="Quitar línea"
                  className="rounded-lg p-2 text-danger transition-colors hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {lines.length === 0 ? (
              <p className="py-4 text-center text-sm text-ink-faint">
                No quedan líneas. Agrega al menos una para poder guardar.
              </p>
            ) : null}
          </div>

          {/* Descuento y método de pago */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-ink-faint">Descuento</label>
              <select
                value={descTipo}
                onChange={(e) => setDescTipo(e.target.value as DescuentoTipo)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
              >
                <option value="ninguno">Sin descuento</option>
                <option value="monto">Monto (S/)</option>
                <option value="porcentaje">Porcentaje (%)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-faint">Valor</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={descValor}
                disabled={descTipo === "ninguno"}
                onChange={(e) => setDescValor(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none disabled:bg-paper/60"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-faint">Método</label>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value as MetodoPago)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
              >
                <option value="efectivo">Efectivo</option>
                <option value="yape">Yape</option>
              </select>
            </div>
          </div>

          {/* Totales */}
          <div className="ml-auto w-full max-w-[220px] space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-faint">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatMoney(subtotal)}</span>
            </div>
            {descuento > 0 ? (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento</span>
                <span className="tabular-nums">- {formatMoney(descuento)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-line pt-1.5 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatMoney(total)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} loading={submitting} disabled={lines.length === 0}>
              Guardar cambios
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
