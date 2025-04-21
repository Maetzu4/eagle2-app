"use client";
import { useState, useEffect } from "react";
import {
  Checkin,
  Cliente,
  Usuario,
  RutaLlegada,
  Fondo,
  Servicio,
} from "@/types/interfaces";

export function useFetchData(userEmail: string) {
  const [checkin, setCheckin] = useState<Checkin[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rutas, setRutas] = useState<RutaLlegada[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch usuario
        const usuarioRes = await fetch(`/api/usuarios?email=${userEmail}`);
        if (!usuarioRes.ok) throw new Error("Error al cargar usuario");
        const usuarioData = await usuarioRes.json();
        setUsuarios([usuarioData]);

        // Fetch fondos, servicios, checkins, rutas y clientes en paralelo
        const [fondosRes, serviciosRes, checkinsRes, rutasRes, clientesRes] =
          await Promise.all([
            fetch("/api/fondos"),
            fetch("/api/servicio"),
            fetch("/api/checkins"),
            fetch("/api/rutas"),
            fetch("/api/clientes"),
          ]);

        if (!fondosRes.ok) throw new Error("Error al cargar fondos");
        if (!serviciosRes.ok) throw new Error("Error al cargar servicios");
        if (!checkinsRes.ok) throw new Error("Error al cargar check-ins");
        if (!rutasRes.ok) throw new Error("Error al cargar rutas");
        if (!clientesRes.ok) throw new Error("Error al cargar clientes");

        const [
          fondosData,
          serviciosData,
          checkinsData,
          rutasData,
          clientesData,
        ] = await Promise.all([
          fondosRes.json(),
          serviciosRes.json(),
          checkinsRes.json(),
          rutasRes.json(),
          clientesRes.json(),
        ]);

        setFondos(fondosData);
        setServicios(serviciosData);
        setCheckin(checkinsData);
        setRutas(rutasData);
        setClientes(clientesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  return {
    usuarios,
    setUsuarios,
    fondos,
    setFondos,
    servicios,
    setServicios,
    loading,
    error,
    checkin,
    setCheckin,
    clientes,
    setClientes,
    rutas,
    setRutas,
  };
}
