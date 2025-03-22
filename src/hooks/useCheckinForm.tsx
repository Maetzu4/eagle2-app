// hooks/useCheckinForm.ts
import { useState } from "react";
import { Checkin, Cliente } from "@/types/checkin";
import { useToast } from "@/hooks/use-toast";

export const useCheckinForm = (
  initialData: Checkin,
  clientes: Cliente[],
  checkin: Checkin[],
  setCheckin: (checkins: Checkin[]) => void,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const [formData, setFormData] = useState<Checkin>(initialData);

  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const parsedValue = [
      "planilla",
      "sello",
      "declarado",
      "rutaLlegadaId",
      "clienteId",
    ].includes(name)
      ? parseInt(value, 10)
      : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    if (name === "clienteId") {
      const selectedCliente = clientes.find(
        (cliente: Cliente) => cliente.idCliente === parsedValue
      );
      if (selectedCliente) {
        setFormData((prev) => ({
          ...prev,
          clienteId: selectedCliente.idCliente,
          fondoId: selectedCliente.fondoId,
          fondo: selectedCliente.fondo,
        }));
      }
    }
  };

  // Función para manejar el envío del formulario (crear o actualizar)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.planilla ||
      !formData.sello ||
      !formData.declarado ||
      !formData.rutaLlegadaId ||
      !formData.clienteId ||
      !formData.fondoId
    ) {
      toast({
        title: "Alerta",
        description: "Todos los campos son requeridos",
        variant: "alert",
      });
      return;
    }

    if (formData.declarado > 999999999) {
      toast({
        title: "Alerta",
        description: "El valor declarado no puede ser mayor a 999,999,999",
        variant: "alert",
      });
      return;
    }

    const planillaExists = checkin.some(
      (c) =>
        c.planilla === formData.planilla && c.idCheckin !== formData.idCheckin
    );
    const selloExists = checkin.some(
      (c) => c.sello === formData.sello && c.idCheckin !== formData.idCheckin
    );

    if (planillaExists) {
      toast({
        title: "Error",
        description: "El número de planilla ya existe",
        variant: "destructive",
      });
      return;
    }

    if (selloExists) {
      toast({
        title: "Error",
        description: "El número de sello ya existe",
        variant: "destructive",
      });
      return;
    }

    try {
      const checkinData = {
        ...formData,
      };

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

      setFormData({
        planilla: 0,
        sello: 0,
        clienteId: 0,
        declarado: 0,
        rutaLlegadaId: 0,
        fechaRegistro: new Date(),
        checkineroId: formData.checkineroId,
        fondoId: 0,
      });

      const updatedCheckins = await fetch("/api/checkins").then((res) =>
        res.json()
      );
      setCheckin(updatedCheckins);

      toast({
        title: "Éxito",
        description: "Checkin guardado correctamente",
        variant: "normal",
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar el checkin",
        variant: "destructive",
      });
    }
  };

  // Función para manejar la edición de un checkin
  const handleEdit = (id: number) => {
    const checkinToEdit = checkin.find((c) => c.idCheckin === id);
    if (!checkinToEdit) return;

    setFormData({
      idCheckin: checkinToEdit.idCheckin,
      planilla: checkinToEdit.planilla,
      sello: checkinToEdit.sello,
      clienteId: checkinToEdit.clienteId,
      declarado: checkinToEdit.declarado,
      rutaLlegadaId: checkinToEdit.rutaLlegadaId,
      fechaRegistro: new Date(checkinToEdit.fechaRegistro),
      checkineroId: checkinToEdit.checkineroId,
      fondoId: checkinToEdit.fondoId,
      fondo: checkinToEdit.fondo,
    });
  };

  // Función para manejar la eliminación de checkins
  const handleDelete = async (ids: number[]) => {
    try {
      if (ids.length === 0) {
        throw new Error("No se seleccionaron check-ins para eliminar");
      }

      const res = await fetch("/api/checkins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar los check-ins");
      }

      const deletedCheckins = await res.json();
      console.log("Check-ins eliminados:", deletedCheckins);

      const updatedCheckins = await fetch("/api/checkins").then((res) =>
        res.json()
      );
      setCheckin(updatedCheckins);

      toast({
        title: "Éxito",
        description: "Checkins eliminados correctamente",
        variant: "normal",
      });
    } catch (error) {
      console.error("Error al eliminar los check-ins:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    setFormData,
  };
};
