// lib/schemas/AuthSchema.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
