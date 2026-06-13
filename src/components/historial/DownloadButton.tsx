/**
 * DownloadButton: descarga el PDF de la boleta desde el backend.
 *
 * Llama a boletaService.downloadBoleta y muestra un toast de éxito/error.
 * Gestiona su propio estado de carga mientras descarga.
 */

import { useState } from "react";
import { Download } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext";
import * as boletaService from "@/services/boletaService";

interface DownloadButtonProps {
  ventaId: number;
  numeroBoleta: string;
}

export function DownloadButton({ ventaId, numeroBoleta }: DownloadButtonProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await boletaService.downloadBoleta(ventaId, numeroBoleta);
      toast.success("Boleta descargada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo descargar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <Loader size={16} /> : <Download size={16} />}
      Descargar PDF
    </button>
  );
}
