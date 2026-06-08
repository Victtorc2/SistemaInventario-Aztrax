/**
 * VentasPage: pantalla principal de ventas (POS).
 *
 * Layout dividido: izquierda (70%) búsqueda + resultados de productos;
 * derecha (30%) panel sticky con carrito, descuento, resumen y acciones.
 *
 * Flujo: buscar -> agregar al carrito -> ajustar cantidades -> aplicar
 * descuento -> confirmar -> POST /ventas. Toda la lógica del carrito vive en
 * useCart; los cálculos en utils/discount. La página solo coordina UI, toasts
 * y la llamada al backend.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchProductoVenta } from "@/components/ventas/SearchProductoVenta";
import { ProductoVentaTable } from "@/components/ventas/ProductoVentaTable";
import { TotalCard } from "@/components/ventas/TotalCard";
import { ConfirmVentaModal } from "@/components/ventas/ConfirmVentaModal";
import { CancelVentaModal } from "@/components/ventas/CancelVentaModal";
import { LineaLibreModal } from "@/components/ventas/LineaLibreModal";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/context/ToastContext";
import { validateDiscount } from "@/utils/discount";
import * as productoService from "@/services/productoService";
import * as ventaService from "@/services/ventaService";
import * as clienteService from "@/services/clienteService";
import type { Producto } from "@/types/producto";
import { cartItemKey, type CartItem } from "@/types/cart";
import type { Cliente } from "@/types/cliente";

export function VentasPage() {
  const toast = useToast();
  const cart = useCart();

  // --- Búsqueda de productos ---
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Clientes (para ventas al crédito) ---
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesLoading, setClientesLoading] = useState(true);

  // --- Modales / envío ---
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [libreOpen, setLibreOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Carga de clientes (una vez).
  useEffect(() => {
    let active = true;
    clienteService
      .getClientes()
      .then((data) => active && setClientes(data))
      .catch(() => active && setClientes([]))
      .finally(() => active && setClientesLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Carga inicial y búsqueda. Vacío = lista general; con término = /buscar.
  const loadProductos = useCallback(async (term: string) => {
    setLoading(true);
    try {
      const data = term.trim()
        ? await productoService.searchProductos(term.trim())
        : await productoService.getProductos();
      setResultados(data);
    } catch {
      toast.error("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadProductos(debouncedSearch);
  }, [debouncedSearch, loadProductos]);

  // Validación de descuento (memoizada) contra el subtotal actual.
  const discountError = useMemo(
    () => validateDiscount(cart.totals.subtotal, cart.descuento),
    [cart.totals.subtotal, cart.descuento],
  );

  // Validación de crédito: si es a crédito, debe haber un cliente elegido.
  const clienteError = useMemo(
    () =>
      cart.tipoPago === "credito" && cart.clienteId == null
        ? "Selecciona un cliente para la venta al crédito"
        : null,
    [cart.tipoPago, cart.clienteId],
  );

  // --- Handlers de carrito ---
  const handleAdd = (producto: Producto) => {
    const result = cart.addItem(producto);
    if (result === "out_of_stock") {
      toast.warning("Producto agotado");
    } else if (result === "max_stock") {
      toast.warning("Alcanzaste el stock disponible");
    } else if (result === "incremented") {
      toast.success("Cantidad actualizada");
    } else {
      toast.success("Producto agregado");
    }
  };

  const handleRemove = (item: CartItem) => {
    cart.removeItem(cartItemKey(item));
    toast.info("Producto eliminado");
  };

  // Agrega una línea libre (producto no registrado) al carrito.
  const handleAddLibre = (data: Parameters<typeof cart.addLibre>[0]) => {
    cart.addLibre(data);
    toast.success("Línea libre agregada");
  };

  // --- Confirmar venta ---
  const handleConfirm = async () => {
    if (cart.isEmpty) {
      toast.warning("Carrito vacío");
      return;
    }
    if (discountError) {
      toast.error(discountError);
      return;
    }
    if (clienteError) {
      toast.error(clienteError);
      return;
    }
    setSubmitting(true);
    try {
      const payload = ventaService.buildVentaPayload(cart.items, cart.descuento, {
        metodoPago: cart.metodoPago,
        tipoPago: cart.tipoPago,
        clienteId: cart.clienteId,
        clienteNombre: cart.clienteNombre,
        clienteDocumento: cart.clienteDocumento,
      });
      const venta = await ventaService.createVenta(payload);
      const credito = venta.tipo_pago === "credito";
      toast.success(
        credito
          ? `Venta al crédito registrada · ${venta.numero_boleta}`
          : `Venta registrada · ${venta.numero_boleta}`,
      );
      cart.clear();
      setConfirmOpen(false);
      // Refrescamos resultados para reflejar el stock descontado.
      await loadProductos(debouncedSearch);
      // Recargamos clientes: refleja la nueva deuda (crédito) y hace que un
      // cliente recién creado en una venta al contado aparezca en el selector.
      clienteService.getClientes().then(setClientes).catch(() => {});
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo registrar la venta");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Cancelar venta ---
  const handleCancel = () => {
    cart.clear();
    setCancelOpen(false);
    toast.info("Venta cancelada");
  };

  const openConfirm = () => {
    if (cart.isEmpty) {
      toast.warning("Carrito vacío");
      return;
    }
    if (discountError) {
      toast.error(discountError);
      return;
    }
    if (clienteError) {
      toast.error(clienteError);
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <PageContainer
      title="Nueva venta"
      subtitle="Busca y agrega productos al carrito"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* --- Izquierda: productos --- */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchProductoVenta value={search} onChange={setSearch} />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLibreOpen(true)}
              title="Vender algo que no está registrado en el inventario"
            >
              <PlusCircle size={16} />
              Línea libre
            </Button>
          </div>
          <ProductoVentaTable
            productos={resultados}
            loading={loading}
            onAdd={handleAdd}
          />
        </div>

        {/* --- Derecha: resumen (sticky) --- */}
        <TotalCard
          items={cart.items}
          totals={cart.totals}
          descuento={cart.descuento}
          metodoPago={cart.metodoPago}
          tipoPago={cart.tipoPago}
          clienteId={cart.clienteId}
          clientes={clientes}
          clientesLoading={clientesLoading}
          clienteError={clienteError}
          clienteNombre={cart.clienteNombre}
          clienteDocumento={cart.clienteDocumento}
          discountError={discountError}
          submitting={submitting}
          onIncrement={cart.increment}
          onDecrement={cart.decrement}
          onRemove={handleRemove}
          onDescuentoTipo={(tipo) => cart.setDescuento(tipo, cart.descuento.valor)}
          onDescuentoValor={(valor) => cart.setDescuento(cart.descuento.tipo, valor)}
          onMetodoPago={cart.setMetodoPago}
          onTipoPago={cart.setTipoPago}
          onCliente={cart.setClienteId}
          onNombreChange={cart.setClienteNombre}
          onDocumentoChange={cart.setClienteDocumento}
          onCancel={() => setCancelOpen(true)}
          onConfirm={openConfirm}
        />
      </div>

      <ConfirmVentaModal
        open={confirmOpen}
        totals={cart.totals}
        metodoPago={cart.metodoPago}
        submitting={submitting}
        onConfirm={handleConfirm}
        onClose={() => {
          if (!submitting) setConfirmOpen(false);
        }}
      />

      <CancelVentaModal
        open={cancelOpen}
        onConfirm={handleCancel}
        onClose={() => setCancelOpen(false)}
      />

      <LineaLibreModal
        open={libreOpen}
        onClose={() => setLibreOpen(false)}
        onAdd={handleAddLibre}
      />
    </PageContainer>
  );
}
