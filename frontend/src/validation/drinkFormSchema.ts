import { z } from "zod";

export const drinkFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio (mínimo 2 letras)"),
  category: z.string().min(1, "La categoría es obligatoria"),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  is_alcoholic: z.boolean(),
  ingredients: z.string().min(1, "Ingresá los ingredientes"),
  instructions: z.string().min(1, "Ingresá las instrucciones"),
  image: z.instanceof(File).optional().nullable(),
});

export type DrinkFormInput = z.infer<typeof drinkFormSchema>;
