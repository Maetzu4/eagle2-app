"use client";

import LogOutBtn from "@/components/logOutBtn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";

interface Checkin {
  idCheckin?: number,
  planilla: number,
  sello: number,
  clienteID: number,
  clientes: {
    idCliente: number,
    name: string,
    sede: string,
    fondoId: number,
    checkin_id: number
  },
  declarado: number,
  ruta_llegada: number,
  fechaRegistro: Date,
  checkineroId: number,
  checkinero: {
    idCheckinero: number,
    usuario_id: number
  },
  fondoId: number,
  fondo: {
    idFondo: number,
    nombre: string,
    tipo: string
  },
  servicio: servicio,
}

interface servicio {
  idServicio?: number,
  planilla: number,
  sello: number,
  fecharegistro: Date,
  B_100000: number,
  B_50000: number,
  B_20000: number,
  B_10000: number,
  B_5000: number,
  B_2000: number,
  Sum_B: number,
  checkin_id: number,
  checkineroId: number,
  fondoId: number,
  operarioId: number
}

export default function IngresoFactura() {
  const [checkin, setCheckin] = useState<Checkin>([]);
  //const [clientes, setClientes] = useState<Clientes[]>([]);
  const [formData, setFormData] = useState<servicio>({
    planilla: 0,
    sello: 0,
    Sum_B: 0,
    fecharegistro: new Date(),
    B_100000: 0,
    B_50000: 0,
    B_20000: 0,
    B_10000: 0,
    B_5000: 0,
    B_2000: 0,
    checkin_id: 0,
    checkineroId: 0,
    fondoId: 0,
    operarioId: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value, 10) || 0;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: numericValue };

      // Calcular Sum_B basado en los valores de los billetes
      const newSum_B =
        updatedFormData.B_100000 * 100000 +
        updatedFormData.B_50000 * 50000 +
        updatedFormData.B_20000 * 20000 +
        updatedFormData.B_10000 * 10000 +
        updatedFormData.B_5000 * 5000 +
        updatedFormData.B_2000 * 2000;

      return { ...updatedFormData, Sum_B: newSum_B };
    });
    console.log(formData)
  };

  /* const handleIncrement = (denom: string) => {
    setFormData((prev) => {
      const updatedBilletes = {
        ...prev.billetes,
        [denom]: prev.billetes[denom] + 1,
      };
      const newTotal = Object.entries(updatedBilletes).reduce(
        (acc, [key, count]) => acc + parseInt(key) * count,
        0
      );
      return { ...prev, billetes: updatedBilletes, total: newTotal };
    });
  }; */

  /* const handleDecrement = (denom: string) => {
    setFormData((prev) => {
      const updatedBilletes = {
        ...prev.billetes,
        [denom]: Math.max(prev.billetes[denom] - 1, 0),
      };
      const newTotal = Object.entries(updatedBilletes).reduce(
        (acc, [key, count]) => acc + parseInt(key) * count,
        0
      );
      return { ...prev, billetes: updatedBilletes, total: newTotal };
    });
  }; */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Lógica para enviar datos al backend
  };

  const handleCerrarConteo = () => {
    console.log("Cerrando conteo...");
    // Lógica para manejar el cierre de conteo
  };

  const consultar = async () => {
    try {
      const response = await fetch(`/api/checkin?planilla=${formData.planilla}`);

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Error al consultar el checkin");
        return;
      }

      const data = await response.json();
      console.log("Checkin obtenido:", data);
      setCheckin(data); // Asignar el checkin obtenido al estado
    } catch (error) {
      console.error("Error al consultar el checkin:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        /*         // Fetch clientes
                const clientesRes = await fetch("/api/clientes");
                if (!clientesRes.ok) throw new Error("Error al cargar clientes");
                const clientesData = await clientesRes.json();
                setClientes(clientesData);
         */
        // Fetch check-ins
        const checkinsRes = await fetch("/api/checkins");
        if (!checkinsRes.ok) throw new Error("Error al cargar check-ins");
        const checkinsData = await checkinsRes.json();
        setCheckin(checkinsData);

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
          <h1 className="text-4xl font-bold">Bienvenido</h1>
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
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Factura de detallado de cliente
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
              <div className="items-center gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="planilla"
                    className="block text-sm font-medium text-gray-600">
                    Número de Planilla:
                  </label>
                </div>
                <div className="flex gap-4">
                  <input
                    type="number"
                    id="planilla"
                    name="planilla"
                    className="border p-2 w-full"
                    value={formData.planilla}
                    onChange={handleInputChange} />
                  <Button
                    onClick={consultar}
                    className="bg-cyan-700 hover:bg-cyan-900">
                    Consultar
                  </Button>
                </div>
              </div>


              <div>
                <div>
                  <label
                    htmlFor="sello"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Sello de la Factura:
                  </label>
                  <input
                    type="text"
                    id="sello"
                    name="sello"
                    className="border p-2 w-full"
                    value={checkin?.sello || ""}
                    readOnly
                  />
                </div>

                {/* <label
                  htmlFor="nombreCliente"
                  className="block text-sm font-medium text-gray-600"
                >
                  Nombre del Cliente:
                </label>
                <input
                  type="text"
                  id="nombreCliente"
                  name="nombreCliente"
                  className="border p-2 w-full"
                  value={formData.nombreCliente}
                  readOnly
                /> */}
              </div>

              <div>
                <label
                  htmlFor="sello"
                  className="block text-sm font-medium text-gray-600"
                >
                  Sello de la Factura:
                </label>
                <input
                  type="text"
                  id="sello"
                  name="sello"
                  className="border p-2 w-full"
                  value={formData.sello}
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="valorDeclarado"
                  className="block text-sm font-medium text-gray-600"
                >
                  Valor Declarado:
                </label>
                {/* <input
                  type="number"
                  id="valorDeclarado"
                  name="valorDeclarado"
                  className="border p-2 w-full"
                  value={formData.valorDeclarado}
                  readOnly
                /> */}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Cantidad de Billetes por Denominación
            </h3>

            <div className="flex gap-10 ml-16 mr-16">
              <div>
                <Table className="w-full mt-4 border border-gray-300">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left">
                        Denominación
                      </TableHead>
                      <TableHead className="px-4 py-2 text-left">Cantidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  {/* <TableBody>
                    {Object.keys(formData.billetes).map((denom) => (
                      <TableRow key={denom}>
                        <TableCell className="px-4 py-2">
                          ${parseInt(denom).toLocaleString()}
                        </TableCell>
                        <TableCell className="flex items-center gap-2 px-4 py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDecrement(denom)}
                          >
                            -
                          </Button>
                          <input
                            type="number"
                            name={`billete_${denom}`}
                            className="border p-1 w-16 text-center"
                            value={formData.billetes[denom]}
                            onChange={handleInputChange}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIncrement(denom)}
                          >
                            +
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody> */}
                  <tfoot>
                    <TableRow>
                      <TableCell className="px-4 py-2 font-bold">Total</TableCell>
                      <TableCell className="px-4 py-2">
                        {/* <input
                          type="text"
                          value={formData.total}
                          readOnly
                          className="border p-1 w-full text-center"
                        /> */}
                      </TableCell>
                    </TableRow>
                  </tfoot>
                </Table>
              </div>

              <div>
                <Table className="w-full mt-4 border border-gray-300">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left">
                        Observación
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {/* <TableCell className="px-4 py-2">
                        <Textarea id="observacion"
                          name="observacion"
                          className="border p-2 w-full"
                          value={formData.observacion}
                          onChange={handleInputChange} />
                      </TableCell> */}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Button
                type="submit"
                className="bg-cyan-700 hover:bg-cyan-900"
              >
                Guardar Información
              </Button>

              <Button
                type="button"
                className="bg-red-600 hover:bg-red-800"
                onClick={handleCerrarConteo}
              >
                Cerrar Conteo
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
