"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  usuario: z.string().min(1, { message: "El usuario es obligatorio." }),
  contrasena: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: "",
      contrasena: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setError(message || "Credenciales inválidas.");
        return;
      }

      const { area } = await response.json();

      switch (area) {
        case "checkin":
          router.push("/checkin");
          break;
        case "digitador":
          router.push("/digitador");
          break;
        case "operario":
          router.push("/operario");
          break;
        default:
          setError("Rol no reconocido.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 gap-60">
      <h1 className="text-6xl font-bold text-center text-cyan-50">Eagle</h1>

      <Card className="w-full max-w-sm p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Iniciar Sesión
        </h2>
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Usuario:</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tu usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Contraseña:</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ingresa tu contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full px-4 py-2 font-bold bg-cyan-700 hover:bg-cyan-900">
              Entrar
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
