//@/app/logout/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Informa } from "@/components/General/informa";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Eliminar cualquier dato de sesión o cookies
    const handleLogOut = async () => {
      await signOut({
        callbackUrl: "/",
      });
    };

    handleLogOut();
  }, [router]);

  return <Informa text="Cerrando sesion..." btntxt="nope" log={false} />;
}
