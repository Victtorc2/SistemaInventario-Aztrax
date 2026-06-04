/**
 * PlaceholderPage: página genérica para módulos de fases posteriores.
 * Mantiene la ruta activa y protegida, con un estado "en construcción".
 */

import { Clock } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <PageContainer
      title={title}
      subtitle="Este módulo se implementará en una fase posterior."
    >
      <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-line bg-white/50">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-line/60 text-ink-faint">
            <Clock size={20} />
          </div>
          <p className="text-sm font-medium text-ink-soft">Próximamente</p>
          <p className="mt-1 text-xs text-ink-faint">{title} estará disponible aquí.</p>
        </div>
      </div>
    </PageContainer>
  );
}
