"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Eliminar cualquier dato de sesión o cookies
    const logoutUser = async () => {
      try {
        // Si estás usando cookies o almacenamiento local, puedes eliminarlas aquí
        localStorage.removeItem("authToken"); // Ejemplo de token almacenado
        sessionStorage.clear(); // Limpia el almacenamiento de la sesión

        // Si usas una API para manejar la sesión del servidor:
        await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        });

        // Redirige al usuario a la página de inicio de sesión
        router.push("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    logoutUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-xl font-semibold text-gray-700">Cerrando sesión...</h1>
    </div>
  );
}
