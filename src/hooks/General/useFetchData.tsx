//@/hooks/General/useFetchData.tsx
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

        // Fetch fondos
        const [fondosRes, serviciosRes] = await Promise.all([
          fetch("/api/fondos"),
          fetch("/api/servicio"),
        ]);

        if (!fondosRes.ok) throw new Error("Error al cargar fondos");
        if (!serviciosRes.ok) throw new Error("Error al cargar servicios");

        const [fondosData, serviciosData] = await Promise.all([
          fondosRes.json(),
          serviciosRes.json(),
        ]);

        setFondos(fondosData);
        setServicios(serviciosData);

        // Fetch check-ins
        const checkinsRes = await fetch("/api/checkins");
        if (!checkinsRes.ok) throw new Error("Error al cargar check-ins");
        const checkinsData = await checkinsRes.json();
        setCheckin(checkinsData);

        // Fetch rutas
        const rutasRes = await fetch("/api/rutas");
        if (!rutasRes.ok) throw new Error("Error al cargar rutas");
        const rutasData = await rutasRes.json();
        setRutas(rutasData);

        // Fetch clientes
        const clientesRes = await fetch("/api/clientes");
        if (!clientesRes.ok) throw new Error("Error al cargar clientes");
        const clientesData = await clientesRes.json();
        setClientes(clientesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false); // Asegurarse de quitar el estado de loading
      }
    };

    fetchData();
  }, [userEmail]);

  return {
    usuarios,
    fondos,
    servicios,
    loading,
    error,
    setServicios,
    checkin,
    clientes,
    setCheckin,
    rutas,
  };
}

// export function useFetchData(userEmail: string) {
//   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [fondos, setFondos] = useState<Fondo[]>([]);
//   const [servicios, setServicios] = useState<Servicio[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch usuarios
//         const usuariosRes = await fetch(`/api/usuarios?email=${userEmail}`);
//         if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
//         const usuariosData = await usuariosRes.json();
//         setUsuarios([usuariosData]); // Guardar el usuario en un array

//         // Fetch fondo
//         const fondosRes = await fetch("/api/fondos");
//         if (!fondosRes.ok) throw new Error("Error al cargar fondos");
//         const fondosData = await fondosRes.json();
//         setFondos(fondosData);

//         // Fetch servicios
//         const serviciosRes = await fetch("/api/servicio");
//         if (!serviciosRes.ok) throw new Error("Error al cargar servicios");
//         const serviciosData = await serviciosRes.json();
//         setServicios(serviciosData);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Error al cargar los datos"
//         );
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userEmail]); // Dependencia: userEmail

//   return {
//     usuarios,
//     checkin,
//     clientes,
//     rutas,
//     loading,
//     error,
//     setCheckin,
//     setError,
//     fondos,
//     servicios,
//     setServicios,
//   };
// }
