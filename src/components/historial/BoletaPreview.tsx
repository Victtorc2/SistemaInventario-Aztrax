/**
 * BoletaPreview: representación visual de la boleta tipo ticket peruano.
 *
 * Renderiza en HTML los mismos datos que el PDF del backend: encabezado del
 * negocio, número de boleta, fecha/hora, tabla de productos y totales en S/.
 * Se usa tanto para la vista previa en pantalla como para la impresión
 * (react-to-print toma este nodo vía ref).
 *
 * Usa forwardRef para que el contenedor de impresión pueda referenciarlo.
 */

import { forwardRef } from "react";
import { DATOS_NEGOCIO } from "@/types/historial";
import { formatMoney } from "@/utils/format";
import type { Venta } from "@/types/venta";

interface BoletaPreviewProps {
  venta: Venta;
}

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

export const BoletaPreview = forwardRef<HTMLDivElement, BoletaPreviewProps>(
  function BoletaPreview({ venta }, ref) {
    const fecha = new Date(venta.fecha);
    const fechaStr = fecha.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaStr = fecha.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const descuento = toNum(venta.descuento);

    return (
      <div
        ref={ref}
        className="mx-auto w-[300px] bg-white px-5 py-6 font-mono text-[12px] leading-relaxed text-ink"
      >
        {/* Encabezado del negocio */}
        <div className="text-center">
          <p className="text-sm font-bold tracking-tight">
            {DATOS_NEGOCIO.nombre}
          </p>
          <p>RUC: {DATOS_NEGOCIO.ruc}</p>
          <p>{DATOS_NEGOCIO.direccion}</p>
          <p>{DATOS_NEGOCIO.ciudad}</p>
          <p>Tel: {DATOS_NEGOCIO.telefono}</p>
        </div>

        <Divider />

        {/* Tipo de comprobante + número */}
        <div className="text-center">
          <p className="font-bold">BOLETA DE VENTA ELECTRÓNICA</p>
          <p className="font-bold">{venta.numero_boleta}</p>
        </div>

        <Divider />

        {/* Datos de la venta */}
        <div className="flex justify-between">
          <span>Fecha:</span>
          <span>{fechaStr}</span>
        </div>
        <div className="flex justify-between">
          <span>Hora:</span>
          <span>{horaStr}</span>
        </div>

        <Divider />

        {/* Cabecera de la tabla */}
        <div className="flex justify-between font-bold">
          <span>Descripción</span>
          <span>Importe</span>
        </div>

        <Divider />

        {/* Items */}
        {venta.detalles.map((d) => (
          <div key={d.id} className="mb-1.5">
            <p className="truncate">
              {d.producto}
              {d.marca ? ` (${d.marca})` : ""}
            </p>
            <div className="flex justify-between">
              <span>
                {"  "}
                {d.cantidad} x {formatMoney(toNum(d.precio))}
              </span>
              <span>{formatMoney(toNum(d.subtotal))}</span>
            </div>
          </div>
        ))}

        <Divider />

        {/* Totales */}
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatMoney(toNum(venta.subtotal))}</span>
        </div>
        {descuento > 0 ? (
          <div className="flex justify-between">
            <span>Descuento:</span>
            <span>- {formatMoney(descuento)}</span>
          </div>
        ) : null}
        <div className="mt-1 flex justify-between text-sm font-bold">
          <span>TOTAL:</span>
          <span>{formatMoney(toNum(venta.total))}</span>
        </div>

        <Divider />

        <p className="text-center font-bold">¡Gracias por su compra!</p>
      </div>
    );
  },
);

/** Línea separadora punteada estilo ticket. */
function Divider() {
  return <div className="my-2 border-t border-dashed border-ink/40" />;
}
