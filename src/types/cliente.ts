/**
 * Tipos del módulo de clientes (coinciden con los schemas del backend).
 *   GET/POST/PUT /clientes
 */

type Money = string | number;

/** Cliente tal como lo devuelve el backend (incluye su deuda total). */
export interface Cliente {
  id: number;
  nombre: string;
  documento: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  nota: string | null;
  fecha_nacimiento: string | null;
  puntos: number;
  is_active: boolean;
  created_at: string;
  deuda_total: Money;
}

/** Payload para crear/actualizar un cliente. */
export interface ClientePayload {
  nombre: string;
  documento?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  nota?: string | null;
  fecha_nacimiento?: string | null;
}

/** Un producto dentro del top de los más comprados por el cliente. */
export interface ProductoFavorito {
  producto_id: number;
  nombre: string;
  marca: string;
  unidades: number;
}

/** Resumen de una compra en el historial reciente del cliente. */
export interface CompraResumen {
  venta_id: number;
  numero_boleta: string;
  fecha: string;
  total: Money;
  metodo_pago: string;
  tipo_pago: string;
  anulada: boolean;
}

/** Perfil 360° del cliente (GET /clientes/{id}/perfil). */
export interface PerfilCliente {
  cliente: Cliente;
  total_compras: number;
  total_gastado: Money;
  ticket_promedio: Money;
  ultima_compra: string | null;
  productos_favoritos: ProductoFavorito[];
  compras_recientes: CompraResumen[];
}

/** Cliente que no compra hace tiempo (GET /clientes/inactivos). */
export interface ClienteInactivo {
  id: number;
  nombre: string;
  telefono: string | null;
  ultima_compra: string | null;
  dias_sin_comprar: number | null;
  total_gastado: Money;
}
