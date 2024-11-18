"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DigitadorOpciones() {
  const router = useRouter();

  // Opciones de navegación
  const options = [
    { href: "/ver_llegadas", label: "Ver Llegadas" },
    { href: "/fechas_cerradas", label: "Ver Fechas Cerradas" },
    { href: "/proceso_cierre_fecha", label: "Proceso de Cierre de Fecha" },
    { href: "/fondos", label: "Ver Fondos" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Opciones del Digitador</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button onClick={() => router.push("/logout")} className="hover:underline">
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-6 text-white text-center">
          Selecciona una opción
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => router.push(option.href)}
              className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}
