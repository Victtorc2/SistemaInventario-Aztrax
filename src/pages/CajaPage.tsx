/**
 * CajaPage: caja diaria (apertura, movimientos, cierre y arqueo).
 *
 * - Sin caja abierta: formulario para abrirla con un fondo inicial.
 * - Con caja abierta: arqueo en vivo (inicial + ventas en efectivo + ingresos
 *   − egresos), registro de ingresos/egresos manuales y cierre con el conteo
 *   del efectivo (muestra la diferencia).
 * - Historial de las últimas sesiones de caja con su diferencia.
 */

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  LockKeyhole,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext";
import { formatMoney, formatDate } from "@/utils/format";
import * as cajaService from "@/services/cajaService";
import type { Caja, CajaHistorialItem, TipoMovimientoCaja } from "@/types/caja";

function toNum(v: string | number | null): number {
  if (v == null) return 0;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

function Resumen({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper/40 px-4 py-3">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className={`mt-0.5 text-lg font-semibold tabular-nums ${accent ?? "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}

export function CajaPage() {
  const toast = useToast();
  const [caja, setCaja] = useState<Caja | null>(null);
  const [historial, setHistorial] = useState<CajaHistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Formularios.
  const [montoInicial, setMontoInicial] = useState("");
  const [movTipo, setMovTipo] = useState<TipoMovimientoCaja>("ingreso");
  const [movMonto, setMovMonto] = useState("");
  const [movMotivo, setMovMotivo] = useState("");
  const [montoDeclarado, setMontoDeclarado] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [actual, hist] = await Promise.all([
        cajaService.getCajaActual(),
        cajaService.getHistorialCajas(),
      ]);
      setCaja(actual);
      setHistorial(hist);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo cargar la caja");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAbrir = async () => {
    const monto = parseFloat(montoInicial || "0");
    if (Number.isNaN(monto) || monto < 0) {
      toast.error("Ingresa un monto inicial válido");
      return;
    }
    setSubmitting(true);
    try {
      await cajaService.abrirCaja({ monto_inicial: monto });
      setMontoInicial("");
      toast.success("Caja abierta");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo abrir la caja");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMovimiento = async () => {
    const monto = parseFloat(movMonto);
    if (Number.isNaN(monto) || monto <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }
    setSubmitting(true);
    try {
      const actualizada = await cajaService.registrarMovimiento({
        tipo: movTipo,
        monto,
        motivo: movMotivo.trim() || null,
      });
      setCaja(actualizada);
      setMovMonto("");
      setMovMotivo("");
      toast.success("Movimiento registrado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo registrar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCerrar = async () => {
    const monto = parseFloat(montoDeclarado || "0");
    if (Number.isNaN(monto) || monto < 0) {
      toast.error("Ingresa el efectivo contado");
      return;
    }
    setSubmitting(true);
    try {
      await cajaService.cerrarCaja({ monto_declarado: monto });
      setMontoDeclarado("");
      toast.success("Caja cerrada");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo cerrar la caja");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Caja diaria"
      subtitle="Controla el efectivo: apertura, movimientos y arqueo de cierre"
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
          <Loader size={22} label="Cargando caja…" />
        </div>
      ) : caja ? (
        <div className="flex flex-col gap-6">
          {/* Arqueo en vivo */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success text-white">
                <Wallet size={18} />
              </span>
              <div>
                <p className="font-semibold text-ink">Caja abierta</p>
                <p className="text-xs text-ink-faint">
                  Desde {formatDate(caja.abierta_at)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Resumen label="Fondo inicial" value={formatMoney(caja.monto_inicial)} />
              <Resumen
                label="Ventas efectivo"
                value={formatMoney(caja.ventas_efectivo)}
                accent="text-emerald-600"
              />
              <Resumen label="Ingresos" value={formatMoney(caja.total_ingresos)} />
              <Resumen label="Egresos" value={formatMoney(caja.total_egresos)} />
              <Resumen
                label="Esperado en caja"
                value={formatMoney(caja.monto_esperado)}
                accent="text-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Movimiento manual */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-ink">
                Registrar movimiento
              </h3>
              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMovTipo("ingreso")}
                  className={[
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    movTipo === "ingreso"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-line text-ink-soft hover:bg-line/40",
                  ].join(" ")}
                >
                  <ArrowDownCircle size={16} />
                  Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => setMovTipo("egreso")}
                  className={[
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    movTipo === "egreso"
                      ? "border-rose-300 bg-rose-50 text-danger"
                      : "border-line text-ink-soft hover:bg-line/40",
                  ].join(" ")}
                >
                  <ArrowUpCircle size={16} />
                  Egreso
                </button>
              </div>
              <input
                type="number"
                min={0}
                step="0.01"
                value={movMonto}
                onChange={(e) => setMovMonto(e.target.value)}
                placeholder="Monto"
                className="mb-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
              />
              <input
                type="text"
                value={movMotivo}
                onChange={(e) => setMovMotivo(e.target.value)}
                placeholder="Motivo (opcional)"
                className="mb-3 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
              />
              <Button type="button" onClick={handleMovimiento} loading={submitting} fullWidth>
                Agregar movimiento
              </Button>

              {caja.movimientos.length > 0 ? (
                <ul className="mt-4 flex max-h-40 flex-col gap-1.5 overflow-y-auto border-t border-line/60 pt-3">
                  {caja.movimientos.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-ink-faint">
                        {m.motivo || (m.tipo === "ingreso" ? "Ingreso" : "Egreso")}
                      </span>
                      <span
                        className={
                          m.tipo === "ingreso"
                            ? "tabular-nums text-emerald-600"
                            : "tabular-nums text-danger"
                        }
                      >
                        {m.tipo === "ingreso" ? "+" : "−"} {formatMoney(m.monto)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Cierre / arqueo */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold text-ink">
                Cerrar caja (arqueo)
              </h3>
              <p className="mb-3 text-xs text-ink-faint">
                Cuenta el efectivo físico de la caja e ingrésalo. El sistema
                calculará la diferencia contra lo esperado (
                {formatMoney(caja.monto_esperado)}).
              </p>
              <label className="mb-1 block text-xs text-ink-faint">
                Efectivo contado
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={montoDeclarado}
                onChange={(e) => setMontoDeclarado(e.target.value)}
                placeholder="Ej. 450.00"
                className="mb-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
              />
              {montoDeclarado.trim() !== "" ? (
                <p className="mb-3 text-sm">
                  Diferencia:{" "}
                  <span
                    className={
                      toNum(montoDeclarado) - toNum(caja.monto_esperado) === 0
                        ? "font-semibold text-emerald-600"
                        : "font-semibold text-danger"
                    }
                  >
                    {formatMoney(toNum(montoDeclarado) - toNum(caja.monto_esperado))}
                  </span>
                </p>
              ) : null}
              <Button
                type="button"
                variant="danger"
                onClick={handleCerrar}
                loading={submitting}
                fullWidth
              >
                <LockKeyhole size={15} />
                Cerrar caja
              </Button>
            </div>
          </div>

          <CajaHistorial historial={historial} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Abrir caja */}
          <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white">
                <Wallet size={20} />
              </span>
              <div>
                <p className="font-semibold text-ink">No hay caja abierta</p>
                <p className="text-xs text-ink-faint">
                  Abre la caja con el fondo de cambio inicial.
                </p>
              </div>
            </div>
            <label className="mb-1 block text-xs text-ink-faint">
              Fondo inicial
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              placeholder="Ej. 100.00"
              className="mb-3 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm focus:border-accent focus:shadow-focus focus:outline-none"
            />
            <Button type="button" onClick={handleAbrir} loading={submitting} fullWidth>
              Abrir caja
            </Button>
          </div>

          <CajaHistorial historial={historial} />
        </div>
      )}
    </PageContainer>
  );
}

/** Historial de sesiones de caja cerradas. */
function CajaHistorial({ historial }: { historial: CajaHistorialItem[] }) {
  const cerradas = historial.filter((c) => c.estado === "cerrada");
  if (cerradas.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="border-b border-line px-5 py-3">
        <h3 className="text-sm font-semibold text-ink">Sesiones anteriores</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-paper/50">
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-5 py-3 font-medium">Apertura</th>
              <th className="px-5 py-3 font-medium">Cierre</th>
              <th className="px-5 py-3 text-right font-medium">Esperado</th>
              <th className="px-5 py-3 text-right font-medium">Contado</th>
              <th className="px-5 py-3 text-right font-medium">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {cerradas.map((c) => {
              const dif = toNum(c.diferencia);
              return (
                <tr
                  key={c.id}
                  className="border-b border-line/60 last:border-0 hover:bg-paper/60"
                >
                  <td className="px-5 py-3 text-ink-soft">{formatDate(c.abierta_at)}</td>
                  <td className="px-5 py-3 text-ink-soft">
                    {c.cerrada_at ? formatDate(c.cerrada_at) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-ink-soft">
                    {formatMoney(c.monto_esperado ?? 0)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-ink-soft">
                    {formatMoney(c.monto_declarado ?? 0)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={[
                        "font-medium tabular-nums",
                        dif === 0 ? "text-emerald-600" : "text-danger",
                      ].join(" ")}
                    >
                      {formatMoney(dif)}
                    </span>
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
