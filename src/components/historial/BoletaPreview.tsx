/**
 * BoletaPreview: representación visual de la boleta tipo ticket peruano.
 *
 * Renderiza en HTML los mismos datos y diseño que el PDF del backend:
 * encabezado del negocio, recuadro del comprobante (RUC + serie-correlativo),
 * datos del cliente, tabla de productos, desglose de IGV (18%), importe en
 * letras, condición/forma de pago y pie legal.
 *
 * Se usa tanto para la vista previa en pantalla como para la impresión
 * (react-to-print toma este nodo vía ref). Usa forwardRef para que el
 * contenedor de impresión pueda referenciarlo.
 */

import { forwardRef } from "react";
import { DATOS_NEGOCIO } from "@/types/historial";
import { formatMoney } from "@/utils/format";
import { montoEnLetras } from "@/utils/numeroLetras";
import type { Venta } from "@/types/venta";

interface BoletaPreviewProps {
  venta: Venta;
}

// IGV peruano (18%). El total YA incluye el IGV; aquí se descompone para
// mostrar el desglose habitual del comprobante.
const IGV_RATE = 0.18;

function toNum(v: string | number): number {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isNaN(n) ? 0 : n;
}

function capitalizar(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
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
    const total = toNum(venta.total);
    const gravada = total / (1 + IGV_RATE);
    const igv = total - gravada;
    const saldo = toNum(venta.saldo_pendiente);

    const cliente = venta.cliente_nombre?.trim() || "Cliente varios";
    const condicion = capitalizar(venta.tipo_pago || "contado");
    const formaPago = capitalizar(venta.metodo_pago || "efectivo");

    return (
      <div
        ref={ref}
        className="mx-auto w-[300px] bg-white px-5 py-6 font-mono text-[12px] leading-relaxed text-ink"
      >
        {/* Encabezado del negocio */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-tight">
            {DATOS_NEGOCIO.nombre}
          </p>
          <p>{DATOS_NEGOCIO.direccion}</p>
          <p>
            {DATOS_NEGOCIO.ciudad} - Tel. {DATOS_NEGOCIO.telefono}
          </p>
        </div>

        {/* Recuadro del comprobante: RUC + tipo + serie-correlativo */}
        <div className="my-2 border border-ink/70 px-2 py-1.5 text-center">
          <p className="font-bold">R.U.C. {DATOS_NEGOCIO.ruc}</p>
          <p className="font-bold">BOLETA DE VENTA ELECTRÓNICA</p>
          <p className="font-bold">{venta.numero_boleta}</p>
        </div>

        {/* Datos de la venta y del cliente */}
        <div className="flex justify-between">
          <span className="font-bold">Fecha:</span>
          <span>{fechaStr}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Hora:</span>
          <span>{horaStr}</span>
        </div>
        <p>
          <span className="font-bold">Cliente:</span> {cliente}
        </p>

        <Divider />

        {/* Cabecera de la tabla */}
        <div className="flex justify-between text-[11px] font-bold">
          <span>CANT DESCRIPCIÓN</span>
          <span>IMPORTE</span>
        </div>

        <Divider />

        {/* Items */}
        {venta.detalles.map((d) => (
          <div key={d.id} className="mb-1.5">
            <p className="truncate">
              {d.producto}
              {d.marca ? ` - ${d.marca}` : ""}
            </p>
            <div className="flex justify-between">
              <span>
                {d.cantidad} x {formatMoney(toNum(d.precio))}
              </span>
              <span>{formatMoney(toNum(d.subtotal))}</span>
            </div>
          </div>
        ))}

        <Divider />

        {/* Totales con desglose de IGV */}
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
        <div className="flex justify-between">
          <span>Op. Gravada:</span>
          <span>{formatMoney(gravada)}</span>
        </div>
        <div className="flex justify-between">
          <span>IGV (18%):</span>
          <span>{formatMoney(igv)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm font-bold">
          <span>TOTAL A PAGAR:</span>
          <span>{formatMoney(total)}</span>
        </div>

        <Divider />

        {/* Importe en letras */}
        <p className="font-bold">SON: {montoEnLetras(total)}</p>

        <Divider />

        {/* Condición / forma de pago */}
        <p>
          <span className="font-bold">Condición:</span> {condicion}
        </p>
        <p>
          <span className="font-bold">Forma de pago:</span> {formaPago}
        </p>
        {saldo > 0 ? (
          <p>
            <span className="font-bold">Saldo pendiente:</span> {formatMoney(saldo)}
          </p>
        ) : null}

        <Divider />

        {/* Pie legal */}
        <p className="text-center text-[10px]">
          Representación impresa de la Boleta de Venta Electrónica.
        </p>
        <p className="mt-1 text-center font-bold">¡Gracias por su compra!</p>
      </div>
    );
  },
);

/** Línea separadora punteada estilo ticket. */
function Divider() {
  return <div className="my-2 border-t border-dashed border-ink/40" />;
}
