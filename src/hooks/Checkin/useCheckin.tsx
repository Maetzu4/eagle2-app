//@/app/hooks/Checkin/useCheckin.tsx
"use client";
import { useState, useEffect } from "react";
import { Checkin, Cliente, Usuario, RutaLlegada } from "@/types/interfaces";

// Modifica el hook useCheckin para obtener rutas
export function useCheckin(userEmail: string) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [checkin, setCheckin] = useState<Checkin[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rutas, setRutas] = useState<RutaLlegada[]>([]); // Nuevo estado para rutas
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch clientes
        const clientesRes = await fetch("/api/clientes");
        if (!clientesRes.ok) throw new Error("Error al cargar clientes");
        const clientesData = await clientesRes.json();
        setClientes(clientesData);

        // Fetch rutas
        const rutasRes = await fetch("/api/rutas");
        if (!rutasRes.ok) throw new Error("Error al cargar rutas");
        const rutasData = await rutasRes.json();
        setRutas(rutasData);

        // Fetch check-ins
        const checkinsRes = await fetch("/api/checkins");
        if (!checkinsRes.ok) throw new Error("Error al cargar check-ins");
        const checkinsData = await checkinsRes.json();
        setCheckin(checkinsData);

        // Fetch usuario actual por correo
        const usuarioRes = await fetch(`/api/usuarios?email=${userEmail}`);
        if (!usuarioRes.ok) throw new Error("Error al cargar el usuario");
        const usuarioData = await usuarioRes.json();
        setUsuarios([usuarioData]); // Guardar el usuario en un array
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]); // Dependencia: userEmail

  return { usuarios, checkin, clientes, rutas, loading, error, setCheckin };
}
