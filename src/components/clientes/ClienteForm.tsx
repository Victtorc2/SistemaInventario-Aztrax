/**
 * ClienteForm: formulario de creación/edición de cliente.
 *
 * Validación con React Hook Form + Zod:
 *   - nombre: obligatorio (2-150).
 *   - documento: opcional; si se indica, 8-11 dígitos (DNI/RUC).
 *   - telefono: opcional; si se indica, 6-15 dígitos.
 *   - email: opcional; formato email.
 *   - direccion, nota: opcionales.
 * Los opcionales vacíos se transforman a undefined para no fallar la validación.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "@/components/ui/InputField";
import { TextareaField } from "@/components/ui/TextareaField";
import { Button } from "@/components/ui/Button";
import type { Cliente } from "@/types/cliente";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const clienteSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Nombre requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(150, "Máximo 150 caracteres"),
  documento: z.preprocess(
    emptyToUndef,
    z.string().regex(/^\d{8,11}$/, "Documento inválido (8-11 dígitos)").optional(),
  ),
  telefono: z.preprocess(
    emptyToUndef,
    z.string().regex(/^\d{6,15}$/, "Teléfono inválido").optional(),
  ),
  email: z.preprocess(
    emptyToUndef,
    z.string().email("Email inválido").max(120).optional(),
  ),
  direccion: z.preprocess(
    emptyToUndef,
    z.string().trim().max(200, "Máximo 200 caracteres").optional(),
  ),
  nota: z.preprocess(
    emptyToUndef,
    z.string().trim().max(255, "Máximo 255 caracteres").optional(),
  ),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  defaultValues?: Cliente | null;
  submitting?: boolean;
  onSubmit: (values: ClienteFormValues) => void;
  onCancel: () => void;
}

export function ClienteForm({
  defaultValues,
  submitting = false,
  onSubmit,
  onCancel,
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      documento: defaultValues?.documento ?? undefined,
      telefono: defaultValues?.telefono ?? undefined,
      email: defaultValues?.email ?? undefined,
      direccion: defaultValues?.direccion ?? undefined,
      nota: defaultValues?.nota ?? undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <InputField
        label="Nombre"
        placeholder="Ej. Juan Pérez"
        autoFocus
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Documento (DNI/RUC)"
          placeholder="Ej. 12345678"
          error={errors.documento?.message}
          {...register("documento")}
        />
        <InputField
          label="Teléfono"
          placeholder="Ej. 999888777"
          error={errors.telefono?.message}
          {...register("telefono")}
        />
      </div>

      <InputField
        label="Email"
        placeholder="Ej. cliente@correo.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <InputField
        label="Dirección"
        placeholder="Ej. Av. Pesca 123"
        error={errors.direccion?.message}
        {...register("direccion")}
      />

      <TextareaField
        label="Nota"
        placeholder="Ej. Cliente frecuente, pesca de altura"
        rows={2}
        error={errors.nota?.message}
        {...register("nota")}
      />

      <div className="mt-2 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          {defaultValues ? "Guardar cambios" : "Crear cliente"}
        </Button>
      </div>
    </form>
  );
}
