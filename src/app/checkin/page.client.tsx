"use client";
import { useEffect } from "react";
import { CheckinForm } from "@/components/Checkin/checkinForm";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { useCheckin } from "@/hooks/Checkin/useCheckin";
import { Checkin, user } from "@/types/checkin";
import { DataTable } from "@/components/Checkin/dataTableCheckin";
import { useToast } from "@/hooks/General/use-toast";
import { useCheckinForm } from "@/hooks/Checkin/useCheckinForm";
import { Loading } from "@/components/General/loading";

interface CheckinLlegadasProps {
  user: user;
}

const CheckinLlegadas: React.FC<CheckinLlegadasProps> = ({ user }) => {
  const { toast } = useToast();
  const { usuarios, checkin, loading, error, setCheckin, clientes, rutas } =
    useCheckin(user.email);

  const initialFormData: Checkin = {
    planilla: 0,
    sello: 0,
    clienteId: 0,
    declarado: 0,
    rutaLlegadaId: 0,
    fechaRegistro: new Date(),
    checkineroId: 0,
    fondoId: 0,
    fondo: undefined,
  };

  const {
    formData,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    setFormData,
  } = useCheckinForm(initialFormData, clientes, checkin, setCheckin, toast);

  // Obtener el ID del usuario al cargar el componente
  useEffect(() => {
    if (usuarios.length > 0) {
      const usuario = usuarios[0];
      setFormData((prev) => ({
        ...prev,
        checkineroId: usuario.idUsuario,
      }));
    }
  }, [usuarios, setFormData]);

  if (loading) {
    return <Loading text="Cargando...." />;
  }

  if (error) {
    return <Loading text={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Bienvenido, {user.name}</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                {user.role === "checkinero" && (
                  <LogOutBtn text={"Cerrar sesión"} />
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
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

        <DataTable data={checkin} onEdit={handleEdit} onDelete={handleDelete} />
      </main>
    </div>
  );
};

export default CheckinLlegadas;
