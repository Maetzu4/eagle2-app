"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Eliminar cualquier dato de sesión o cookies
    const handleLogOut = async () => {

      await signOut({
        callbackUrl: "/",
      })  
  
    }

    handleLogOut();

  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 gap-60">
      <h1 className="text-6xl font-bold text-center text-cyan-50">Cerrando sesión...</h1>
    </div>
  );
}
