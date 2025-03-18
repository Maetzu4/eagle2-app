"use client";
import { useState, useEffect } from "react";
import { CheckinForm } from "@/components/Checkin/checkinForm";
import { CheckinTable } from "@/components/Checkin/checkinTable";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { useCheckin } from "@/components/Checkin/hooks/useCheckin";
import { Checkin, user, RutaLlegada, Cliente } from "@/types/checkin";

interface CheckinLlegadasProps {
  user: user;
}

const CheckinLlegadas: React.FC<CheckinLlegadasProps> = ({ user }) => {
  const texto = "Cerrar sesión";
  const { usuarios, checkin, loading, error, setCheckin } = useCheckin();
  const [formData, setFormData] = useState<Checkin>({
    planilla: 0,
    sello: 0,
    clienteID: 0,
    clientes: {
      idCliente: 0,
      name: "",
      sede: "",
      fondoId: 0,
      fondo: {
        idFondo: 0,
        nombre: "",
        tipo: "Publico",
        clientes: [],
        checkins: [],
        servicios: [],
        fecha_de_cierre: [],
      },
      checkin_id: 0,
    },
    declarado: 0,
    ruta_llegada: 0,
    fechaRegistro: new Date(),
    checkineroId: 0,
    checkinero: {
      idCheckinero: 0,
      usuario_id: 0,
    },
    fondoId: 0,
    fondo: {
      idFondo: 0,
      nombre: "",
      tipo: "Publico",
      clientes: [],
      checkins: [],
      servicios: [],
      fecha_de_cierre: [],
    },
    servicio: {
      idServicio: 0,
      planilla: 0,
      sello: 0,
      fecharegistro: new Date(),
      B_100000: 0,
      B_50000: 0,
      B_20000: 0,
      B_10000: 0,
      B_5000: 0,
      B_2000: 0,
      Sum_B: 0,
      checkin_id: 0,
      checkineroId: 0,
      fondoId: 0,
      operarioId: 0,
      estado: "Activo",
    },
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [rutas, setRutas] = useState<RutaLlegada[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener clientes
        const clientesRes = await fetch("/api/clientes");
        if (!clientesRes.ok) throw new Error("Error al cargar clientes");
        const clientesData = await clientesRes.json();
        setClientes(clientesData);

        // Obtener rutas
        const rutasRes = await fetch("/api/rutas");
        if (!rutasRes.ok) throw new Error("Error al cargar rutas");
        const rutasData = await rutasRes.json();
        setRutas(rutasData);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Convertir a número si el campo es numérico
    const parsedValue = [
      "planilla",
      "sello",
      "declarado",
      "ruta_llegada",
      "clienteID",
    ].includes(name)
      ? parseInt(value, 10)
      : value;

    // Actualizar el estado de formData
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Si se selecciona un cliente, actualizar fondo y clienteID
    if (name === "clienteID") {
      const selectedCliente = clientes.find(
        (cliente) => cliente.idCliente === parsedValue
      );
      if (selectedCliente) {
        setFormData((prev) => ({
          ...prev,
          clienteID: selectedCliente.idCliente,
          fondoId: selectedCliente.fondo.idFondo,
          fondo: {
            ...prev.fondo,
            idFondo: selectedCliente.fondo.idFondo,
            nombre: selectedCliente.fondo.nombre,
            tipo: selectedCliente.fondo.tipo,
          },
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const checkinData = {
        ...formData,
        fechaRegistro: formData.fechaRegistro.toISOString(),
        clienteID: formData.clienteID,
        ruta_llegada: formData.ruta_llegada,
      };

      console.log("Datos enviados:", checkinData); // Depuración

      const method = formData.idCheckin ? "PUT" : "POST";
      const endpoint = formData.idCheckin
        ? `/api/checkins/${formData.idCheckin}`
        : "/api/checkins";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkinData),
      });

      if (!res.ok) {
        throw new Error("Error en la solicitud");
      }

      const result = await res.json();
      console.log("Checkin guardado:", result);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleEdit = (checkin: Checkin) => {
    setFormData({
      ...checkin,
      idCheckin: checkin.idCheckin,
      planilla: checkin.planilla,
      sello: checkin.sello,
      declarado: checkin.declarado,
      ruta_llegada: checkin.ruta_llegada,
      fondo: checkin.fondo,
      checkineroId: checkin.checkineroId,
      clienteID: checkin.clienteID,
      clientes: checkin.clientes,
      fechaRegistro: new Date(checkin.fechaRegistro),
      checkinero: checkin.checkinero,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este check-in?")) {
      return;
    }

    try {
      const res = await fetch(`/api/checkins`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el check-in");
      }

      const deletedCheckin = await res.json();
      console.log("Check-in eliminado:", deletedCheckin);

      // Actualizar el estado para reflejar los cambios
      setCheckin((prev) => prev.filter((item) => item.idCheckin !== id));
    } catch (error) {
      console.error("Error al eliminar el check-in:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-cyan-50">Cargando...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-cyan-50">Error: {error}</h1>
        </div>
        <div>
          <LogOutBtn text={"Cerrar sesión"} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Bienvenido, {user.name}</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                {user.role === "checkinero" && <LogOutBtn text={texto} />}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Formulario */}
        {user.role === "checkinero" && (
          <CheckinForm
            formData={formData}
            clientes={clientes}
            rutas={rutas}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isEditMode={!!formData.idCheckin}
          />
        )}

        {/* Tabla de registros */}
        <CheckinTable
          checkin={checkin}
          clientes={clientes}
          usuarios={usuarios}
          rol={user.role}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default CheckinLlegadas;
