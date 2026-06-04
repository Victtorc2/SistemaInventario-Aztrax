# Sistema Inventario — Frontend

## Clientes, fiado y rentabilidad

- **Clientes** (`/clientes`): CRUD con búsqueda, filtro Todos/Con deuda y
  badge de deuda. Estado de cuenta por cliente con sus ventas al crédito y
  registro de abonos (pagos parciales).
- **Venta al crédito**: en la pantalla de ventas, junto al método de pago
  (efectivo/yape) se elige Contado o Crédito; el crédito exige seleccionar
  un cliente y queda como deuda pendiente.
- **Rentabilidad** (`/rentabilidad`): resumen (ingresos, costo, ganancia,
  margen), gráfico de ganancia por periodo (día/mes) y tabla por producto,
  con filtro de fechas.

## Estilo visual

Paleta cálida y amigable manteniendo el minimalismo: acento índigo (#6366f1),
fondo crema con leve tinte lila, tinta con matiz suave (no negro puro) y
acentos de color por tarjeta (verde, azul-cielo, violeta, ámbar, rosa). Toda
la paleta está centralizada en `tailwind.config.js`, por lo que es fácil de
reajustar.

## Integración con backend ampliado

- **Productos: campo `modelo`** (opcional) en el formulario, la tabla y las
  búsquedas.
- **Ventas: forma de pago** efectivo / yape, con selector visual en el panel
  POS, reflejada en el modal de confirmación y enviada en el payload.
- **Dashboard** en la página de inicio: KPIs (ventas, inventario), gráfico de
  ventas por día (recharts), desglose por método de pago y top de productos.
  Carga bajo demanda (code splitting) para no penalizar el arranque.

Panel administrativo del sistema de inventario y ventas. Diseño minimalista
moderno (estilo Notion / Stripe / Vercel), integrado con el backend FastAPI
mediante JWT.

## Stack
React + Vite · TypeScript · React Router DOM · Axios · TailwindCSS ·
React Hook Form + Zod · Context API · lucide-react.

## Fases implementadas
- **Fase 2 — Autenticación JWT**: login, AuthContext, sesión persistente,
  rutas protegidas, logout, interceptores Axios.
- **Fase 3 — Layout principal**: MainLayout con Sidebar (responsive,
  colapsable en móvil), Navbar, Breadcrumb automático y PageContainer.
- **Fase 4 — Categorías (CRUD)**: listar, crear, editar, eliminar y buscar
  (con debounce), modales, toasts, skeleton de carga, estado vacío y
  paginación de 10.
- **Fase 5 — Proveedores (CRUD)**: igual que categorías + campos teléfono,
  dirección, RUC y observaciones, con validaciones específicas (teléfono solo
  dígitos, RUC opcional de 11 dígitos). Tabla en escritorio y tarjetas en
  móvil. Maneja el caso "proveedor asociado a productos" mostrando el toast
  del backend.
- **Fase 6 — Productos (CRUD)**: inventario completo con selects dinámicos de
  categoría y proveedor, código y estado autogenerados por el backend, precios
  en soles, filtros combinables (categoría/proveedor/estado), búsqueda por
  nombre o código (debounce) y badges de estado (disponible/bajo stock/agotado).
- **Fase 7 — Productos por pedir**: vista de reposición que consume
  /productos/por-pedir (agotados primero), con filtro por estado, búsqueda y
  botón de exportación (CSV funcional; PDF/Excel con interfaz preparada).
- **Fases 8-9 — Ventas + Descuentos (POS)**: flujo tipo punto de venta con
  layout 70/30 (productos | resumen sticky), carrito (useCart) con
  anti-duplicados y tope de stock, selector de cantidad, descuentos por monto
  o porcentaje (calculateDiscount centralizado), subtotal/total automáticos,
  validaciones, modales de confirmar/cancelar y POST /ventas.
- **Fases 10-11 — Historial + Boleta**: listado paginado de ventas (server-side)
  con búsqueda por número de boleta y filtros por fecha (exacta o rango),
  detalle completo (productos, cantidades, precios, totales), boleta tipo
  ticket peruano renderizada en HTML con impresión vía react-to-print y
  descarga del PDF binario generado por el backend.
- **Fase 12 — UI/UX y optimización**: indicadores rápidos del historial
  (HistorialStats), tabla ampliada (subtotal + descuento), componentes
  reutilizables nuevos (`Pagination`, `EmptyState`, `ConfirmModal`,
  skeletons), manejador centralizado de errores (`utils/errorHandler.ts`
  con mapeo de 401/403/404/422/5xx), code splitting con React.lazy + Suspense
  por ruta (bundle inicial reduce ~25%), memoización (memo + useCallback) y
  mejoras de accesibilidad (focus-visible, aria-labels).

## Estructura
```
src/
├── api/axiosClient.ts            # Axios + interceptores JWT
├── components/
│   ├── auth/                     # LoginForm, LogoutButton
│   ├── layout/                   # Sidebar, Navbar, Breadcrumb, MenuItem, PageContainer
│   ├── categorias/               # Form, Table, Modal, Delete, Search
│   ├── proveedores/              # Form, Table, Card, Modal, Delete, Search
│   ├── productos/                # Form, Table, Modal, Delete, Filters, Search, StockBadge, Empty
│   ├── reposicion/               # Table, Filters, Search, ExportButton, EstadoBadge
│   ├── ventas/                   # Search, ProductoVentaTable, Carrito, CantidadSelector,
│   │                             #   Discount, Resumen, TotalCard, Confirm/Cancel, EmptyCart
│   ├── historial/                # Table, Filters, Search, Stats, DetalleModal, BoletaModal,
│   │                             #   BoletaPreview, BoletaActions, Print/Download
│   └── ui/                       # Button, InputField, TextareaField, SelectField, Loader,
│                                 #   Modal, ConfirmModal, EmptyState, Pagination,
│                                 #   skeletons/{Table,Card,Form}
├── context/                      # AuthContext, ToastContext
├── hooks/                        # useAuth, useDebounce, useCatalogos, useCart
├── layouts/                      # AuthLayout, MainLayout
├── pages/                        # Login, Inicio, Categorias, Placeholder, AccessDenied
├── routes/                       # ProtectedRoute, PublicRoute, AppRoutes
├── services/                     # auth/categoria/proveedor/producto/reposicion/venta/historial/boletaService
├── types/                        # auth, categoria, proveedor, producto, venta, cart, historial
└── utils/                        # auth (token), navigation, format, discount, errorHandler
```

## Configuración
```bash
cp .env.example .env     # VITE_API_URL=http://localhost:8000
npm install
npm run dev              # desarrollo (http://localhost:5173)
npm run build            # build de producción
```

## Rutas
`/` → `/inicio` · `/login` (pública) · protegidas: `/inicio`, `/categorias`,
`/productos`, `/proveedores`, `/ventas`, `/productos-por-pedir`, `/historial`.

## Credenciales de prueba
correo `admin@sistema.com` · password `admin123`

> Nota: la columna "Productos" de la tabla de categorías se muestra como "—"
> porque el endpoint actual del backend no devuelve ese conteo. Cuando lo
> exponga (p. ej. `productos_count`), se lee directamente en CategoriaTable.
