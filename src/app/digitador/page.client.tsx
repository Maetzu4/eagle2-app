"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Cliente {
  idCliente: number;
  name: string;
  sede: string;
}

interface Checkin {
  planilla: number;
  sello: number;
  declarado: number;
  fechaRegistro: string;
}

interface Servicio {
  planilla: number;
  sello: number;
  estado: "Activo" | "Inactivo";
  fecharegistro: Date;
  Sum_B: number;
  B_100000: number;
  B_50000: number;
  B_20000: number;
  B_10000: number;
  B_5000: number;
  B_2000: number;
}

interface Fondo {
  idFondo: number;
  nombre: string;
  tipo: "Publico" | "Privado";
  clientes: Cliente[];
  checkins: Checkin[];
  servicios: Servicio[];
}

interface DigitadorOpcionesProps {
  rol: string; // Solo necesitamos el rol
}

const DigitadorOpciones: React.FC<DigitadorOpcionesProps> = ({ rol }) => {
  const [isFondo, setIsFondo] = useState<boolean>(false);
  const [isProceso, setIsProceso] = useState<boolean>(false);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [calculo, setCalculo] = useState<boolean>(false);
  const [selectedFondoId, setSelectedFondoId] = useState<number | null>(null);
  const [inactiveDates, setInactiveDates] = useState<string[]>([]);
  const [sumResult, setSumResult] = useState<number | null>(null);

  const handleCalcular = () => {
    if (selectedFondoId === null) return;

    const selectedFondo = fondos.find(
      (fond) => fond.idFondo === selectedFondoId
    );
    if (selectedFondo) {
      const suma = selectedFondo.servicios
        .filter((servicio) => servicio.estado === "Inactivo")
        .reduce((acc, servicio) => acc + servicio.Sum_B, 0);
      setSumResult(suma);
    }

    setCalculo((prevState) => !prevState);
  };

  const showProceso = () => {
    if (isFondo) setIsFondo(false);
    setIsProceso((prevState) => !prevState);
  };

  const showFondo = () => {
    if (isProceso) setIsProceso(false);
    setIsFondo((prevState) => !prevState);
  };

  const abrirRuta = () => {
    window.open("/checkin", "_blank");
  };

  const onlyUnique = (value: string, index: number, self: string[]) => {
    return self.indexOf(value) === index;
  };

  const handlePDF = () => {
    if (!fondos.length || !selectedFondoId) {
      alert("No hay datos disponibles para generar el PDF.");
      return;
    }

    const selectedFondo = fondos.find(
      (fond) => fond.idFondo === selectedFondoId
    );
    if (!selectedFondo) {
      alert("Fondo seleccionado no encontrado.");
      return;
    }

    const inactiveServices = selectedFondo.servicios.filter(
      (servicio) => servicio.estado === "Inactivo"
    );

    if (!inactiveServices.length) {
      alert("No hay servicios inactivos para generar el PDF.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    const currentDate = new Date().toLocaleDateString("es-ES");
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `Reporte de Servicios Transportadora De Valores - Fondo: ${selectedFondo.nombre} `;
    const titleWidth = doc.getTextWidth(title);
    const dateText = `Fecha: ${currentDate}`;

    doc.setFontSize(16);
    doc.text(title, (pageWidth - titleWidth) / 2, 15);
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - dateWidth - 10, 15);

    const data = inactiveServices.map((servicio) => [
      servicio.planilla,
      selectedFondo.clientes.map((c) => c.name).join(", "),
      selectedFondo.clientes.map((c) => c.sede).join(", "),
      servicio.B_100000 || 0,
      servicio.B_50000 || 0,
      servicio.B_20000 || 0,
      servicio.B_10000 || 0,
      servicio.B_5000 || 0,
      servicio.B_2000 || 0,
      servicio.Sum_B,
    ]);

    const totalSumB = inactiveServices.reduce(
      (acc, servicio) => acc + servicio.Sum_B,
      0
    );
    data.push(["", "", "", "", "", "", "", "", "Total:", totalSumB.toString()]);

    doc.save(
      `Reporte_Servicios_${currentDate}_Fondo_${selectedFondo.nombre}.pdf`
    );
    alert("PDF generado y descargado correctamente.");
  };

  const handleFondoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fondoId = parseInt(e.target.value);
    setSelectedFondoId(fondoId);

    const selectedFondo = fondos.find((fond) => fond.idFondo === fondoId);
    if (selectedFondo) {
      const fechas = selectedFondo.servicios
        .filter((servicio) => servicio.estado === "Inactivo")
        .map((servicio) =>
          new Date(servicio.fecharegistro).toLocaleDateString()
        );

      const fechasC = fechas.filter(onlyUnique);
      setInactiveDates(fechasC);
    } else {
      setInactiveDates([]);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Fecha seleccionada:", e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fondosRes = await fetch("/api/fondos");
        if (!fondosRes.ok) throw new Error("Error al cargar fondos");
        const fondosData = await fondosRes.json();
        setFondos(fondosData);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Bienvenido, {rol}</h1>
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
            Gestion de procesos
          </h2>
          <div className="flex justify-between">
            <div className="items-center gap-4">
              <Button
                onClick={abrirRuta}
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md"
              >
                Ver llegadas
              </Button>
            </div>
            <div className="items-center gap-4">
              <Button
                onClick={showFondo}
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md"
              >
                Ver Fondos
              </Button>
            </div>
            <div className="items-center gap-4">
              <Button
                onClick={showProceso}
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md"
              >
                Proceso de Cierre de Fecha
              </Button>
            </div>
          </div>
        </Card>

        {isFondo && (
          <Card className="bg-white p-6 rounded-lg shadow mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Listado de Fondos
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codigo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Clientes</TableHead>
                  <TableHead>Fechas de cierre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fondos.map((fond) => (
                  <TableRow key={fond.idFondo}>
                    <TableCell>{fond.idFondo}</TableCell>
                    <TableCell>{fond.nombre}</TableCell>
                    <TableCell>{fond.tipo}</TableCell>
                    <TableCell>
                      {fond.clientes.map((client, index) => (
                        <span key={index}>
                          - {client.name.replace("_", " ")}
                          <br />
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>fechas</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {isProceso && (
          <Card className="bg-white p-6 rounded-lg shadow mt-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Proceso de Fechas de cierre
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Fondo
                  </label>
                  <select
                    name="fondos"
                    value={selectedFondoId || ""}
                    onChange={handleFondoChange}
                    className="w-full px-3 py-2 mt-1 border rounded"
                    required
                  >
                    <option value="">Seleccione un fondo</option>
                    {fondos.map((fond) => (
                      <option key={fond.idFondo} value={fond.idFondo}>
                        {fond.idFondo + " " + fond.nombre.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Fechas a cerrar
                  </label>
                  <select
                    name="fecha"
                    disabled={!selectedFondoId}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 mt-1 border rounded"
                    required
                  >
                    <option value="">Seleccione una fecha</option>
                    {inactiveDates.map((fecha, index) => (
                      <option key={index} value={fecha}>
                        {fecha}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Button
                    type="button"
                    onClick={handleCalcular}
                    className="bg-cyan-700 hover:bg-cyan-900"
                  >
                    Calcular
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}

        {calculo && (
          <Card className="bg-white rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-lg font-bold text-gray-800">
              Resultado del cálculo
            </h2>
            <p className="text-gray-600">
              Suma total de servicios inactivos: {sumResult}
            </p>
            <br />
            <div>
              <Button
                type="button"
                onClick={handlePDF}
                className="bg-cyan-700 hover:bg-cyan-900"
              >
                Crear PDF
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DigitadorOpciones;
