"use client";
import { useState, useEffect } from "react";
import { CheckinForm } from "@/components/Checkin/checkinForm";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { useCheckin } from "@/components/Checkin/hooks/useCheckin";
import { Checkin, user, Cliente } from "@/types/checkin";
import { DataTable } from "@/components/dataTables";
import { useToast } from "@/components/hooks/use-toast";

interface CheckinLlegadasProps {
  user: user;
}

const CheckinLlegadas: React.FC<CheckinLlegadasProps> = ({ user }) => {
  const { toast } = useToast();
  const texto = "Cerrar sesión";
  const { usuarios, checkin, loading, error, setCheckin, clientes, rutas } =
    useCheckin(user.email);
  const [formData, setFormData] = useState<Checkin>({
    planilla: 0,
    sello: 0,
    clienteId: 0,
    declarado: 0,
    rutaLlegadaId: 0,
    fechaRegistro: new Date(), // Tipo Date
    checkineroId: 0, // Inicializar como 0 hasta que obtengamos el ID del usuario
    fondoId: 0,
    fondo: undefined, // Inicializar como undefined
  });

  // Obtener los datos completos del usuario por correo
  useEffect(() => {
    if (usuarios.length > 0) {
      const usuario = usuarios[0]; // Obtener el primer usuario (debería ser el único)
      setFormData((prev) => ({
        ...prev,
        checkineroId: usuario.idUsuario, // Actualizar checkineroId con el ID del usuario
      }));
    }
  }, [usuarios]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Convertir a número si el campo es numérico
    const parsedValue = [
      "planilla",
      "sello",
      "declarado",
      "rutaLlegadaId",
      "clienteId",
    ].includes(name)
      ? parseInt(value, 10)
      : value;

    // Actualizar el estado de formData
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Si se selecciona un cliente, actualizar fondoId y fondo
    if (name === "clienteId") {
      const selectedCliente = clientes.find(
        (cliente: Cliente) => cliente.idCliente === parsedValue
      );
      if (selectedCliente) {
        setFormData((prev) => ({
          ...prev,
          clienteId: selectedCliente.idCliente, // Actualizar clienteId
          fondoId: selectedCliente.fondoId, // Actualizar fondoId
          fondo: selectedCliente.fondo, // Actualizar el objeto fondo
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar campos requeridos
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
        variant: "default",
        className: "bg-yellow-400 border-yellow-300",
      });
      return;
    }

    // Validar que el valor declarado no exceda 9 dígitos
    if (formData.declarado > 999999999) {
      toast({
        title: "Alerta",
        description: "El valor declarado no puede ser mayor a 999,999,999",
        variant: "default",
        className: "bg-yellow-400 border-yellow-300",
      });
      return;
    }

    // Validar que la planilla y el sello no existan en la base de datos
    const planillaExists = checkin.some(
      (c) => c.planilla === formData.planilla
    );
    const selloExists = checkin.some((c) => c.sello === formData.sello);

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

      // Limpiar el formulario después de guardar
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

      // Actualizar la lista de checkins
      const updatedCheckins = await fetch("/api/checkins").then((res) =>
        res.json()
      );
      setCheckin(updatedCheckins);

      // Notificar al usuario que el checkin se ha guardado correctamente
      toast({
        title: "Éxito",
        description: "Checkin guardado correctamente",
        variant: "default",
        className: "bg-cyan-700 border-cyan-600 text-white",
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

  const handleDelete = async (ids: number[]) => {
    try {
      console.log("IDs a eliminar:", ids);

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

      // Notificar al usuario que los checkins se han eliminado correctamente
      toast({
        title: "Éxito",
        description: "Checkins eliminados correctamente",
        variant: "default",
        className: "bg-cyan-700 border-cyan-600 text-white",
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
        <DataTable
          data={checkin} // Pasar los datos de checkin al DataTable
          onEdit={handleEdit} // Pasar la función de edición
          onDelete={handleDelete} // Pasar la función de eliminación
        />
      </main>
    </div>
  );
};

export default CheckinLlegadas;
