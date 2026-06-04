/**
 * useDebounce: devuelve una versión "retrasada" de un valor.
 *
 * Útil para buscadores en tiempo real: en lugar de disparar una petición por
 * cada tecla, se espera `delay` ms tras el último cambio.
 */

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
