/**
 * CategoriaForm: formulario de creación/edición de categoría.
 *
 * Validación con React Hook Form + Zod:
 *   - nombre: obligatorio, 2-50 caracteres, sin espacios sobrantes.
 * Se reutiliza para crear (sin `defaultValue`) y editar (con `defaultValue`).
 * El envío real (crear/actualizar) lo decide el componente padre vía
 * `onSubmit`; este componente solo valida y reporta el estado de envío.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";

const categoriaSchema = z.object({
  // .trim() normaliza espacios; luego se validan los límites.
  nombre: z
    .string()
    .trim()
    .min(1, "Nombre requerido")
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
});

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;

interface CategoriaFormProps {
  defaultValue?: string;
  submitting?: boolean;
  onSubmit: (values: CategoriaFormValues) => void;
  onCancel: () => void;
}

export function CategoriaForm({
  defaultValue = "",
  submitting = false,
  onSubmit,
  onCancel,
}: CategoriaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { nombre: defaultValue },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <InputField
        label="Nombre de la categoría"
        placeholder="Ej. Bebidas"
        autoFocus
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      <div className="flex items-center justify-end gap-2">
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
