/**
 * TipoPagoSelector: elige si la venta es al contado o al crédito (fiado).
 *
 * Cuando se elige "Crédito", aparece un selector de cliente (obligatorio).
 * Es controlado: los valores y callbacks vienen del padre (useCart + página).
 */

import { Coins, NotebookPen } from "lucide-react";
import type { TipoPago } from "@/types/cart";
import type { Cliente } from "@/types/cliente";

interface TipoPagoSelectorProps {
  value: TipoPago;
  clienteId: number | null;
  clientes: Cliente[];
  clientesLoading: boolean;
  error?: string | null;
  clienteNombre: string;
  clienteDocumento: string;
  onTipoChange: (tipo: TipoPago) => void;
  onClienteChange: (clienteId: number | null) => void;
  onNombreChange: (v: string) => void;
  onDocumentoChange: (v: string) => void;
}

const OPCIONES: { value: TipoPago; label: string; icon: typeof Coins }[] = [
  { value: "contado", label: "Contado", icon: Coins },
  { value: "credito", label: "Crédito", icon: NotebookPen },
];

export function TipoPagoSelector({
  value,
  clienteId,
  clientes,
  clientesLoading,
  error,
  clienteNombre,
  clienteDocumento,
  onTipoChange,
  onClienteChange,
  onNombreChange,
  onDocumentoChange,
}: TipoPagoSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
        Tipo de pago
      </span>
      <div role="radiogroup" aria-label="Tipo de pago" className="grid grid-cols-2 gap-2">
        {OPCIONES.map(({ value: v, label, icon: Icon }) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onTipoChange(v)}
              className={[
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5",
                "text-sm font-medium transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                active
                  ? "border-accent bg-accent text-white shadow-sm"
                  : "border-line bg-white text-ink-soft hover:border-accent/40 hover:bg-paper/60",
              ].join(" ")}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Selector de cliente (solo en crédito) */}
      {value === "credito" ? (
        <div className="mt-1">
          <select
            value={clienteId ?? ""}
            onChange={(e) =>
              onClienteChange(e.target.value ? Number(e.target.value) : null)
            }
            disabled={clientesLoading}
            aria-label="Cliente del crédito"
            className={[
              "w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
              error ? "border-danger" : "border-line",
              clienteId ? "text-ink" : "text-ink-faint",
            ].join(" ")}
          >
            <option value="">
              {clientesLoading ? "Cargando clientes…" : "Selecciona un cliente…"}
            </option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
                {c.documento ? ` · ${c.documento}` : ""}
              </option>
            ))}
          </select>
          {error ? (
            <p className="mt-1 text-xs text-danger">{error}</p>
          ) : (
            <p className="mt-1 text-xs text-ink-faint">
              La venta quedará como deuda pendiente del cliente.
            </p>
          )}
        </div>
      ) : null}

      {/* Cliente en contado: elegir uno registrado O crear uno nuevo (opcional) */}
      {value === "contado" ? (
        <div className="mt-1 rounded-xl border border-line bg-paper/40 p-3">
          <p className="mb-2 text-xs font-medium text-ink-soft">
            Cliente <span className="text-ink-faint">(opcional)</span>
          </p>

          {/* 1) Seleccionar un cliente ya registrado */}
          <select
            value={clienteId ?? ""}
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : null;
              onClienteChange(id);
              // Al elegir un registrado, limpiamos los datos rápidos.
              if (id) {
                onNombreChange("");
                onDocumentoChange("");
              }
            }}
            disabled={clientesLoading}
            aria-label="Cliente registrado"
            className={[
              "w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
              "border-line",
              clienteId ? "text-ink" : "text-ink-faint",
            ].join(" ")}
          >
            <option value="">
              {clientesLoading
                ? "Cargando clientes…"
                : "Cliente registrado…"}
            </option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
                {c.documento ? ` · ${c.documento}` : ""}
              </option>
            ))}
          </select>

          {/* 2) O registrar uno nuevo (se oculta si ya se eligió uno registrado) */}
          {clienteId == null ? (
            <>
              <p className="my-2 text-center text-[11px] uppercase tracking-wide text-ink-faint">
                o registra uno nuevo
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={clienteNombre}
                  onChange={(e) => onNombreChange(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={clienteDocumento}
                  onChange={(e) => onDocumentoChange(e.target.value)}
                  placeholder="DNI / RUC"
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-faint">
                Si lo registras, el cliente se guarda y podrás completar sus
                datos en el módulo de Clientes.
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onClienteChange(null)}
              className="mt-2 text-xs font-medium text-accent hover:underline"
            >
              Quitar cliente seleccionado
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
