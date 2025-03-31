//@/app/Checkin/page.client.tsx
"use client";
import { useEffect } from "react";
import { CheckinForm } from "@/components/Checkin/checkinForm";
import { useFetchData } from "@/hooks/General/useFetchData";
import { user } from "@/types/interfaces";
import { DataTable } from "@/components/Checkin/dataTableCheckin";
import { useToast } from "@/hooks/General/use-toast";
import { useCheckinForm } from "@/hooks/Checkin/useCheckinForm";
import { Informa } from "@/components/General/informa";
import { Card } from "@/components/ui/card";
import { TopPage } from "@/components/General/topPage";
import { initialFormData } from "@/components/Checkin/utils";

interface CheckinLlegadasProps {
  user: user;
}

const CheckinLlegadas: React.FC<CheckinLlegadasProps> = ({ user }) => {
  const { toast } = useToast();
  const { usuarios, checkin, loading, error, setCheckin, clientes, rutas } =
    useFetchData(user.email);

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
    return <Informa text="Cargando..." btntxt="Cerrar sesion" log={false} />;
  }

  if (error) {
    return <Informa text={error} btntxt="cerrar sesion" log={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      {/* bienvenida y cerrada de sesion del usuario */}
      <TopPage user={usuarios[0]} />
      {/* resto de la pagina */}
      <main className="container mx-auto p-6">
        {/* Formulario para ingresar checkins */}
        <CheckinForm
          formData={formData}
          clientes={clientes}
          rutas={rutas}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isEditMode={!!formData.idCheckin}
        />
        {/* Tabla para mostrar los checkins */}
        <Card className="bg-white p-6 rounded-lg shadow mt-6">
          <DataTable
            data={checkin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user}
          />
        </Card>
      </main>
    </div>
  );
};

export default CheckinLlegadas;
