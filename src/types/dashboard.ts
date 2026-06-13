/**
 * Tipos del módulo de dashboard.
 *
 * Reflejan el contrato del backend FastAPI:
 *   GET /dashboard          -> DashboardCompleto
 *   GET /dashboard/resumen   -> ResumenDashboard
 *
 * Los importes llegan como string o number según el serializador; se tipan
 * como string|number y se normalizan al mostrar.
 */

type Money = string | number;

/** Indicadores rápidos (tarjetas KPI). */
export interface ResumenDashboard {
  ventas_hoy: number;
  monto_hoy: Money;
  ventas_total: number;
  monto_total: Money;
  ticket_promedio: Money;
  productos_activos: number;
  productos_agotados: number;
  productos_bajo_stock: number;
  valor_inventario: Money;
  total_categorias: number;
  total_proveedores: number;
}

/** Punto de la serie temporal de ventas. */
export interface VentaPorDia {
  fecha: string;
  cantidad: number;
  monto: Money;
}

/** Producto en el ranking de más vendidos. */
export interface TopProducto {
  producto_id: number;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string | null;
  color: string | null;
  unidades_vendidas: number;
  monto_vendido: Money;
}

/** Desglose de ventas por método de pago. */
export interface MetodoPagoResumen {
  metodo_pago: string;
  cantidad: number;
  monto: Money;
}

/** Respuesta agregada del dashboard. */
export interface DashboardCompleto {
  resumen: ResumenDashboard;
  ventas_por_dia: VentaPorDia[];
  top_productos: TopProducto[];
  metodos_pago: MetodoPagoResumen[];
}
