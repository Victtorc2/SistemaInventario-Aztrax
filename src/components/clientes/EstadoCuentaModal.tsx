/**
 * EstadoCuentaModal: estado de cuenta de un cliente (fiado).
 *
 * Muestra cada venta al crédito con su total, lo pagado, el saldo y sus abonos.
 * Permite registrar un nuevo abono sobre una venta con saldo pendiente.
 *
 * Carga el estado de cuenta al abrirse y lo recarga tras cada abono.
 */

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext";
import { formatMoney, formatDate } from "@/utils/format";
import * as clienteService from "@/services/clienteService";
import type { Cliente } from "@/types/cliente";
import type { EstadoCuenta, VentaCredito, MetodoPagoAbono } from "@/types/credito";

interface EstadoCuentaModalProps {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
  /** Se llama tras registrar un abono, para refrescar la lista de clientes. */
  onChanged?: () => void;
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export function EstadoCuentaModal({
  open,
  cliente,
  onClose,
  onChanged,
}: EstadoCuentaModalProps) {
  const toast = useToast();
  const [estado, setEstado] = useState<EstadoCuenta | null>(null);
  const [loading, setLoading] = useState(false);
  // Venta sobre la que se está registrando un abono (id) + monto + método.
  const [abonandoId, setAbonandoId] = useState<number | null>(null);
  const [montoAbono, setMontoAbono] = useState("");
  const [metodoAbono, setMetodoAbono] = useState<MetodoPagoAbono>("efectivo");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (clienteId: number) => {
    setLoading(true);
    try {
      setEstado(await clienteService.getEstadoCuenta(clienteId));
    } catch {
      setEstado(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && cliente) {
      setAbonandoId(null);
      setMontoAbono("");
      setMetodoAbono("efectivo");
      void load(cliente.id);
    }
  }, [open, cliente, load]);

  const handleAbonar = async (venta: VentaCredito) => {
    const monto = parseFloat(montoAbono);
    if (Number.isNaN(monto) || monto <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    if (monto > toNum(venta.saldo_pendiente)) {
      toast.error("El abono supera el saldo pendiente");
      return;
    }
    setSubmitting(true);
    try {
      await clienteService.createAbono(venta.id, {
        monto,
        metodo_pago: metodoAbono,
      });
      toast.success("Abono registrado");
      setAbonandoId(null);
      setMontoAbono("");
      if (cliente) await load(cliente.id);
      onChanged?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo registrar el abono");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={cliente ? `Estado de cuenta · ${cliente.nombre}` : "Estado de cuenta"}
      onClose={onClose}
      widthClassName="max-w-2xl"
    >
      {loading || !estado ? (
        <div className="flex justify-center py-12 text-ink-faint">
          <Loader size={22} label="Cargando estado de cuenta…" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Resumen de deuda total */}
          <div className="flex items-center justify-between rounded-xl border border-line bg-paper/50 px-4 py-3">
            <span className="text-sm text-ink-soft">Deuda total</span>
            <span
              className={[
                "text-lg font-semibold tabular-nums",
                toNum(estado.deuda_total) > 0 ? "text-danger" : "text-emerald-600",
              ].join(" ")}
            >
              {formatMoney(estado.deuda_total)}
            </span>
          </div>

          {estado.ventas.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-faint">
              Este cliente no tiene ventas al crédito.
            </p>
          ) : (
            <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto">
              {estado.ventas.map((v) => {
                const saldo = toNum(v.saldo_pendiente);
                const saldada = saldo <= 0;
                return (
                  <div
                    key={v.id}
                    className="rounded-xl border border-line p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-mono text-sm font-medium text-ink">
                          {v.numero_boleta}
                        </p>
                        <p className="text-xs text-ink-faint">{formatDate(v.fecha)}</p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-ink-soft">
                          Total {formatMoney(v.total)} · Pagado{" "}
                          {formatMoney(v.pagado)}
                        </p>
                        <p
                          className={[
                            "font-semibold tabular-nums",
                            saldada ? "text-emerald-600" : "text-danger",
                          ].join(" ")}
                        >
                          {saldada ? "Saldada" : `Saldo ${formatMoney(saldo)}`}
                        </p>
                      </div>
                    </div>

                    {/* Abonos existentes */}
                    {v.abonos.length > 0 ? (
                      <ul className="mt-3 flex flex-col gap-1 border-t border-line/60 pt-2">
                        {v.abonos.map((a) => (
                          <li
                            key={a.id}
                            className="flex items-center justify-between text-xs text-ink-faint"
                          >
                            <span>
                              {formatDate(a.fecha)} · {a.metodo_pago}
                            </span>
                            <span className="tabular-nums text-emerald-600">
                              + {formatMoney(a.monto)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {/* Acción / formulario de abono */}
                    {!saldada ? (
                      abonandoId === v.id ? (
                        <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-line/60 pt-3">
                          <div className="flex-1">
                            <label className="mb-1 block text-xs text-ink-faint">
                              Monto del abono
                            </label>
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              autoFocus
                              value={montoAbono}
                              onChange={(e) => setMontoAbono(e.target.value)}
                              placeholder={`Máx. ${formatMoney(saldo)}`}
                              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
                            />
                          </div>
                          <select
                            value={metodoAbono}
                            onChange={(e) =>
                              setMetodoAbono(e.target.value as MetodoPagoAbono)
                            }
                            className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-soft focus:border-accent focus:outline-none"
                          >
                            <option value="efectivo">Efectivo</option>
                            <option value="yape">Yape</option>
                          </select>
                          <Button
                            type="button"
                            onClick={() => handleAbonar(v)}
                            loading={submitting}
                          >
                            Abonar
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setAbonandoId(null)}
                            disabled={submitting}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAbonandoId(v.id);
                            setMontoAbono("");
                          }}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent"
                        >
                          <Plus size={14} />
                          Registrar abono
                        </button>
                      )
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
