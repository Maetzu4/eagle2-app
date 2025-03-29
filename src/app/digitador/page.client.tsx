// @/app/digitador/page.client.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { Card } from "@/components/ui/card";
import { FondosTable } from "@/components/Digitador/fondosTable";
import { ProcesoForm } from "@/components/Digitador/procesoForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/General/use-toast";
import { user, Checkin } from "@/types/interfaces";
import { useFetchData } from "@/hooks/General/useFetchData";
import { Loading } from "@/components/General/loading";
import { DataTable } from "@/components/Checkin/dataTableCheckin";
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
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
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
  const { handleEdit, handleDelete } = useCheckinForm(
    initialFormData,
    clientes,
    checkin,
    setCheckin,
    toast
  );
  // Modifica el useEffect que maneja las fechas disponibles
  useEffect(() => {
    if (!selectedFondoId) {
      setAvailableDates([]);
      setSelectedDate("");
      return;
    }

    try {
      // 1. Filtrar servicios activos del fondo seleccionado
      const serviciosActivos = servicios.filter(
        (s) => s.fondoId === selectedFondoId && s.estado === "Activo"
      );

      // 2. Procesar fechas con formato detallado
      const fechasUnicas = serviciosActivos.reduce((acc, servicio) => {
        if (!servicio.fechaRegistro) {
          console.warn(
            "Servicio sin fecha registrada (ID):",
            servicio.idServicio
          );
          return acc;
        }

        const fecha = new Date(servicio.fechaRegistro);
        if (isNaN(fecha.getTime())) {
          console.warn("Fecha inválida en servicio (ID):", servicio.idServicio);
          return acc;
        }

        // Formatear fecha completa con hora y planilla
        const fechaFormateada = `${fecha.toLocaleDateString(
          "es-ES"
        )} ${fecha.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })} (Planilla: ${servicio.planilla})`;

        acc.add(fechaFormateada);
        return acc;
      }, new Set<string>());

      // 3. Convertir y ordenar por fecha (más reciente primero)
      const fechasOrdenadas = Array.from(fechasUnicas).sort((a, b) => {
        // Extraer la parte de fecha para ordenar
        const fechaA = new Date(a.split(" ")[0].split("/").reverse().join("-"));
        const fechaB = new Date(b.split(" ")[0].split("/").reverse().join("-"));
        return fechaB.getTime() - fechaA.getTime();
      });

      setAvailableDates(fechasOrdenadas);

      console.log("Procesamiento completado:", {
        serviciosTotales: servicios.length,
        serviciosActivos: serviciosActivos.length,
        fechasUnicas: fechasOrdenadas,
      });
    } catch (error) {
      console.error("Error al procesar fechas:", error);
      setAvailableDates([]);
    }
  }, [selectedFondoId, servicios]);

  const handleCerrarFecha = async () => {
    if (!selectedFondoId || !selectedDate) {
      toast({
        title: "Error",
        description: "Seleccione un fondo y una fecha válida",
        variant: "destructive",
      });
      return;
    }

    try {
      const serviciosACerrar = servicios.filter((s) => {
        const fechaServicio = new Date(s.fechaRegistro)
          .toISOString()
          .split("T")[0];
        return (
          s.fondoId === selectedFondoId &&
          fechaServicio === selectedDate &&
          s.estado === "Activo"
        );
      });

      if (serviciosACerrar.length === 0) {
        toast({
          title: "Error",
          description: "No hay servicios activos para esta fecha",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/fechacierre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: selectedDate,
          servicioIds: serviciosACerrar.map((s) => s.idServicio),
          digitadorId: user.id,
          fondoId: selectedFondoId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cerrar la fecha");
      }

      // Actualizar estado local
      setServicios((prevServicios) =>
        prevServicios.map((s) =>
          serviciosACerrar.some((sc) => sc.idServicio === s.idServicio)
            ? { ...s, estado: "Inactivo" as const }
            : s
        )
      );

      toast({
        title: "Éxito",
        description: `Fecha ${selectedDate} cerrada correctamente`,
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

  const handlePDF = () => {
    if (!selectedFondoId || !selectedDate) return;

    const serviciosCerrados = servicios.filter(
      (s) =>
        s.fondoId === selectedFondoId &&
        new Date(s.fechaRegistro).toISOString().split("T")[0] ===
          selectedDate &&
        s.estado === "Inactivo"
    );

    if (serviciosCerrados.length === 0) {
      toast({
        title: "Error",
        description: "No hay servicios cerrados para esta fecha",
        variant: "destructive",
      });
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    const fondo =
      fondos.find((f) => f.idFondo === selectedFondoId)?.nombre ||
      "Desconocido";

    doc.setFontSize(16);
    doc.text(`Reporte de Cierre - ${fondo}`, 14, 15);
    doc.setFontSize(12);
    doc.text(
      `Fecha de cierre: ${new Date(selectedDate).toLocaleDateString("es-ES")}`,
      14,
      22
    );

    const headers = [["Planilla", "Cliente", "Sede", "Total", "Diferencia"]];
    const data = serviciosCerrados.map((s) => [
      s.planilla.toString(),
      s.cliente?.name || "N/A",
      s.cliente?.sede?.nombre || "N/A",
      `$${s.Sum_B.toLocaleString("es-ES")}`,
      `$${s.diferencia.toLocaleString("es-ES")}`,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
    });

    doc.save(`Cierre_${fondo}_${selectedDate}.pdf`);
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
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Button
              onClick={() => {
                setIsCheckin(!isCheckin);
                setIsFondo(false);
                setIsProceso(false);
              }}
              className="bg-cyan-700 hover:bg-cyan-900"
            >
              Ver llegadas
            </Button>
            <Button
              onClick={() => {
                setIsProceso(false);
                setIsFondo(!isFondo);
                setIsCheckin(false);
              }}
              className="bg-cyan-700 hover:bg-cyan-900"
            >
              Ver Fondos
            </Button>
            <Button
              onClick={() => {
                setIsFondo(false);
                setIsProceso(!isProceso);
                setIsCheckin(false);
              }}
              className="bg-cyan-700 hover:bg-cyan-900"
            >
              Proceso de Cierre
            </Button>
          </div>
        </Card>

        {isCheckin && (
          <DataTable
            data={checkin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user}
          />
        )}

        {isFondo && (
          <Card className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Listado de Fondos
            </h2>
            <FondosTable fondos={fondos} />
          </Card>
        )}

        {isProceso && (
          <Card className="bg-white p-6 rounded-lg shadow mt-6">
            <ProcesoForm
              fondos={fondos}
              selectedFondoId={selectedFondoId}
              onFondoChange={(e) => setSelectedFondoId(Number(e.target.value))}
              onDateChange={(date) => setSelectedDate(date)}
              onCerrarFecha={handleCerrarFecha}
              availableDates={availableDates}
            />
            {selectedDate && (
              <div className="mt-4">
                <Button
                  onClick={handlePDF}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  Generar PDF para{" "}
                  {new Date(selectedDate).toLocaleDateString("es-ES")}
                </Button>
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Servicios a cerrar:{" "}
                    {
                      servicios.filter(
                        (s) =>
                          s.fondoId === selectedFondoId &&
                          new Date(s.fechaRegistro)
                            .toISOString()
                            .split("T")[0] === selectedDate &&
                          s.estado === "Activo"
                      ).length
                    }
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
};

export default DigitadorOpciones;
