/**
 * MainLayout: estructura visual principal de la app autenticada.
 *
 * Compone el Sidebar (fijo en escritorio, deslizante en móvil), el Navbar
 * superior y el área de contenido dinámico (<Outlet />). Gestiona el estado
 * de apertura del sidebar en móvil.
 */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* El contenido se desplaza para dejar sitio al sidebar fijo (md+). */}
      <div className="md:pl-64">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
