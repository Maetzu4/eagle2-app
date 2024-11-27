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
  servicio: {
    idServicio: number,
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
}

interface Clientes {
  idCliente: number,
  name: string,
  sede: string,
  fondoId: number,
  fondo: {
    idFondo: number,
    nombre: string,
    tipo: string
  },
  checkin_id: number
}

interface usuarios {
  idUsuario: number,
  name: string,
  lastname: string,
  email: string,
  status: string,
  role: string,
  checkinero: {
    idCheckinero: number,
    usuario_id: number
  },
  operario: {
    idOperario: number,
    usuario_id: number
  },
  digitador: {
    idDigitador: number,
    usuario_id: number
  },
  Sede: string
}

interface Fondo {
  idFondo: number,
  nombre: string,
  tipo: string
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
  const [usuarios, setUsuarios] = useState<usuarios[]>([]);
  const [rol, setRol] = useState("");
  const [checkin, setCheckin] = useState<Checkin[]>([]);
  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [formData, setFormData] = useState<Checkin>({
    planilla: 0,
    sello: 0,
    clienteID: 0,
    clientes: {
      idCliente: 0,
      name: "",
      sede: "",
      fondoId: 0,
      checkin_id: 0
    },
    declarado: 0,
    ruta_llegada: 0,
    fechaRegistro: new Date(),
    checkineroId: 0,
    checkinero: {
      idCheckinero: 0,
      usuario_id: 0
    },
    fondoId: 0,
    fondo: {
      idFondo: 0,
      nombre: "",
      tipo: ""
    },
    servicio: {
      idServicio: 0,
      planilla: 0,
      sello: 0,
      fecharegistro: new Date(),
      B_100000: 0,
      B_50000: 0,
      B_20000: 0,
      B_10000: 0,
      B_5000: 0,
      B_2000: 0,
      Sum_B: 0,
      checkin_id: 0,
      checkineroId: 0,
      fondoId: 0,
      operarioId: 0
    }
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

        console.log(fondos)

        // Fetch check-ins
        const checkinsRes = await fetch("/api/checkins");
        if (!checkinsRes.ok) throw new Error("Error al cargar check-ins");
        const checkinsData = await checkinsRes.json();
        setCheckin(checkinsData);

        //Fetch usuarios
        const usuariosRes = await fetch("/api/usuarios");
        if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
        const usuariosData = await usuariosRes.json();
        setUsuarios(usuariosData);

      } catch (err) {
        console.error("Error al cargar los datos:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Este efecto se ejecutará cuando los usuarios se hayan cargado
    if (usuarios.length > 0) {
      const role = usuarios.find((checkinero) => checkinero.email === user.user.email)?.role;
      setRol(role); // Establecer el rol
      console.log(role);
    }
  }, [usuarios, user.user.email]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue = 0;

    // Asegúrate de que los valores numéricos se conviertan a número
    if (["planilla", "sello", "declarado", "ruta_llegada"].includes(name)) {
      parsedValue = parseInt(value, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Lógica para actualizar el cliente y fondo basado en la selección del cliente
    if (name === "clientes") {
      const selectedCliente = clientes.find(cliente => cliente.idCliente === Number(value));
      setFormData((prev) => ({
        ...prev,
        clienteID: selectedCliente ? selectedCliente.idCliente : 0,
        clientes: selectedCliente || prev.clientes,
        fondoId: selectedCliente?.fondo.idFondo || prev.fondoId,
        fondo: {
          ...prev.fondo,
          nombre: selectedCliente?.fondo.nombre || prev.fondo.nombre,
          idFondo: selectedCliente?.fondo.idFondo || prev.fondo.idFondo,
          tipo: selectedCliente?.fondo.tipo || prev.fondo.tipo,
        },
      }));
    }

    setFormData((prev) => {
      const chekineroEnLinea = usuarios.find((checkinero) => checkinero.email === user.user.email)?.checkinero;
      return {
        ...prev,
        checkineroId: chekineroEnLinea?.idCheckinero,
        checkinero: chekineroEnLinea || prev.checkinero, // Si no se encuentra, mantiene el anterior
      };
    });

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const checkinData = {
        ...formData,
        fechaRegistro: formData.fechaRegistro.toISOString(),
        
      };

      const method = formData.idCheckin ? "PUT" : "POST"; // Usar PUT si hay un ID
      const endpoint = "/api/checkins";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkinData),
      });

      if (!res.ok) {
        throw new Error("Error en la solicitud");
      }

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const handleEdit = (checkin: Checkin) => {
    setFormData({
      ...checkin,
      idCheckin: checkin.idCheckin,
      planilla: checkin.planilla,
      sello: checkin.sello,
      declarado: checkin.declarado,
      ruta_llegada: checkin.ruta_llegada,
      fondo: checkin.fondo,
      checkineroId: checkin.checkineroId,
      clienteID: checkin.clienteID,
      clientes: checkin.clientes,
      fechaRegistro: new Date(),
      checkinero: checkin.checkinero
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este check-in?")) {
      return;
    }

    try {
      const res = await fetch(`/api/checkins`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el check-in");
      }

      const deletedCheckin = await res.json();
      console.log("Check-in eliminado:", deletedCheckin);

      // Actualizar el estado para reflejar los cambios
      setCheckin((prev) => prev.filter((item) => item.idCheckin !== id));
    } catch (error) {
      console.error("Error al eliminar el check-in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            Bienvenido, {user.user.name}
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                {rol === "checkinero" && (
                  <LogOutBtn text={texto} />
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">

        {/* Formulario */}
        {rol === "checkinero" && (
          <Card className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Check-in
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-600">Número de Factura</label>
                <input
                  type="number"
                  name="planilla"
                  value={formData.planilla}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Cliente</label>
                <select
                  name="clientes" // El nombre debe coincidir para ser manejado por handleInputChange
                  value={formData.clientes?.idCliente || '0'} // Sincronizado con el idCliente actual
                  onChange={handleInputChange} // Actualiza el estado al cambiar
                  className="w-full px-3 py-2 mt-1 border rounded"
                  required>
                  <option value="0">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.name.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Sello</label>
                <input
                  type="number"
                  name="sello"
                  value={formData.sello}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Valor Declarado</label>
                <input
                  type="number"
                  name="declarado"
                  value={formData.declarado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Ruta</label>
                <input
                  type="number"
                  name="ruta_llegada"
                  value={formData.ruta_llegada}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Fondo</label>
                <input
                  disabled
                  type="text"
                  name="tipo"
                  value={formData.fondo.nombre.replace("_", " ")}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border rounded"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button type="submit" className="bg-cyan-700 hover:bg-cyan-900">
                {formData.idCheckin ? "Actualizar Check-in" : "Agregar Check-in"}
              </Button>

            </div>
          </form>
        </Card>
        )}

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
              {checkin.map((check) => (
                <TableRow key={check.idCheckin}>
                  <TableCell>{check.planilla}</TableCell>
                  <TableCell>{check.sello}</TableCell>
                  <TableCell>{check.declarado}</TableCell>
                  <TableCell>{check.ruta_llegada}</TableCell>
                  <TableCell>
                    {check.clientes.name.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    {check.fechaRegistro
                      ? new Date(check.fechaRegistro).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {usuarios.find((checkinero) => check.checkinero.usuario_id === checkinero.idUsuario)?.name}
                  </TableCell>
                  <TableCell>
                    {rol === "checkinero" && (
                      <Button
                      onClick={() => handleEdit(check)}
                      className="bg-cyan-700 hover:bg-cyan-900"
                    >
                      Editar
                    </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(check.idCheckin!)}
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