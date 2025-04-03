// @/components/auth/hooks/useAuth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = async () => {
    const session = await fetch("/api/auth/session").then((res) => res.json());
    const role = session?.user?.role;

    if (role === "digitador") {
      router.push("/digitador");
    } else if (role === "checkinero") {
      router.push("/checkin");
    } else if (role === "operario") {
      router.push("/operario");
    } else if (role === "administrador") {
      router.push("/admin");
    } else {
      setError("No tiene un rol válido asignado.");
    }
  };

  return { handleLoginSuccess, error, setError };
}
