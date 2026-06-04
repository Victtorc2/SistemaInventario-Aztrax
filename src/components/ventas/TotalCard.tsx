/**
 * TotalCard: panel lateral (sticky) del resumen de venta.
 *
 * Reúne el carrito, los controles de descuento, el resumen numérico y los
 * botones Cancelar / Confirmar. Es el lado derecho del layout POS. Toda la
 * lógica vive en el hook useCart (pasado desde la página); este componente
 * solo compone y delega.
 */

import { CarritoTable } from "@/components/ventas/CarritoTable";
import { EmptyCart } from "@/components/ventas/EmptyCart";
import { DiscountControls } from "@/components/ventas/DiscountControls";
import { MetodoPagoSelector } from "@/components/ventas/MetodoPagoSelector";
import { TipoPagoSelector } from "@/components/ventas/TipoPagoSelector";
import { ResumenVenta } from "@/components/ventas/ResumenVenta";
import { Button } from "@/components/ui/Button";
import type {
  CartItem,
  CartTotals,
  DescuentoState,
  DescuentoTipo,
  MetodoPago,
  TipoPago,
} from "@/types/cart";
import type { Cliente } from "@/types/cliente";

interface TotalCardProps {
  items: CartItem[];
  totals: CartTotals;
  descuento: DescuentoState;
  metodoPago: MetodoPago;
  tipoPago: TipoPago;
  clienteId: number | null;
  clientes: Cliente[];
  clientesLoading: boolean;
  clienteError: string | null;
  clienteNombre: string;
  clienteDocumento: string;
  discountError: string | null;
  submitting: boolean;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (item: CartItem) => void;
  onDescuentoTipo: (tipo: DescuentoTipo) => void;
  onDescuentoValor: (valor: number) => void;
  onMetodoPago: (metodo: MetodoPago) => void;
  onTipoPago: (tipo: TipoPago) => void;
  onCliente: (clienteId: number | null) => void;
  onNombreChange: (v: string) => void;
  onDocumentoChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function TotalCard({
  items,
  totals,
  descuento,
  metodoPago,
  tipoPago,
  clienteId,
  clientes,
  clientesLoading,
  clienteError,
  clienteNombre,
  clienteDocumento,
  discountError,
  submitting,
  onIncrement,
  onDecrement,
  onRemove,
  onDescuentoTipo,
  onDescuentoValor,
  onMetodoPago,
  onTipoPago,
  onCliente,
  onNombreChange,
  onDocumentoChange,
  onCancel,
  onConfirm,
}: TotalCardProps) {
  const empty = items.length === 0;

  return (
    <div className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="shrink-0 border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-semibold tracking-tight">Resumen de venta</h2>
      </div>

      {empty ? (
        <EmptyCart />
      ) : (
        <>
          {/* Zona con scroll: carrito + controles + resumen.
              Si el contenido no entra en la pantalla, scrollea aquí; los
              botones de acción quedan siempre visibles abajo. */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <CarritoTable
              items={items}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />

            <div className="mt-4 space-y-4 border-t border-line pt-4">
              <DiscountControls
                tipo={descuento.tipo}
                valor={descuento.valor}
                error={discountError}
                onTipoChange={onDescuentoTipo}
                onValorChange={onDescuentoValor}
              />

              <MetodoPagoSelector value={metodoPago} onChange={onMetodoPago} />

              <TipoPagoSelector
                value={tipoPago}
                clienteId={clienteId}
                clientes={clientes}
                clientesLoading={clientesLoading}
                error={clienteError}
                clienteNombre={clienteNombre}
                clienteDocumento={clienteDocumento}
                onTipoChange={onTipoPago}
                onClienteChange={onCliente}
                onNombreChange={onNombreChange}
                onDocumentoChange={onDocumentoChange}
              />

              <ResumenVenta totals={totals} />
            </div>
          </div>

          {/* Acciones: pinneadas abajo, siempre visibles */}
          <div className="shrink-0 border-t border-line px-5 py-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={onCancel}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                fullWidth
                onClick={onConfirm}
                loading={submitting}
                disabled={Boolean(discountError)}
              >
                Confirmar venta
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
