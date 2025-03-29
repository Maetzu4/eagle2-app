// @/app/digitador/page.client.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { Card } from "@/components/ui/card";
import { FondosTable } from "@/components/Digitador/fondosTable";
import { ProcesoForm } from "@/components/Digitador/procesoForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Servicio } from "@/types/interfaces";
import { useToast } from "@/hooks/General/use-toast";
import { user } from "@/types/interfaces";
import { useFetchData } from "@/hooks/General/useFetchData";

interface DigitadorOpcionesProps {
  user: user;
}

const DigitadorOpciones: React.FC<DigitadorOpcionesProps> = ({ user }) => {
  const { toast } = useToast();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isFondo, setIsFondo] = useState<boolean>(false);
  const [isProceso, setIsProceso] = useState<boolean>(false);
  const [selectedFondoId, setSelectedFondoId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { fondos } = useFetchData(user.email);

  const handleCerrarFecha = async () => {
    if (!selectedFondoId || !selectedDate) {
      toast({
        title: "Error",
        description: "Seleccione un fondo y una fecha",
        variant: "destructive",
      });
      return;
    }

    try {
      // Obtener servicios activos para la fecha seleccionada
      const serviciosACerrar = servicios.filter(
        (s) =>
          s.fondoId === selectedFondoId &&
          new Date(s.fecharegistro).toISOString().split("T")[0] ===
            selectedDate &&
          s.estado === "Activo"
      );

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

      if (!response.ok) throw new Error("Error en el servidor");

      // Actualizar datos
      await refreshData();

      toast({
        title: "Éxito",
        description: `Fecha ${selectedDate} cerrada correctamente`,
        variant: "normal",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Error al cerrar la fecha",
        variant: "destructive",
      });
    }
  };

  const handlePDF = () => {
    if (!selectedFondoId || !selectedDate) return;

    const serviciosCerrados = servicios.filter(
      (s) =>
        s.fondoId === selectedFondoId &&
        new Date(s.fecharegistro).toISOString().split("T")[0] ===
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

    // Configuración del documento
    doc.setFontSize(16);
    doc.text(`Reporte de Cierre - ${fondo}`, 14, 15);
    doc.setFontSize(12);
    doc.text(
      `Fecha de cierre: ${new Date(selectedDate).toLocaleDateString("es-ES")}`,
      14,
      22
    );

    // Datos de la tabla
    const headers = [["Planilla", "Cliente", "Sede", "Total", "Diferencia"]];
    const data = serviciosCerrados.map((s) => [
      s.planilla.toString(),
      s.cliente?.name || "N/A",
      s.cliente?.sede?.nombre || "N/A",
      `$${s.Sum_B.toLocaleString("es-ES")}`,
      `$${s.diferencia.toLocaleString("es-ES")}`,
    ]);

    // Generar tabla
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
    });

    doc.save(`Cierre_${fondo}_${selectedDate}.pdf`);
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [serviciosRes] = await Promise.all([fetch("/api/servicio")]);

      const [serviciosData] = await Promise.all([serviciosRes.json()]);
      setServicios(serviciosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast({
        title: "Error",
        description: "Error cargando datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 flex items-center justify-center">
        <div className="text-white text-6xl font-bold">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            Bienvenido,{" "}
            {user.name + "usuarios[0].name + " + " + usuarios[0].lastname"}
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <LogOutBtn text={"cerrar sesión"} />
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
              onClick={() => window.open("/checkin", "_blank")}
              className="bg-cyan-700 hover:bg-cyan-900"
            >
              Ver llegadas
            </Button>
            <Button
              onClick={() => {
                setIsProceso(false);
                setIsFondo(!isFondo);
              }}
              className="bg-cyan-700 hover:bg-cyan-900"
            >
              Ver Fondos
            </Button>
            <Button
              onClick={() => {
                setIsFondo(false);
                setIsProceso(!isProceso);
              }}
              className="bg-cyan-700 hover:bg-cyan-900"
            >
              Proceso de Cierre
            </Button>
          </div>
        </Card>

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
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
};

export default DigitadorOpciones;
