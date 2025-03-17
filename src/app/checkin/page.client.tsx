// app/checkin/page.client.tsx
"use client";

import { useState } from "react";
import { CheckinForm } from "@/components/Checkin/checkinForm";
import { CheckinTable } from "@/components/Checkin/checkinTable";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { useCheckin } from "@/components/Checkin/hooks/useCheckin";
import { Checkin } from "@/types/checkin";

interface CheckinLlegadasProps {
  rol: string;
}

const CheckinLlegadas: React.FC<CheckinLlegadasProps> = ({ rol }) => {
  const texto = "Cerrar sesión";
  const { usuarios, checkin, clientes, loading, error, setCheckin } =
    useCheckin();
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
        tipo: "",
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
      tipo: "",
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
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue = 0;

    // Asegúrate de que los valores numéricos se conviertan a número
    if (["planilla", "sello", "declarado", "ruta_llegada"].includes(name)) {
      parsedValue = parseInt(value, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Lógica para actualizar el cliente y fondo basado en la selección del cliente
    if (name === "clientes") {
      const selectedCliente = clientes.find(
        (cliente) => cliente.idCliente === Number(value)
      );
      setFormData((prev) => ({
        ...prev,
        clienteID: selectedCliente ? selectedCliente.idCliente : 0,
        clientes: selectedCliente || prev.clientes,
        fondoId: selectedCliente?.fondo.idFondo || prev.fondoId,
        fondo: {
          ...prev.fondo,
          nombre: selectedCliente?.fondo.nombre || prev.fondo.nombre,
          idFondo: selectedCliente?.fondo.idFondo || prev.fondo.idFondo,
          tipo: selectedCliente?.fondo.tipo || prev.fondo.tipo,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const checkinData = {
        ...formData,
        fechaRegistro: formData.fechaRegistro.toISOString(),
      };

      const method = formData.idCheckin ? "PUT" : "POST"; // Usar PUT si hay un ID
      const endpoint = "/api/checkins";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkinData),
      });

      if (!res.ok) {
        throw new Error("Error en la solicitud");
      }
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
      fechaRegistro: new Date(),
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
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Bienvenido</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>{rol === "checkinero" && <LogOutBtn text={texto} />}</li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Formulario */}
        {rol === "checkinero" && (
          <CheckinForm
            formData={formData}
            clientes={clientes}
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
          rol={rol}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default CheckinLlegadas;
