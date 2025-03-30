// @/app/digitador/page.client.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/General/use-toast";
import { user, Checkin, Servicio } from "@/types/interfaces";
import { useFetchData } from "@/hooks/General/useFetchData";
import { Loading } from "@/components/General/loading";
import { DataTable } from "@/components/Checkin/dataTableCheckin";
import { FondosTable } from "@/components/Digitador/fondosTable";
import { ProcesoForm } from "@/components/Digitador/procesoForm";
import { useCheckinForm } from "@/hooks/Checkin/useCheckinForm";

interface DigitadorOpcionesProps {
  user: user;
}

const DigitadorOpciones: React.FC<DigitadorOpcionesProps> = ({ user }) => {
  const { toast } = useToast();
  const {
    usuarios,
    fondos,
    servicios,
    loading,
    error,
    setServicios,
    checkin,
    clientes,
    setCheckin,
  } = useFetchData(user.email);

  const [isFondo, setIsFondo] = useState(false);
  const [isProceso, setIsProceso] = useState(false);
  const [isCheckin, setIsCheckin] = useState(false);
  const [selectedFondoId, setSelectedFondoId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [availableServices, setAvailableServices] = useState<Servicio[]>([]);

  // Configuración inicial para el formulario de checkin
  const initialFormData: Checkin = {
    planilla: 0,
    sello: 0,
    clienteId: 0,
    declarado: 0,
    rutaLlegadaId: 0,
    fechaRegistro: new Date(),
    checkineroId: 0,
    fondoId: 0,
  };

  const { handleEdit, handleDelete } = useCheckinForm(
    initialFormData,
    clientes,
    checkin,
    setCheckin,
    toast
  );

  useEffect(() => {
    if (!selectedFondoId) {
      setAvailableServices([]);
      return;
    }

    const serviciosActivos = servicios.filter(
      (s) => s.fondoId === selectedFondoId && s.estado === "Activo"
    );

    const serviciosOrdenados = [...serviciosActivos].sort(
      (a, b) =>
        new Date(b.fechaRegistro).getTime() -
        new Date(a.fechaRegistro).getTime()
    );

    setAvailableServices(serviciosOrdenados);
  }, [selectedFondoId, servicios]);

  const handleCerrarFecha = async () => {
    if (!selectedServiceId) {
      toast({
        title: "Error",
        description: "Seleccione un servicio",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFondoId) {
      toast({
        title: "Error",
        description: "Seleccione un fondo válido",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/fechacierre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicioId: selectedServiceId,
          digitadorId: usuarios[0].idUsuario,
          fondoId: selectedFondoId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cerrar el servicio");
      }

      // Actualizar estado local
      setServicios((prev) =>
        prev.map((s) =>
          s.idServicio === selectedServiceId ? { ...s, estado: "Inactivo" } : s
        )
      );

      // Resetear selecciones
      setSelectedServiceId(null);
      setAvailableServices((prev) =>
        prev.filter((s) => s.idServicio !== selectedServiceId)
      );

      toast({
        title: "Éxito",
        description: "Servicio cerrado correctamente",
        variant: "normal",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Loading text="Cargando datos..." />;
  }

  if (error) {
    return <Loading text={error} />;
  }

  if (!usuarios.length || !fondos.length) {
    return <Loading text="No se encontraron datos" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            Bienvenido, {usuarios[0].name} {usuarios[0].lastname}
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <LogOutBtn text={"Cerrar sesión"} />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Gestión de procesos
          </h2>

          {/* Botones de navegación principales */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <Button
              onClick={() => {
                setIsCheckin(!isCheckin);
                setIsFondo(false);
                setIsProceso(false);
              }}
            >
              {isCheckin ? "Ocultar llegadas" : "Ver llegadas"}
            </Button>
            <Button
              onClick={() => {
                setIsProceso(false);
                setIsFondo(!isFondo);
                setIsCheckin(false);
              }}
            >
              {isFondo ? "Ocultar fondos" : "Ver Fondos"}
            </Button>
            <Button
              onClick={() => {
                setIsFondo(false);
                setIsProceso(!isProceso);
                setIsCheckin(false);
              }}
            >
              {isProceso ? "Ocultar cierres" : "Proceso de Cierre"}
            </Button>
          </div>

          {/* Sección de Checkins */}
          {isCheckin && (
            <DataTable
              data={checkin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              user={user}
            />
          )}

          {/* Sección de Fondos */}
          {isFondo && (
            <Card className="bg-white p-6 rounded-lg shadow mt-4">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Listado de Fondos
              </h3>
              <FondosTable fondos={fondos} />
            </Card>
          )}

          {/* Sección de Proceso de Cierre */}
          {isProceso && (
            <ProcesoForm
              fondos={fondos}
              selectedFondoId={selectedFondoId}
              onFondoChange={(e) => setSelectedFondoId(Number(e.target.value))}
              onSelectionChange={setSelectedServiceId}
              onCerrarFecha={handleCerrarFecha}
              availableServices={availableServices}
              selectedServiceId={selectedServiceId}
            />
          )}
        </Card>
      </main>
    </div>
  );
};

export default DigitadorOpciones;
