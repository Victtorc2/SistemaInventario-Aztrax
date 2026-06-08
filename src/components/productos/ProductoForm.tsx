/**
 * ProductoForm: formulario de creación/edición de producto.
 *
 * Validación con React Hook Form + Zod:
 *   - nombre, marca: obligatorios.
 *   - categoria_id, proveedor_id: obligatorios (selects dinámicos).
 *   - precio_compra, precio_venta: > 0.
 *   - stock, stock_minimo: >= 0 (enteros).
 * Los selects de categoría y proveedor se pueblan con `categorias` y
 * `proveedores` (cargados por la página vía useCatalogos). El código y el
 * estado no se editan: los gestiona el backend.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";
import type { Categoria } from "@/types/categoria";
import type { Proveedor } from "@/types/proveedor";
import {
  REPRESENTACIONES,
  type Producto,
  type ProductoPayload,
  type Representacion,
} from "@/types/producto";

const REPRESENTACION_VALUES = REPRESENTACIONES.map((r) => r.value) as [
  Representacion,
  ...Representacion[],
];

// Convierte el valor del input (string) a número para validar. Cadena vacía
// -> NaN, que falla las validaciones numéricas con el mensaje correspondiente.
const toNumber = (v: unknown) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    if (v.trim() === "") return NaN;
    return Number(v);
  }
  return v;
};

const productoSchema = z.object({
  nombre: z.string().trim().min(1, "Campo requerido").max(150, "Máximo 150 caracteres"),
  marca: z.string().trim().min(1, "Campo requerido").max(100, "Máximo 100 caracteres"),
  modelo: z.string().trim().max(100, "Máximo 100 caracteres").optional(),
  categoria_id: z.preprocess(toNumber, z.number({ invalid_type_error: "Campo requerido" }).int().positive("Campo requerido")),
  proveedor_id: z.preprocess(toNumber, z.number({ invalid_type_error: "Campo requerido" }).int().positive("Campo requerido")),
  precio_compra: z.preprocess(toNumber, z.number({ invalid_type_error: "Precio inválido" }).positive("Precio inválido")),
  precio_venta: z.preprocess(toNumber, z.number({ invalid_type_error: "Precio inválido" }).positive("Precio inválido")),
  stock: z.preprocess(toNumber, z.number({ invalid_type_error: "Valor inválido" }).int("Debe ser entero").min(0, "Valor inválido")),
  stock_minimo: z.preprocess(toNumber, z.number({ invalid_type_error: "Valor inválido" }).int("Debe ser entero").min(0, "Valor inválido")),
  representacion: z.enum(REPRESENTACION_VALUES),
});

type ProductoFormOutput = z.output<typeof productoSchema>;

/**
 * Tipo de los valores del formulario en el DOM: todo son strings (lo que
 * devuelven inputs y selects). El resolver de Zod los valida y convierte a
 * número mediante `preprocess`, entregando ProductoFormOutput al onSubmit.
 */
interface ProductoFormFields {
  nombre: string;
  marca: string;
  modelo: string;
  categoria_id: string;
  proveedor_id: string;
  precio_compra: string;
  precio_venta: string;
  stock: string;
  stock_minimo: string;
  representacion: Representacion;
}

interface ProductoFormProps {
  defaultValues?: Producto | null;
  categorias: Categoria[];
  proveedores: Proveedor[];
  submitting?: boolean;
  onSubmit: (payload: ProductoPayload) => void;
  onCancel: () => void;
}

export function ProductoForm({
  defaultValues,
  categorias,
  proveedores,
  submitting = false,
  onSubmit,
  onCancel,
}: ProductoFormProps) {
  // En edición precargamos los IDs buscando por NOMBRE (el backend devuelve
  // nombres en el producto, pero el formulario trabaja con IDs).
  const initialCategoriaId =
    categorias.find((c) => c.nombre === defaultValues?.categoria)?.id;
  const initialProveedorId =
    proveedores.find((p) => p.nombre === defaultValues?.proveedor)?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductoFormFields>({
    // El resolver valida con Zod y produce los tipos numéricos en el submit.
    resolver: zodResolver(productoSchema) as never,
    defaultValues: {
      nombre: defaultValues?.nombre ?? "",
      marca: defaultValues?.marca ?? "",
      modelo: defaultValues?.modelo ?? "",
      categoria_id: initialCategoriaId !== undefined ? String(initialCategoriaId) : "",
      proveedor_id: initialProveedorId !== undefined ? String(initialProveedorId) : "",
      precio_compra:
        defaultValues?.precio_compra !== undefined
          ? String(defaultValues.precio_compra)
          : "",
      precio_venta:
        defaultValues?.precio_venta !== undefined
          ? String(defaultValues.precio_venta)
          : "",
      stock: defaultValues?.stock !== undefined ? String(defaultValues.stock) : "",
      stock_minimo:
        defaultValues?.stock_minimo !== undefined
          ? String(defaultValues.stock_minimo)
          : "",
      representacion: defaultValues?.representacion ?? "unidad",
    },
  });

  // handleSubmit entrega los valores ya validados/convertidos por Zod.
  const submit = (values: ProductoFormFields) => {
    const out = values as unknown as ProductoFormOutput;
    onSubmit({
      nombre: out.nombre,
      marca: out.marca,
      modelo: out.modelo && out.modelo.trim() ? out.modelo.trim() : null,
      categoria_id: out.categoria_id,
      proveedor_id: out.proveedor_id,
      precio_compra: out.precio_compra,
      precio_venta: out.precio_venta,
      stock: out.stock,
      stock_minimo: out.stock_minimo,
      representacion: out.representacion,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Nombre"
          placeholder="Ej. Coca Cola 3L"
          autoFocus
          error={errors.nombre?.message}
          {...register("nombre")}
        />
        <InputField
          label="Marca"
          placeholder="Ej. Coca Cola"
          error={errors.marca?.message}
          {...register("marca")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Modelo (opcional)"
          placeholder="Ej. Botella retornable / Pavilion 15"
          error={errors.modelo?.message}
          {...register("modelo")}
        />
        <SelectField
          label="Representación"
          hint="Cómo se vende: por unidad, sobre, caja, etc."
          error={errors.representacion?.message}
          options={REPRESENTACIONES.map((r) => ({ value: r.value, label: r.label }))}
          {...register("representacion")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Categoría"
          placeholder="Selecciona una categoría"
          error={errors.categoria_id?.message}
          options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
          {...register("categoria_id")}
        />
        <SelectField
          label="Proveedor"
          placeholder="Selecciona un proveedor"
          error={errors.proveedor_id?.message}
          options={proveedores.map((p) => ({ value: p.id, label: p.nombre }))}
          {...register("proveedor_id")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Precio compra"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.precio_compra?.message}
          {...register("precio_compra")}
        />
        <InputField
          label="Precio venta"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.precio_venta?.message}
          {...register("precio_venta")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Stock inicial"
          type="number"
          min="0"
          placeholder="0"
          error={errors.stock?.message}
          {...register("stock")}
        />
        <InputField
          label="Stock mínimo"
          type="number"
          min="0"
          placeholder="0"
          error={errors.stock_minimo?.message}
          {...register("stock_minimo")}
        />
      </div>

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
