/**
 * ProveedorForm: formulario de creación/edición de proveedor.
 *
 * Validación con React Hook Form + Zod:
 *   - nombre: obligatorio, 2-100 caracteres.
 *   - telefono: opcional; si se indica, solo dígitos (6-15).
 *   - direccion: opcional, hasta 150.
 *   - ruc: opcional; si se indica, exactamente 11 dígitos.
 *   - observaciones: opcional, hasta 300.
 * Los campos de texto se normalizan (trim) antes de validar. Los opcionales
 * vacíos se transforman a null para enviarlos limpios al backend.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "@/components/ui/InputField";
import { TextareaField } from "@/components/ui/TextareaField";
import { Button } from "@/components/ui/Button";
import type { Proveedor } from "@/types/proveedor";

// Helper: convierte "" a undefined para que los opcionales no fallen.
const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const proveedorSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Nombre requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  telefono: z.preprocess(
    emptyToUndef,
    z
      .string()
      .regex(/^\d{6,15}$/, "Teléfono inválido")
      .optional(),
  ),
  direccion: z.preprocess(
    emptyToUndef,
    z.string().trim().max(150, "Máximo 150 caracteres").optional(),
  ),
  ruc: z.preprocess(
    emptyToUndef,
    z
      .string()
      .regex(/^\d{11}$/, "RUC inválido")
      .optional(),
  ),
  observaciones: z.preprocess(
    emptyToUndef,
    z.string().trim().max(300, "Máximo 300 caracteres").optional(),
  ),
});

export type ProveedorFormValues = z.infer<typeof proveedorSchema>;

interface ProveedorFormProps {
  defaultValues?: Proveedor | null;
  submitting?: boolean;
  onSubmit: (values: ProveedorFormValues) => void;
  onCancel: () => void;
}

export function ProveedorForm({
  defaultValues,
  submitting = false,
  onSubmit,
  onCancel,
}: ProveedorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      telefono: defaultValues?.telefono ?? "",
      direccion: defaultValues?.direccion ?? "",
      ruc: defaultValues?.ruc ?? "",
      observaciones: defaultValues?.observaciones ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <InputField
        label="Nombre"
        placeholder="Ej. Distribuidora Norte"
        autoFocus
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      {/* Teléfono y RUC en dos columnas en pantallas medianas. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Teléfono"
          placeholder="999999999"
          inputMode="numeric"
          error={errors.telefono?.message}
          {...register("telefono")}
        />
        <InputField
          label="RUC"
          placeholder="20456789123"
          inputMode="numeric"
          error={errors.ruc?.message}
          {...register("ruc")}
        />
      </div>

      <InputField
        label="Dirección"
        placeholder="Av. Perú 123"
        error={errors.direccion?.message}
        {...register("direccion")}
      />

      <TextareaField
        label="Observaciones"
        placeholder="Notas adicionales (opcional)"
        error={errors.observaciones?.message}
        {...register("observaciones")}
      />

      <div className="mt-1 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}
