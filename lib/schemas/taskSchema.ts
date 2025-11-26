import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .regex(/^[a-zA-Z0-9\s]+$/, "Solo caracteres alfanuméricos permitidos"),

  description: z
    .string()
    .min(1, "La descripción es requerida")
    .regex(/^[a-zA-Z0-9\s]+$/, "Solo caracteres alfanuméricos permitidos"),
});
