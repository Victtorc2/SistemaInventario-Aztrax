/**
 * GastosPage: registro de gastos/egresos y saldo de dinero por método.
 *
 * - Tarjetas de saldo disponible por método (efectivo/yape) y total, con el
 *   desglose de ingresos y egresos.
 * - Formulario para registrar un gasto (categoría, método, monto, proveedor
 *   opcional y descripción). Al registrar, el saldo del método baja al instante.
 * - Lista de gastos recientes con opción de eliminar (restaura el saldo).
 *
 * El saldo por método = ventas al contado + abonos con ese método − gastos con
 * ese método (todo sobre ventas no anuladas). Un gasto en efectivo con la caja
 * abierta también se descuenta del arqueo (backend).
 */

import { useCallback, useEffect, useState } from "react";
import {
  Banknote,
  RefreshCw,
  Smartphone,
  Trash2,
  Wallet,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { SelectField } from "@/components/ui/SelectField";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";
import { useCatalogos } from "@/hooks/useCatalogos";
import { formatMoney, formatDate } from "@/utils/format";
import * as gastoService from "@/services/gastoService";
import {
  CATEGORIA_LABELS,
  type CategoriaGasto,
  type Gasto,
  type MetodoPagoGasto,
  type Saldo,
} from "@/types/gasto";

const CATEGORIA_OPTIONS = (
  Object.keys(CATEGORIA_LABELS) as CategoriaGasto[]
).map((value) => ({ value, label: CATEGORIA_LABELS[value] }));

/** Tarjeta de saldo de un método de pago. */
function SaldoCard({
  label,
  icon,
  ingresos,
  egresos,
  saldo,
  accent,
}: {
  label: string;
  icon: React.ReactNode;
  ingresos: string | number;
  egresos: string | number;
  saldo: string | number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${accent}`}
        >
          {icon}
        </span>
        <p className="font-semibold text-ink">{label}</p>
      </div>
      <p className="text-2xl font-semibold tabular-nums text-ink">
        {formatMoney(saldo)}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2 text-xs">
        <span className="text-emerald-600">+ {formatMoney(ingresos)}</span>
        <span className="text-danger">− {formatMoney(egresos)}</span>
      </div>
    </div>
  );
}

export function GastosPage() {
  const toast = useToast();
  const { proveedores } = useCatalogos();

  const [saldo, setSaldo] = useState<Saldo | null>(null);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Formulario.
  const [categoria, setCategoria] = useState<CategoriaGasto>("pedido");
  const [metodo, setMetodo] = useState<MetodoPagoGasto>("efectivo");
  const [monto, setMonto] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Confirmación de borrado.
  const [porEliminar, setPorEliminar] = useState<Gasto | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, g] = await Promise.all([
        gastoService.getSaldo(),
        gastoService.getGastos(),
      ]);
      setSaldo(s);
      setGastos(g);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRegistrar = async () => {
    const valor = parseFloat(monto);
    if (Number.isNaN(valor) || valor <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    setSubmitting(true);
    try {
      await gastoService.createGasto({
        categoria,
        monto: valor,
        metodo_pago: metodo,
        proveedor_id: proveedorId ? Number(proveedorId) : null,
        descripcion: descripcion.trim() || null,
      });
      setMonto("");
      setProveedorId("");
      setDescripcion("");
      toast.success("Gasto registrado");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo registrar el gasto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async () => {
    if (!porEliminar) return;
    setEliminando(true);
    try {
      await gastoService.deleteGasto(porEliminar.id);
      setPorEliminar(null);
      toast.success("Gasto eliminado");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <PageContainer
      title="Gastos y saldo"
      subtitle="Registra pedidos y cualquier salida de dinero; controla tu saldo por método"
      actions={
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-soft transition-all hover:border-accent/40 hover:text-accent disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refrescar
        </button>
      }
    >
      {loading ? (
        <div className="flex justify-center py-16 text-ink-faint">
          <Loader size={22} label="Cargando…" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Saldo por método */}
          {saldo ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SaldoCard
                label="Efectivo"
                icon={<Banknote size={18} />}
                accent="bg-emerald-600"
                ingresos={saldo.efectivo.ingresos}
                egresos={saldo.efectivo.egresos}
                saldo={saldo.efectivo.saldo}
              />
              <SaldoCard
                label="Yape"
                icon={<Smartphone size={18} />}
                accent="bg-accent"
                ingresos={saldo.yape.ingresos}
                egresos={saldo.yape.egresos}
                saldo={saldo.yape.saldo}
              />
              <div className="rounded-2xl border border-line bg-ink p-5 text-white shadow-card">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                    <Wallet size={18} />
                  </span>
                  <p className="font-semibold">Dinero total</p>
                </div>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatMoney(saldo.total)}
                </p>
                <p className="mt-3 border-t border-white/15 pt-2 text-xs text-white/60">
                  Efectivo + Yape disponibles
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
            {/* Formulario de registro */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-ink">
                Registrar gasto
              </h3>

              <div className="mb-3 flex flex-col gap-3">
                <SelectField
                  label="Categoría"
                  name="categoria"
                  value={categoria}
                  onChange={(e) =>
                    setCategoria(e.target.value as CategoriaGasto)
                  }
                  options={CATEGORIA_OPTIONS}
                />

                {/* Método de pago */}
                <div>
                  <p className="mb-1.5 text-sm font-medium text-ink-soft">
                    Método de pago
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMetodo("efectivo")}
                      className={[
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        metodo === "efectivo"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-line text-ink-soft hover:bg-line/40",
                      ].join(" ")}
                    >
                      <Banknote size={16} />
                      Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetodo("yape")}
                      className={[
                        "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        metodo === "yape"
                          ? "border-accent/40 bg-accent-soft text-accent"
                          : "border-line text-ink-soft hover:bg-line/40",
                      ].join(" ")}
                    >
                      <Smartphone size={16} />
                      Yape
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-soft">
                    Monto
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Ej. 120.50"
                    className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
                  />
                </div>

                <SelectField
                  label="Proveedor (opcional)"
                  name="proveedor"
                  value={proveedorId}
                  onChange={(e) => setProveedorId(e.target.value)}
                  placeholder="Sin proveedor"
                  options={proveedores.map((p) => ({
                    value: p.id,
                    label: p.nombre,
                  }))}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-soft">
                    Descripción (opcional)
                  </label>
                  <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej. Reposición de stock"
                    className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleRegistrar}
                loading={submitting}
                fullWidth
              >
                Registrar gasto
              </Button>
            </div>

            {/* Lista de gastos recientes */}
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="border-b border-line px-5 py-3">
                <h3 className="text-sm font-semibold text-ink">
                  Gastos recientes
                </h3>
              </div>
              {gastos.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-ink-faint">
                  Aún no hay gastos registrados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-paper/50">
                      <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                        <th className="px-5 py-3 font-medium">Fecha</th>
                        <th className="px-5 py-3 font-medium">Categoría</th>
                        <th className="px-5 py-3 font-medium">Detalle</th>
                        <th className="px-5 py-3 font-medium">Método</th>
                        <th className="px-5 py-3 text-right font-medium">Monto</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {gastos.map((g) => (
                        <tr
                          key={g.id}
                          className="border-b border-line/60 last:border-0 hover:bg-paper/60"
                        >
                          <td className="whitespace-nowrap px-5 py-3 text-ink-soft">
                            {formatDate(g.fecha)}
                          </td>
                          <td className="px-5 py-3 text-ink-soft">
                            {CATEGORIA_LABELS[g.categoria as CategoriaGasto] ??
                              g.categoria}
                          </td>
                          <td className="px-5 py-3 text-ink-soft">
                            {g.descripcion || g.proveedor_nombre || "—"}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={[
                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                g.metodo_pago === "efectivo"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-accent-soft text-accent",
                              ].join(" ")}
                            >
                              {g.metodo_pago === "efectivo" ? "Efectivo" : "Yape"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right font-medium tabular-nums text-danger">
                            − {formatMoney(g.monto)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setPorEliminar(g)}
                              className="text-ink-faint transition-colors hover:text-danger"
                              aria-label="Eliminar gasto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={porEliminar !== null}
        title="Eliminar gasto"
        tone="danger"
        confirmLabel="Eliminar"
        loading={eliminando}
        message={
          porEliminar
            ? `¿Eliminar este gasto de ${formatMoney(porEliminar.monto)}? El saldo del método se restaurará.`
            : ""
        }
        onConfirm={handleEliminar}
        onClose={() => (eliminando ? null : setPorEliminar(null))}
      />
    </PageContainer>
  );
}
