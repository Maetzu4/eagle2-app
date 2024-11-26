"use client";

import { useState, useEffect } from "react";
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
import LogOutBtn from "@/components/logOutBtn";

interface Record {
  id?: number;
  num_factura: string;
  sello: string;
  valor_declarado: string;
  ruta_llegada: string;
  fecha_registro?: string;
  userId: string;
  clienteId: number;
  nombre_cliente?: string;
  user?: {
    name: string;
    lastName: string;
  };
  cliente?: {
    nom_cliente: string;
    fondoId: number;
  };
}

interface Cliente {
  id: number;
  nom_cliente: string;
}

interface Fondo {
  id: number;
  nom_cliente: string;
  tipo: string;
}

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    lastName: string;
  };
}

interface CheckinLlegadasProps {
  user: Session;
}

const CheckinLlegadas: React.FC<CheckinLlegadasProps> = ({ user }) => {
  const texto = "Cerrar sesión";
  const [records, setRecords] = useState<Record[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [formData, setFormData] = useState<Record>({
    num_factura: "",
    sello: "",
    valor_declarado: "",
    ruta_llegada: "",
    userId: user.user.email,
    clienteId: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clientes
        const clientesRes = await fetch("/api/clientes");
        if (!clientesRes.ok) throw new Error("Error al cargar clientes");
        const clientesData = await clientesRes.json();
        setClientes(clientesData);
  
        // Fetch fondos
        const fondosRes = await fetch("/api/fondos");
        if (!fondosRes.ok) throw new Error("Error al cargar fondos");
        const fondosData = await fondosRes.json();
        setFondos(fondosData);
  
        // Fetch check-ins
        const checkinsRes = await fetch("/api/checkins");
        if (!checkinsRes.ok) throw new Error("Error al cargar check-ins");
        const checkinsData = await checkinsRes.json();
        setRecords(checkinsData);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    };
  
    fetchData();
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,
      // Update nombre when clienteId or fondoId changes
      ...(name === 'clienteId' ? { 
        nombre_cliente: clientes.find(c => c.id === Number(value))?.nom_cliente 
      } : {}),
      ...(name === 'fondoId' ? { 
        nombre_fondo: fondos.find(f => f.id === Number(value))?.nom_cliente 
      } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newCheckin = { 
        ...formData,
        userId: user.user.email
      };

      const res = await fetch("/api/checkins", {
        method: formData.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCheckin),
      });

      const createdCheckin = await res.json();
      
      // Update records
      if (formData.id) {
        // Update existing record
        setRecords(prev => prev.map(record => 
          record.id === createdCheckin.id 
            ? { 
                ...createdCheckin, 
                user: { name: user.user.name, lastName: user.user.lastName },
                cliente: { nom_cliente: formData.nombre_cliente || '' },
              } 
            : record
        ));
      } else {
        // Add new record
        setRecords((prev) => [
          ...prev,
          {
            ...createdCheckin,
            user: { name: user.user.name, lastName: user.user.lastName },
            cliente: { nom_cliente: formData.nombre_cliente || '' },
          },
        ]);
      }

      // Reset form
      setFormData({
        num_factura: "",
        sello: "",
        valor_declarado: "",
        ruta_llegada: "",
        userId: user.user.id,
        clienteId: 0,
      });
    } catch (error) {
      console.error("Error al agregar/actualizar el check-in:", error);
    }
  };

  const handleEdit = (record: Record) => {
    if (record.userId !== user.user.id) {
      alert("Solo puedes modificar los check-ins que tú creaste.");
      return;
    }
    setFormData({
      id: record.id,
      num_factura: record.num_factura,
      sello: record.sello,
      valor_declarado: record.valor_declarado,
      ruta_llegada: record.ruta_llegada,
      userId: user.user.id,
      clienteId: record.clienteId,
      nombre_cliente: record.cliente?.nom_cliente || record.nombre_cliente,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/checkins`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      console.error("Error al eliminar el check-in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Bienvenido, {user.user.name} {user.user.lastName}
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <LogOutBtn text={texto} />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Formulario */}
        <Card className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Formulario de Check-in
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-600">Número de Factura</label>
                <input
                  type="text"
                  name="num_factura"
                  value={formData.num_factura}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Cliente</label>
                <select
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nom_cliente}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Sello</label>
                <input
                  type="text"
                  name="sello"
                  value={formData.sello}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Valor Declarado</label>
                <input
                  type="text"
                  name="valor_declarado"
                  value={formData.valor_declarado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Ruta</label>
                <input
                  type="text"
                  name="ruta_llegada"
                  value={formData.ruta_llegada}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button type="submit" className="bg-cyan-700 hover:bg-cyan-900">
                {formData.id ? "Actualizar Check-in" : "Agregar Check-in"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Tabla de registros */}
        <Card className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Listado de Check-ins
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Factura</TableHead>
                <TableHead>Sello</TableHead>
                <TableHead>Valor Declarado</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Creado Por</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.num_factura}</TableCell>
                  <TableCell>{record.sello}</TableCell>
                  <TableCell>{record.valor_declarado}</TableCell>
                  <TableCell>{record.ruta_llegada}</TableCell>
                  <TableCell>
                    {record.cliente?.nom_cliente || record.nombre_cliente || ''}
                  </TableCell>
                  <TableCell>
                    {record.fecha_registro
                      ? new Date(record.fecha_registro).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {record.user 
                      ? `${record.user.name} ${record.user.lastName}` 
                      : ''}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEdit(record)}
                      className="mr-2 bg-blue-600 hover:bg-blue-800"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(record.id!)}
                      className="bg-red-600 hover:bg-red-800"
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
};

export default CheckinLlegadas;