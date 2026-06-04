/**
 * useCatalogos: carga las listas de categorías y proveedores.
 *
 * Se usan para poblar los selects del formulario de producto y los filtros.
 * Se cargan una vez al montar el componente que lo use. Devuelve también el
 * estado de carga por si la UI quiere mostrar un indicador.
 */

import { useEffect, useState } from "react";
import * as categoriaService from "@/services/categoriaService";
import * as proveedorService from "@/services/proveedorService";
import type { Categoria } from "@/types/categoria";
import type { Proveedor } from "@/types/proveedor";

interface Catalogos {
  categorias: Categoria[];
  proveedores: Proveedor[];
  loading: boolean;
}

export function useCatalogos(): Catalogos {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Cargamos ambos catálogos en paralelo.
        const [cats, provs] = await Promise.all([
          categoriaService.getCategorias(),
          proveedorService.getProveedores(),
        ]);
        if (active) {
          setCategorias(cats);
          setProveedores(provs);
        }
      } catch {
        // Silencioso: los selects quedarán vacíos y la página mostrará error
        // al cargar productos si el backend está caído.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { categorias, proveedores, loading };
}
