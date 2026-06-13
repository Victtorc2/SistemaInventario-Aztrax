/**
 * Tipos del reporte de rentabilidad.
 *   GET /rentabilidad
 */

type Money = string | number;

export interface RentabilidadProducto {
  // null en la fila agregada de "Ventas libres" (líneas sin producto registrado).
  producto_id: number | null;
  codigo: string;
  nombre: string;
  marca: string;
  modelo: string | null;
  color: string | null;
  unidades_vendidas: number;
  ingresos: Money;
  costo: Money;
  ganancia: Money;
  margen_pct: Money;
}

export interface RentabilidadPeriodo {
  periodo: string;
  ingresos: Money;
  costo: Money;
  ganancia: Money;
  margen_pct: Money;
  ventas: number;
}

export interface RentabilidadResumen {
  ingresos: Money;
  costo: Money;
  ganancia: Money;
  margen_pct: Money;
  unidades_vendidas: number;
}

export interface ReporteRentabilidad {
  desde: string | null;
  hasta: string | null;
  resumen: RentabilidadResumen;
  por_producto: RentabilidadProducto[];
  por_periodo: RentabilidadPeriodo[];
}
