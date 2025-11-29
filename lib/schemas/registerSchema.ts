import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(40, "El nombre es demasiado largo"),

    email: z
      .string()
      .nonempty("El correo es obligatorio")
      .email("Debe ser un correo válido"),

    password: z
      .string()
      .nonempty("La contraseña es obligatoria")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(50, "La contraseña es demasiado larga"),

    confirmPassword: z
      .string()
      .nonempty("Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
