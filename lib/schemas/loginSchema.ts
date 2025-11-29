import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("Debe ser un correo válido"),

  password: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña es demasiado larga"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
