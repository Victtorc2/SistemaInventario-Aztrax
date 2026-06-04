/**
 * BoletaPreviewPage: vista dedicada de una boleta (ruta /historial/:id/boleta).
 *
 * Carga el detalle de la venta por el id de la URL y muestra la boleta tipo
 * ticket centrada, con acciones de imprimir/descargar/volver. Útil para
 * abrir una boleta en su propia pantalla (p. ej. enlace directo).
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Loader } from "@/components/ui/Loader";
import { BoletaPreview } from "@/components/historial/BoletaPreview";
import { PrintButton } from "@/components/historial/PrintButton";
import { DownloadButton } from "@/components/historial/DownloadButton";
import { useToast } from "@/context/ToastContext";
import * as historialService from "@/services/historialService";
import type { Venta } from "@/types/venta";

export function BoletaPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ventaId = Number(id);
    if (!ventaId) {
      navigate("/historial", { replace: true });
      return;
    }
    let active = true;
    historialService
      .getDetalleVenta(ventaId)
      .then((data) => active && setVenta(data))
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "No se pudo cargar la boleta");
        navigate("/historial", { replace: true });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, navigate, toast]);

  return (
    <PageContainer title="Boleta" subtitle="Comprobante de venta">
      <button
        type="button"
        onClick={() => navigate("/historial")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} />
        Volver al historial
      </button>

      {loading || !venta ? (
        <div className="flex justify-center py-20 text-ink-faint">
          <Loader size={24} label="Cargando boleta…" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="rounded-2xl border border-line bg-white py-4 shadow-card">
            <BoletaPreview ref={printRef} venta={venta} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <PrintButton
              contentRef={printRef}
              documentTitle={`boleta_${venta.numero_boleta}`}
            />
            <DownloadButton ventaId={venta.id} numeroBoleta={venta.numero_boleta} />
          </div>
        </div>
      )}
    </PageContainer>
  );
}
