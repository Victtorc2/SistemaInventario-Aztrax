/**
 * PerfilClienteModal: perfil 360° del cliente.
 *
 * Muestra métricas de compra (total gastado, nº de compras, ticket promedio,
 * última visita), sus productos favoritos, su historial reciente y su saldo de
 * puntos de fidelización, con la opción de canjearlos. Carga el perfil y los
 * puntos al abrirse y recarga tras un canje.
 */

import { useCallback, useEffect, useState } from "react";
import { Award, Gift } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext";
import { formatMoney, formatDate } from "@/utils/format";
import * as clienteService from "@/services/clienteService";
import type { PerfilCliente } from "@/types/cliente";
import type { PuntosResumen } from "@/types/puntos";

interface PerfilClienteModalProps {
  open: boolean;
  clienteId: number | null;
  onClose: () => void;
  /** Se llama tras canjear puntos, para refrescar la lista de clientes. */
  onChanged?: () => void;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper/40 px-4 py-3">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}

export function PerfilClienteModal({
  open,
  clienteId,
  onClose,
  onChanged,
}: PerfilClienteModalProps) {
  const toast = useToast();
  const [perfil, setPerfil] = useState<PerfilCliente | null>(null);
  const [puntos, setPuntos] = useState<PuntosResumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [canjeando, setCanjeando] = useState(false);
  const [montoCanje, setMontoCanje] = useState("");

  const load = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const [p, pts] = await Promise.all([
        clienteService.getPerfilCliente(id),
        clienteService.getPuntos(id),
      ]);
      setPerfil(p);
      setPuntos(pts);
    } catch {
      setPerfil(null);
      setPuntos(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && clienteId != null) {
      setMontoCanje("");
      void load(clienteId);
    }
  }, [open, clienteId, load]);

  const handleCanjear = async () => {
    if (clienteId == null) return;
    const cant = parseInt(montoCanje, 10);
    if (Number.isNaN(cant) || cant <= 0) {
      toast.error("Ingresa una cantidad válida de puntos");
      return;
    }
    setCanjeando(true);
    try {
      const actualizado = await clienteService.canjearPuntos(clienteId, {
        puntos: cant,
      });
      setPuntos(actualizado);
      setMontoCanje("");
      toast.success("Puntos canjeados");
      onChanged?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudieron canjear");
    } finally {
      setCanjeando(false);
    }
  };

  return (
    <Modal
      open={open}
      title={perfil ? `Perfil · ${perfil.cliente.nombre}` : "Perfil del cliente"}
      onClose={onClose}
      widthClassName="max-w-2xl"
    >
      {loading || !perfil || !puntos ? (
        <div className="flex justify-center py-12 text-ink-faint">
          <Loader size={22} label="Cargando perfil…" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Compras" value={String(perfil.total_compras)} />
            <Metric label="Total gastado" value={formatMoney(perfil.total_gastado)} />
            <Metric label="Ticket prom." value={formatMoney(perfil.ticket_promedio)} />
            <Metric
              label="Última visita"
              value={perfil.ultima_compra ? formatDate(perfil.ultima_compra) : "—"}
            />
          </div>

          {/* Puntos de fidelización */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-xs text-amber-700">Puntos disponibles</p>
                  <p className="text-xl font-bold tabular-nums text-amber-800">
                    {puntos.puntos}
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div>
                  <label className="mb-1 block text-xs text-ink-faint">
                    Canjear
                  </label>
                  <input
                    type="number"
                    min={1}
                    step="1"
                    value={montoCanje}
                    onChange={(e) => setMontoCanje(e.target.value)}
                    placeholder="Puntos"
                    className="w-28 rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
                  />
                </div>
                <Button
                  type="button"
                  variant="warning"
                  onClick={handleCanjear}
                  loading={canjeando}
                  disabled={puntos.puntos <= 0}
                >
                  <Gift size={15} />
                  Canjear
                </Button>
              </div>
            </div>
          </div>

          {/* Productos favoritos */}
          {perfil.productos_favoritos.length > 0 ? (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-ink">
                Productos favoritos
              </h3>
              <div className="flex flex-wrap gap-2">
                {perfil.productos_favoritos.map((p) => (
                  <span
                    key={p.producto_id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper/50 px-3 py-1 text-xs text-ink-soft"
                  >
                    {p.nombre}
                    <span className="font-medium text-accent">×{p.unidades}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Compras recientes */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-ink">
              Compras recientes
            </h3>
            {perfil.compras_recientes.length === 0 ? (
              <p className="py-4 text-center text-sm text-ink-faint">
                Este cliente aún no tiene compras registradas.
              </p>
            ) : (
              <div className="flex max-h-[30vh] flex-col gap-2 overflow-y-auto">
                {perfil.compras_recientes.map((v) => (
                  <div
                    key={v.venta_id}
                    className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-mono text-xs font-medium text-ink">
                        {v.numero_boleta}
                        {v.anulada ? (
                          <span className="ml-2 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium uppercase text-danger">
                            Anulada
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-ink-faint">
                        {formatDate(v.fecha)} · {v.metodo_pago} · {v.tipo_pago}
                      </p>
                    </div>
                    <span
                      className={[
                        "font-semibold tabular-nums",
                        v.anulada ? "text-ink-faint line-through" : "text-ink",
                      ].join(" ")}
                    >
                      {formatMoney(v.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
