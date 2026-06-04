/**
 * Configuración central de navegación.
 *
 * Única fuente de verdad para el menú del Sidebar y para el Breadcrumb.
 * Si se añade un módulo nuevo, basta con registrarlo aquí.
 */

import {
  LayoutDashboard,
  Tags,
  Package,
  Truck,
  ShoppingCart,
  AlertTriangle,
  History,
  Users,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  /** Ruta absoluta del módulo. */
  to: string;
  /** Etiqueta visible en el menú y el breadcrumb. */
  label: string;
  /** Icono de lucide-react. */
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/inicio", label: "Dashboard", icon: LayoutDashboard },
  { to: "/categorias", label: "Categorías", icon: Tags },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/proveedores", label: "Proveedores", icon: Truck },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart },
  { to: "/productos-por-pedir", label: "Productos por pedir", icon: AlertTriangle },
  { to: "/historial", label: "Historial", icon: History },
  { to: "/rentabilidad", label: "Rentabilidad", icon: LineChart },
];

/** Mapa ruta -> etiqueta, usado por el breadcrumb. */
export const ROUTE_LABELS: Record<string, string> = NAV_ITEMS.reduce(
  (acc, item) => {
    acc[item.to] = item.label;
    return acc;
  },
  {} as Record<string, string>,
);
