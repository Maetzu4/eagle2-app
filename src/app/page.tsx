"use client";

import { useState, useTransition } from "react";
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
import { loginSchema } from "@/lib/loginShema";
import { LoginAction } from "@/actions/auth-action";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    startTransition(async () =>{
      const response = await LoginAction(data);

      if (response.error) {
        setError(response.error)
      } else {
        router.push("/checkin")
      }
    })
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 gap-60">
      <h1 className="text-6xl font-bold text-center text-cyan-50">Eagle</h1>

      <Card className="w-full max-w-sm p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Iniciar Sesión
        </h2>
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center font-semibold">{error}</p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Usuario:</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Ingresa tu usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
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
            <Button disabled={isPending} type="submit" className="w-full px-4 py-2 font-bold bg-cyan-700 hover:bg-cyan-900">
              Entrar
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
