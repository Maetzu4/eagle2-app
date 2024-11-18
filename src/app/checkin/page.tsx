"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import router from "next/router";

interface Record {
  numero_factura: string;
  nombre_cliente: string;
  sello: string;
  valor_declarado: string;
  fondo: string;
  ruta: string;
}

export default function CheckinLlegadas() {
  const [records, setRecords] = useState<Record[]>([
    {
      numero_factura: "FAC001",
      nombre_cliente: "Cliente A",
      sello: "Sello1",
      valor_declarado: "100000",
      fondo: "Fondo A",
      ruta: "Ruta 1",
    },
    {
      numero_factura: "FAC002",
      nombre_cliente: "Cliente B",
      sello: "Sello2",
      valor_declarado: "200000",
      fondo: "Fondo B",
      ruta: "Ruta 2",
    },
  ]);

  const [formData, setFormData] = useState<Record>({
    numero_factura: "",
    nombre_cliente: "",
    sello: "",
    valor_declarado: "",
    fondo: "",
    ruta: "",
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRecords((prevRecords) => [...prevRecords, formData]);
    setFormData({
      numero_factura: "",
      nombre_cliente: "",
      sello: "",
      valor_declarado: "",
      fondo: "",
      ruta: "",
    });
  };

  const handleDelete = (index: number) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  const handleEdit = (index: number) => {
    const recordToEdit = records[index];
    setFormData(recordToEdit);
  };

  return (

    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Check-in de Llegadas</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button onClick={() => router.push("/logout")} className="hover:underline">
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">
        {/* Formulario */}
        <Card className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-6 text-gray-800">Formulario de Check-in</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Campos del formulario */}
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-600"
                  >
                    {key.replace("_", " ").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={(formData as any)[key]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 mt-1 border rounded"
                    required
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-6">
              <Button type="submit" className="bg-cyan-700 hover:bg-cyan-900">
                Agregar Llegada
              </Button>
            </div>
          </form>
        </Card>

        {/* Tabla de registros */}
        <Card className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Listado de Formatos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Factura</TableHead>
                <TableHead>Nombre del Cliente</TableHead>
                <TableHead>Sello</TableHead>
                <TableHead>Valor Declarado</TableHead>
                <TableHead>Fondo</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.numero_factura}</TableCell>
                  <TableCell>{record.nombre_cliente}</TableCell>
                  <TableCell>{record.sello}</TableCell>
                  <TableCell>{record.valor_declarado}</TableCell>
                  <TableCell>{record.fondo}</TableCell>
                  <TableCell>{record.ruta}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(index)}
                      className="mr-2"
                    >
                      Modificar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(index)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
