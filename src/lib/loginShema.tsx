import { z } from "zod";

export const loginSchema = z.object({
    usuario: z.string().min(1, { message: "El usuario es obligatorio." }),
    contrasena: z.string().min(1, { message: "La contraseña es obligatoria." }),
  });