"use server";

import { z } from "zod";
import { loginSchema } from "@/lib/loginShema";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginAction = async (data: LoginFormValues) => {
  try {
    await signIn("credentials", {
      usuario: data.usuario,
      contrasena: data.contrasena,
      redirect: false,
    });

    return {success: true};

  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    } else {
      return { error: "error 505" };
    }
  }
};
