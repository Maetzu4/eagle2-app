"use client";

import { Button } from "@/components/ui/button";
import LogOutBtn from "@/components/logOutBtn";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DateTime } from "next-auth/providers/kakao";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    lastName: string;
  };
}

interface DigitadorOpcionesProps {
  user: Session;
}

// types/fondo.ts

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
  fecharegistro: DateTime;
  Sum_B: number;
  B_100000: number,
  B_50000: number,
  B_20000: number,
  B_10000: number,
  B_5000: number,
  B_2000: number,
}

interface Fondo {
  idFondo: number;
  nombre: string;
  tipo: "Publico" | "Privado";
  clientes: Cliente[];
  checkins: Checkin[];
  servicios: Servicio[];
}


const DigitadorOpciones: React.FC<DigitadorOpcionesProps> = ({ user }) => {

  const [isFondo, setIsFondo] = useState<Boolean>(false);
  const [isProceso, setIsProceso] = useState<Boolean>(false);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [calculo, setCalculo] = useState<Boolean>(false);
  const [selectedFondoId, setSelectedFondoId] = useState<number | null>(null); // Fondo seleccionado
  const [inactiveDates, setInactiveDates] = useState<string[]>([]); // Fechas inactivas del fondo seleccionado
  const [sumResult, setSumResult] = useState<number | null>(null); // Almacena la suma calculada

  // Manejar cálculo de la suma
  const handleCalcular = () => {
    if (selectedFondoId === null) return;

    const selectedFondo = fondos.find((fond) => fond.idFondo === selectedFondoId);
    if (selectedFondo) {
      const suma = selectedFondo.servicios
        .filter((servicio) => servicio.estado === "Inactivo")
        .reduce((acc, servicio) => acc + servicio.Sum_B, 0); // Calcula la suma de Sum_B
      setSumResult(suma);
    }

    setCalculo(prevState => !prevState);

  };

  function showProceso() {
    if (isFondo) {
      setIsFondo(false)
    }
    setIsProceso(prevState => !prevState);
  }

  function showFondo() {
    if (isProceso) {
      setIsProceso(false)
    }
    setIsFondo(prevState => !prevState); // Alterna entre true y false
  }

  const abrirRuta = () => {
    window.open('/checkin', '_blank');
  };

  function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  function handlePDF() {
    if (!fondos.length || !selectedFondoId) {
      alert("No hay datos disponibles para generar el PDF.");
      return;
    }

    // Buscar el fondo seleccionado
    const selectedFondo = fondos.find((fond) => fond.idFondo === selectedFondoId);

    if (!selectedFondo) {
      alert("Fondo seleccionado no encontrado.");
      return;
    }

    // Filtrar solo los servicios inactivos del fondo seleccionado
    const inactiveServices = selectedFondo.servicios.filter(
      (servicio) => servicio.estado === "Inactivo"
    );

    if (!inactiveServices.length) {
      alert("No hay servicios inactivos para generar el PDF.");
      return;
    }

    // Crear el documento PDF
    const doc = new jsPDF({ orientation: "landscape" });

    // Obtener fecha actual
    const currentDate = new Date().toLocaleDateString("es-ES");

    // Configuración para centrar el título
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `Reporte de Servicios Transportadora De Valores - Fondo: ${selectedFondo.nombre} `;
    const titleWidth = doc.getTextWidth(title);

    // Añadir el título centrado
    const dateText = `Fecha: ${currentDate}`;
    doc.setFontSize(16);
    doc.text(title, (pageWidth - titleWidth) / 2, 15);

    // Añadir fecha en el encabezado
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - dateWidth - 10, 15);

    // Encabezado de la tabla
    const headers = [
      ["Planilla", "Nombre del Cliente", "Sede del cliente", "100K", "50K", "20K", "10K", "5K", "2K", "Total Verificado"],
    ];

    // Datos para la tabla
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

    // Calcular el total de la columna Sum_B
    const totalSumB = inactiveServices.reduce((acc, servicio) => acc + servicio.Sum_B, 0);

    // Añadir fila con el total al final
    data.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Total:",
      totalSumB.toString(),
    ]);

    // Usar autoTable para renderizar la tabla
    doc.autoTable({
      head: headers,
      body: data,
      startY: 25,
      theme: "grid",
      headStyles: {
        fillColor: [8, 145, 178], // Cian
        textColor: [0, 0, 0],    // Negro
        fontStyle: "bold",
      },
      bodyStyles: {
        halign: "center", // Centrar texto en celdas
      },
      didDrawCell: (data: { row: { index: any; }; column: { index: any; }; cell: any; }) => {
        const rowIndex = data.row.index;
        const columnIndex = data.column.index;

        // Verificar si es la celda del total (última fila y columna Sum_B)
        if (rowIndex === inactiveServices.length && columnIndex === 8) {
          const cell = data.cell;
          doc.setFont("Helvetica", "bold");
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.5);
          doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height); // Subrayado
        }
      },
    });

    // Descargar el PDF
    doc.save(`Reporte_Servicios_${currentDate}_Fondo_${selectedFondo.nombre}.pdf`);
  }


  const handleFondoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fondoId = parseInt(e.target.value); // Obtén el ID del fondo seleccionado
    setSelectedFondoId(fondoId);

    // Busca el fondo seleccionado y actualiza las fechas inactivas
    const selectedFondo = fondos.find((fond) => fond.idFondo === fondoId);
    if (selectedFondo) {
      let fechas = selectedFondo.servicios
        .filter((servicio) => servicio.estado === "Inactivo") // Solo servicios inactivos
        .map((servicio) => new Date(servicio.fecharegistro).toLocaleDateString()); // Convierte fechas al formato adecuado

      const fechasC = fechas.filter(onlyUnique)
      setInactiveDates(fechasC);
    } else {
      setInactiveDates([]); // Si no hay fondo seleccionado, resetea las fechas
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Fecha seleccionada:", e.target.value);
  };

  const handleSubmit = () => {

  }

  useEffect(() => {
    const fetchData = async () => {
      try {

        // Fetch fondos
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
          <h1 className="text-4xl font-bold">Bienvenido, {user.user.name}</h1>
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
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md">Ver llegadas</Button>
            </div>
            <div className="items-center gap-4">
              <Button
                onClick={showFondo}
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md">
                Ver Fondos
              </Button>
            </div>
            <div className="items-center gap-4">
              <Button
                onClick={showProceso}
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md">
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
                  <label className="block text-sm font-medium text-gray-600">Fondo</label>
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
                  <label className="block text-sm font-medium text-gray-600">Fechas a cerrar</label>
                  <select
                    name="fecha"
                    disabled={!selectedFondoId} // Deshabilita si no hay fondo seleccionado
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
                    onClick={handleCalcular} className="bg-cyan-700 hover:bg-cyan-900">
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
            <p className="text-gray-600">Suma total de servicios inactivos: {sumResult}</p>
            <br />
            <div>
              <Button
                type="button"
                onClick={handlePDF} className="bg-cyan-700 hover:bg-cyan-900">
                Crear PDF
              </Button>
            </div>
          </Card>
        )}

      </main>
    </div>
  );
}

export default DigitadorOpciones;