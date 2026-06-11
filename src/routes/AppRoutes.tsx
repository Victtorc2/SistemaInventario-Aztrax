/**
 * AppRoutes: árbol de rutas de la aplicación.
 *
 * Las páginas grandes se cargan bajo demanda con React.lazy + Suspense
 * (code splitting), reduciendo el bundle inicial. Las páginas pequeñas
 * (Inicio, Login, AccessDenied) se importan eagerly para evitar parpadeo
 * al entrar a la app.
 */

import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { LoginPage } from "@/pages/LoginPage";
import { AccessDenied } from "@/pages/AccessDenied";
import { Loader } from "@/components/ui/Loader";

// Páginas pesadas: code splitting.
const InicioPage = lazy(() =>
  import("@/pages/InicioPage").then((m) => ({ default: m.InicioPage })),
);
const CategoriasPage = lazy(() =>
  import("@/pages/CategoriasPage").then((m) => ({ default: m.CategoriasPage })),
);
const ProveedoresPage = lazy(() =>
  import("@/pages/ProveedoresPage").then((m) => ({ default: m.ProveedoresPage })),
);
const ProductosPage = lazy(() =>
  import("@/pages/ProductosPage").then((m) => ({ default: m.ProductosPage })),
);
const ProductosPorPedirPage = lazy(() =>
  import("@/pages/ProductosPorPedirPage").then((m) => ({
    default: m.ProductosPorPedirPage,
  })),
);
const VentasPage = lazy(() =>
  import("@/pages/VentasPage").then((m) => ({ default: m.VentasPage })),
);
const HistorialPage = lazy(() =>
  import("@/pages/HistorialPage").then((m) => ({ default: m.HistorialPage })),
);
const ClientesPage = lazy(() =>
  import("@/pages/ClientesPage").then((m) => ({ default: m.ClientesPage })),
);
const CajaPage = lazy(() =>
  import("@/pages/CajaPage").then((m) => ({ default: m.CajaPage })),
);
const RentabilidadPage = lazy(() =>
  import("@/pages/RentabilidadPage").then((m) => ({ default: m.RentabilidadPage })),
);
const BoletaPreviewPage = lazy(() =>
  import("@/pages/BoletaPreviewPage").then((m) => ({
    default: m.BoletaPreviewPage,
  })),
);

/** Fallback mientras se descarga el bundle de una página lazy. */
function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-ink-faint">
      <Loader size={22} label="Cargando…" />
    </div>
  );
}

/** Envuelve un element en Suspense para code splitting. */
const lazyRoute = (node: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/inicio" element={lazyRoute(<InicioPage />)} />
          <Route path="/categorias" element={lazyRoute(<CategoriasPage />)} />
          <Route path="/productos" element={lazyRoute(<ProductosPage />)} />
          <Route path="/proveedores" element={lazyRoute(<ProveedoresPage />)} />
          <Route path="/ventas" element={lazyRoute(<VentasPage />)} />
          <Route path="/clientes" element={lazyRoute(<ClientesPage />)} />
          <Route path="/caja" element={lazyRoute(<CajaPage />)} />
          <Route path="/rentabilidad" element={lazyRoute(<RentabilidadPage />)} />
          <Route
            path="/productos-por-pedir"
            element={lazyRoute(<ProductosPorPedirPage />)}
          />
          <Route path="/historial" element={lazyRoute(<HistorialPage />)} />
          <Route
            path="/historial/:id/boleta"
            element={lazyRoute(<BoletaPreviewPage />)}
          />
        </Route>
      </Route>

      <Route path="/denied" element={<AccessDenied />} />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}
