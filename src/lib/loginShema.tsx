import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, { message: "El usuario es obligatorio." }),
    password: z.string().min(1, { message: "La contraseña es obligatoria." }),
  });