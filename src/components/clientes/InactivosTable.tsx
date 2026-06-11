/**
 * InactivosTable: clientes que no compran hace tiempo (candidatos a recuperar).
 *
 * Muestra última compra, días sin comprar y total histórico gastado, con un
 * acceso directo a WhatsApp para enviarles una promo y traerlos de vuelta.
 */

import { MessageCircle } from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeletons/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserCheck } from "lucide-react";
import { formatMoney, formatDate } from "@/utils/format";
import type { ClienteInactivo } from "@/types/cliente";

interface InactivosTableProps {
  inactivos: ClienteInactivo[];
  loading: boolean;
}

/** Construye el enlace de WhatsApp con un mensaje de reenganche. */
function whatsappLink(telefono: string, nombre: string): string {
  const numero = telefono.replace(/\D/g, "");
  const num = numero.startsWith("51") ? numero : `51${numero}`;
  const msg = `Hola ${nombre}, ¡te extrañamos en la tienda! Tenemos novedades de pesca para ti 🎣`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

export function InactivosTable({ inactivos, loading }: InactivosTableProps) {
  if (loading) return <TableSkeleton rows={6} columns={5} />;

  if (inactivos.length === 0) {
    return (
      <EmptyState
        icon={UserCheck}
        title="No hay clientes inactivos"
        description="Todos tus clientes con compras han vuelto recientemente. ¡Buen trabajo!"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-paper/50">
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Última compra</th>
              <th className="px-5 py-3 text-center font-medium">Sin comprar</th>
              <th className="px-5 py-3 text-right font-medium">Total gastado</th>
              <th className="px-5 py-3 text-right font-medium">Contactar</th>
            </tr>
          </thead>
          <tbody>
            {inactivos.map((c) => (
              <tr
                key={c.id}
                className="border-b border-line/60 transition-colors last:border-0 hover:bg-paper/60"
              >
                <td className="px-5 py-4 font-medium text-ink">{c.nombre}</td>
                <td className="px-5 py-4 text-ink-soft">
                  {c.ultima_compra ? formatDate(c.ultima_compra) : "—"}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-amber-700">
                    {c.dias_sin_comprar ?? "—"} días
                  </span>
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-ink-soft">
                  {formatMoney(c.total_gastado)}
                </td>
                <td className="px-5 py-4 text-right">
                  {c.telefono ? (
                    <a
                      href={whatsappLink(c.telefono, c.nombre)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                      <MessageCircle size={14} />
                      WhatsApp
                    </a>
                  ) : (
                    <span className="text-xs text-ink-faint">Sin teléfono</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
