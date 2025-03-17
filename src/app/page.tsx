// app/page.tsx
"use client";

import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/Auth/loginForm";
import { useAuth } from "@/components/Auth/hooks/useAuth";

export default function Login() {
  const { handleLoginSuccess, error, setError } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 gap-60">
      <h1 className="text-6xl font-bold text-center text-cyan-50">Eagle</h1>

      <Card className="w-full max-w-sm p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Iniciar Sesión
        </h2>
        {error && (
          <p className="mt-4 text-sm text-red-500 text-center font-semibold">
            {error}
          </p>
        )}
        <LoginForm onSuccess={handleLoginSuccess} onError={setError} />
      </Card>
    </div>
  );
}
