/**
 * Tipos del módulo de categorías.
 *
 * Reflejan el contrato del backend FastAPI:
 *   GET    /categorias        -> Categoria[]
 *   POST   /categorias        -> Categoria   (body: { nombre })
 *   PUT    /categorias/{id}    -> Categoria   (body: { nombre })
 *   DELETE /categorias/{id}    -> 204
 */

/** Categoría tal como la devuelve el backend. */
export interface Categoria {
  id: number;
  nombre: string;
  created_at: string;
}

/** Payload para crear o actualizar una categoría. */
export interface CategoriaPayload {
  nombre: string;
}
