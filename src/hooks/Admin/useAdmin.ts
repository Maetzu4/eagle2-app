// src/hooks/Admin/useAdmin.ts
import { useState, useEffect } from "react";
import { user, FechaCierre, Sede } from "@/types/interfaces";
import { useToast } from "@/hooks/General/use-toast";
import { useFetchData } from "@/hooks/General/useFetchData";
import { opcionesAdmin } from "@/components/Admin/opcionesAdmin";

export function useAdminLogic(user: user) {
  const { toast } = useToast();
  const {
    usuarios,
    fondos,
    clientes,
    rutas,
    servicios,
    checkin,
    loading,
    error,
    setUsuarios,
    setFondos,
    setClientes,
    setRutas,
    setServicios,
    setCheckin,
  } = useFetchData(user.email);

  // Estados para las opciones del menú
  const initialEstados = Object.fromEntries(
    opcionesAdmin.map((opcion) => [opcion.estadoKey, false])
  );
  const [estados, setEstados] =
    useState<Record<string, boolean>>(initialEstados);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [fechasCierre, setFechasCierre] = useState<FechaCierre[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);

  // Estado para el formulario genérico
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Cargar fechas de cierre

    const fetchSedes = async () => {
      try {
        const res = await fetch("/api/sedes");
        if (!res.ok) throw new Error("Error al cargar sedes");
        const data = await res.json();
        setSedes(data);
      } catch (err) {
        console.error("Error fetching sedes:", err);
      }
    };

    const fetchFechasCierre = async () => {
      try {
        const res = await fetch("/api/fechacierre");
        if (!res.ok) throw new Error("Error al cargar fechas de cierre");
        const data = await res.json();
        setFechasCierre(data);
      } catch (err) {
        console.error("Error fetching fechas de cierre:", err);
      }
    };

    fetchSedes();
    fetchFechasCierre();
  }, []);

  const resetForm = () => {
    setFormData({});
  };

  const handleEdit = (id: number) => {
    let itemToEdit;
    switch (selectedTable) {
      case "usuarios":
        itemToEdit = usuarios.find((u) => u.idUsuario === id);
        break;
      case "fondos":
        itemToEdit = fondos.find((f) => f.idFondo === id);
        break;
      case "clientes":
        itemToEdit = clientes.find((c) => c.idCliente === id);
        break;
      case "rutas":
        itemToEdit = rutas.find((r) => r.idRutaLlegada === id);
        break;
      case "servicios":
        itemToEdit = servicios.find((s) => s.idServicio === id);
        break;
      case "fechasCierre":
        itemToEdit = fechasCierre.find((f) => f.idFechaCierre === id);
        break;
      case "sedes":
        itemToEdit = sedes.find((s) => s.idSede === id);
        break;
      default:
        return;
    }

    if (itemToEdit) {
      setFormData(itemToEdit);
    }
  };

  const handleDelete = async (ids: number[]) => {
    try {
      if (ids.length === 0) {
        throw new Error("No se seleccionaron elementos para eliminar");
      }

      let endpoint = "";
      switch (selectedTable) {
        case "usuarios":
          endpoint = "/api/usuarios";
          break;
        case "fondos":
          endpoint = "/api/fondos";
          break;
        case "clientes":
          endpoint = "/api/clientes";
          break;
        case "rutas":
          endpoint = "/api/rutas";
          break;
        case "servicios":
          endpoint = "/api/servicio";
          break;
        case "fechasCierre":
          endpoint = "/api/fechacierre";
          break;
        case "sedes":
          endpoint = "/api/sedes";
          break;
        default:
          throw new Error("Tabla no válida");
      }

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar");
      }

      // Actualizar el estado correspondiente
      switch (selectedTable) {
        case "usuarios":
          setUsuarios(usuarios.filter((u) => !ids.includes(u.idUsuario)));
          break;
        case "fondos":
          setFondos(fondos.filter((f) => !ids.includes(f.idFondo)));
          break;
        case "clientes":
          setClientes(clientes.filter((c) => !ids.includes(c.idCliente)));
          break;
        case "rutas":
          setRutas(rutas.filter((r) => !ids.includes(r.idRutaLlegada)));
          break;
        case "servicios":
          setServicios(
            servicios.filter((s) => !ids.includes(s.idServicio || 0))
          );
          break;
        case "fechasCierre":
          setFechasCierre(
            fechasCierre.filter((f) => !ids.includes(f.idFechaCierre))
          );
          break;
      }

      toast({
        title: "Éxito",
        description: "Elementos eliminados correctamente",
        variant: "normal",
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let endpoint = "";
      let method = "POST";

      switch (selectedTable) {
        case "usuarios":
          endpoint = "/api/usuarios";
          method = formData.idUsuario ? "PUT" : "POST";
          break;
        case "fondos":
          endpoint = "/api/fondos";
          method = formData.idFondo ? "PUT" : "POST";
          break;
        case "clientes":
          endpoint = "/api/clientes";
          method = formData.idCliente ? "PUT" : "POST";
          break;
        case "rutas":
          endpoint = "/api/rutas";
          method = formData.idRutaLlegada ? "PUT" : "POST";
          break;
        case "servicios":
          endpoint = "/api/servicio";
          method = formData.idServicio ? "PUT" : "POST";
          break;
        case "fechasCierre":
          endpoint = "/api/fechacierre";
          method = formData.idFechaCierre ? "PUT" : "POST";
          break;
        case "sedes":
          endpoint = "/api/sedes";
          method = formData.idSede ? "PUT" : "POST";
          break;
        default:
          throw new Error("Tabla no válida");
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error en la solicitud");
      }

      const result = await res.json();

      // Actualizar el estado correspondiente
      switch (selectedTable) {
        case "usuarios":
          if (method === "POST") {
            setUsuarios([...usuarios, result]);
          } else {
            setUsuarios(
              usuarios.map((u) =>
                u.idUsuario === result.idUsuario ? result : u
              )
            );
          }
          break;
        case "fondos":
          if (method === "POST") {
            setFondos([...fondos, result]);
          } else {
            setFondos(
              fondos.map((f) => (f.idFondo === result.idFondo ? result : f))
            );
          }
          break;
        case "clientes":
          if (method === "POST") {
            setClientes([...clientes, result]);
          } else {
            setClientes(
              clientes.map((c) =>
                c.idCliente === result.idCliente ? result : c
              )
            );
          }
          break;
        case "rutas":
          if (method === "POST") {
            setRutas([...rutas, result]);
          } else {
            setRutas(
              rutas.map((r) =>
                r.idRutaLlegada === result.idRutaLlegada ? result : r
              )
            );
          }
          break;
        case "servicios":
          if (method === "POST") {
            setServicios([...servicios, result]);
          } else {
            setServicios(
              servicios.map((s) =>
                s.idServicio === result.idServicio ? result : s
              )
            );
          }
          break;
        case "fechasCierre":
          if (method === "POST") {
            setFechasCierre([...fechasCierre, result]);
          } else {
            setFechasCierre(
              fechasCierre.map((f) =>
                f.idFechaCierre === result.idFechaCierre ? result : f
              )
            );
          }
          break;
      }

      toast({
        title: "Éxito",
        description: `Elemento ${
          method === "POST" ? "creado" : "actualizado"
        } correctamente`,
        variant: "normal",
      });

      resetForm();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return {
    estados,
    setEstados,
    selectedTable,
    setSelectedTable,
    data: {
      usuarios,
      fondos,
      clientes,
      rutas,
      servicios,
      fechasCierre,
      checkin,
    },
    sedes,
    setSedes,
    loading,
    error,
    usuarios,
    setUsuarios,
    fondos,
    setFondos,
    clientes,
    setClientes,
    rutas,
    setRutas,
    servicios,
    setServicios,
    fechasCierre,
    setFechasCierre,
    checkin,
    setCheckin,
    toast,
    handleDelete,
    handleEdit,
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
