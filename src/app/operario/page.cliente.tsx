//@/app/operario/page.client.tsx
"use client";
import LogOutBtn from "@/components/Auth/logOutBtn";
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
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

// Interfaces (sin cambios)
interface Checkin {
  idCheckin?: number;
  planilla: number;
  sello: number;
  clienteId: number;
  clientes: {
    idCliente: number;
    name: string;
    sede: string;
    fondoId: number;
    checkin_id: number;
  };
  declarado: number;
  ruta_llegada: number;
  fechaRegistro: Date;
  checkineroId: number;
  checkinero: {
    idCheckinero: number;
    usuario_id: number;
  };
  fondoId: number;
  fondo: {
    idFondo: number;
    nombre: string;
    tipo: string;
  };
  servicio: servicio;
}

interface servicio {
  idServicio?: number;
  planilla?: number;
  sello?: number;
  fecharegistro: Date;
  estado: string;
  clienteId?: number;
  observacion: string;
  diferencia: number;
  B_100000: number;
  B_50000: number;
  B_20000: number;
  B_10000: number;
  B_5000: number;
  B_2000: number;
  Sum_B: number;
  checkin_id: number;
  checkineroId: number;
  fondoId: number;
  operarioId: number;
}

interface usuarios {
  idUsuario: number;
  name: string;
  email: string;
  status: string;
  role: string;
  checkinero: {
    idCheckinero: number;
    usuario_id: number;
  };
  operario: {
    idOperario: number;
    usuario_id: number;
  };
  digitador: {
    idDigitador: number;
    usuario_id: number;
  };
  Sede: string;
}

// interface Session {
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role?: string;
//   };
// }

interface IngresoFacturaProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  }; // Ajusta la interfaz para que coincida con lo que estás pasando
}

const IngresoFactura: React.FC<IngresoFacturaProps> = ({ user }) => {
  const [error, setError] = useState<string | null>(null);
  const [checkin, setCheckin] = useState<Checkin>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const [usuarios, setUsuarios] = useState<usuarios[]>([]);
  const [formData, setFormData] = useState<servicio>({
    Sum_B: 0,
    estado: "",
    observacion: "",
    diferencia: 0,
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

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Encuentra el operario en línea
    const operarioEnLinea = usuarios.find(
      (operario) => operario.email === user.email
    )?.operario;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      operarioId: operarioEnLinea?.idOperario || prev.operarioId, // Actualiza el operarioId si es necesario
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const numericValue = parseInt(value, 10);

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

      // Calcular diferencia con el valor declarado
      const diferencia = newSum_B - (checkin?.declarado || 0);

      return { ...updatedFormData, Sum_B: newSum_B, diferencia };
    });
  };

  const handleIncrement = (
    denom: keyof Pick<
      servicio,
      "B_100000" | "B_50000" | "B_20000" | "B_10000" | "B_5000" | "B_2000"
    >
  ) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [denom]: prev[denom] + 1,
      };

      const newSum_B =
        updatedFormData.B_100000 * 100000 +
        updatedFormData.B_50000 * 50000 +
        updatedFormData.B_20000 * 20000 +
        updatedFormData.B_10000 * 10000 +
        updatedFormData.B_5000 * 5000 +
        updatedFormData.B_2000 * 2000;

      const diferencia = newSum_B - (checkin?.declarado || 0);

      return { ...updatedFormData, Sum_B: newSum_B, diferencia };
    });
  };

  const handleDecrement = (
    denom: keyof Pick<
      servicio,
      "B_100000" | "B_50000" | "B_20000" | "B_10000" | "B_5000" | "B_2000"
    >
  ) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [denom]: Math.max(prev[denom] - 1, 0),
      };

      const newSum_B =
        updatedFormData.B_100000 * 100000 +
        updatedFormData.B_50000 * 50000 +
        updatedFormData.B_20000 * 20000 +
        updatedFormData.B_10000 * 10000 +
        updatedFormData.B_5000 * 5000 +
        updatedFormData.B_2000 * 2000;

      const diferencia = newSum_B - (checkin?.declarado || 0);

      return { ...updatedFormData, Sum_B: newSum_B, diferencia };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setError(null);
    e.preventDefault();
    try {
      if (formData.planilla === 0) {
        setError("el numero de planilla debe ser mayor a 0");
        return;
      }

      const serviceData = {
        ...formData,
        planilla: checkin?.planilla || 0, // Valor del checkin
        sello: checkin?.sello || 0, // Valor del checkin
        estado: "Inactivo", // Default: Activo
        observacion: formData.observacion || "",

        // Valores relacionados con billetes
        B_100000: formData.B_100000,
        B_50000: formData.B_50000,
        B_20000: formData.B_20000,
        B_10000: formData.B_10000,
        B_5000: formData.B_5000,
        B_2000: formData.B_2000,
        Sum_B: formData.Sum_B,
        diferencia: formData.diferencia,

        // Relacionados con otros modelos
        fecharegistro: new Date(formData.fecharegistro).toISOString(),
        clienteId: checkin?.clienteId || 0,
        checkin_id: checkin?.idCheckin || 0,
        checkineroId: checkin?.checkineroId || 0,
        fondoId: checkin?.fondoId || 0,
        operarioId: formData.operarioId || 0,
      };

      console.log("Formulario enviado:", serviceData);

      const method = /* formData.idCheckin ? "PUT" : */ "POST"; // Usar PUT si hay un ID
      const endpoint = "/api/servicio";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (!res.ok) {
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const consultar = async () => {
    setError(null);
    try {
      const response = await fetch(
        `/api/checkin?planilla=${formData.planilla}`
      );

      if (!response.ok) {
        setError("La planilla debe ser válida");
        return;
      }

      const data = await response.json();

      // Validar el estado del servicio directamente desde la respuesta
      if (data?.servicio?.estado === "Inactivo") {
        setError("Conteo cerrado, no esta permitido hacer cambios");
        setIsDisabled2(true);
      }

      // Asignar el checkin obtenido al estado
      setCheckin(data);

      // Deshabilitar el input al obtener la respuesta correcta
      setIsDisabled(true);
    } catch (error) {
      setError("Error al consultar el checkin: " + error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Fetch usuarios
        const usuariosRes = await fetch("/api/usuarios");
        if (!usuariosRes.ok) throw new Error("Error al cargar usuarios");
        const usuariosData = await usuariosRes.json();
        setUsuarios(usuariosData);
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

  useEffect(() => {
    if (checkin) {
      const initialSum_B =
        formData.B_100000 * 100000 +
        formData.B_50000 * 50000 +
        formData.B_20000 * 20000 +
        formData.B_10000 * 10000 +
        formData.B_5000 * 5000 +
        formData.B_2000 * 2000;

      const diferencia = initialSum_B - checkin.declarado;

      setFormData((prev) => ({ ...prev, Sum_B: initialSum_B, diferencia }));
    }
  }, [
    checkin,
    formData.B_100000,
    formData.B_50000,
    formData.B_20000,
    formData.B_10000,
    formData.B_5000,
    formData.B_2000,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Bienvenido, {user.name}</h1>
          {/* Accede directamente a user.name */}
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
            {error && (
              <p className="mt-4 text-sm text-red-500 text-center font-semibold">
                {error}
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
              <div className="items-center gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="planilla"
                    className="block text-sm font-medium text-gray-600"
                  >
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
                    onChange={handleInputChange}
                    disabled={isDisabled} // Deshabilitar el input cuando sea necesario
                  />
                  <Button
                    type="button"
                    onClick={consultar}
                    className="bg-cyan-700 hover:bg-cyan-900"
                  >
                    Consultar
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="nombreCliente"
                  className="block text-sm font-medium text-gray-600"
                >
                  Nombre del Cliente:
                </label>
                <input
                  disabled
                  type="text"
                  id="name"
                  name="name"
                  className="border p-2 w-full"
                  value={checkin?.clientes?.name?.replace("_", " ") || ""}
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="sello"
                  className="block text-sm font-medium text-gray-600"
                >
                  Sello de la Factura:
                </label>
                <input
                  disabled
                  type="text"
                  id="sello"
                  name="sello"
                  className="border p-2 w-full"
                  value={checkin?.sello || ""}
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
                <input
                  disabled
                  type="number"
                  id="valorDeclarado"
                  name="valorDeclarado"
                  className="border p-2 w-full"
                  value={checkin?.declarado}
                  readOnly
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Cantidad de Billetes por Denominación
            </h3>
            <div>
              <div className="overflow-x-auto">
                <Table className="w-full mt-4 border border-gray-300">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-4 py-2 text-left">
                        Denominación
                      </TableHead>
                      <TableHead className="px-4 py-2 text-left">
                        Cantidad
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Billete de 100,000 */}
                    <TableRow>
                      <TableCell className="px-4 py-2">$100,000</TableCell>
                      <TableCell className="flex items-center gap-2 px-4 py-2">
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement("B_100000")}
                        >
                          <Minus />
                        </Button>
                        <input
                          disabled={isDisabled2}
                          type="number"
                          name="B_100000"
                          className="border p-1 w-16 text-center"
                          value={
                            checkin?.servicio?.B_100000 || formData.B_100000
                          }
                          onChange={handleInputChange}
                        />
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement("B_100000")}
                        >
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Billete de 50,000 */}
                    <TableRow>
                      <TableCell className="px-4 py-2">$50,000</TableCell>
                      <TableCell className="flex items-center gap-2 px-4 py-2">
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement("B_50000")}
                        >
                          <Minus />
                        </Button>
                        <input
                          disabled={isDisabled2}
                          type="number"
                          name="B_50000"
                          className="border p-1 w-16 text-center"
                          value={checkin?.servicio?.B_50000 || formData.B_50000}
                          onChange={handleInputChange}
                        />
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement("B_50000")}
                        >
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Billete de 20,000 */}
                    <TableRow>
                      <TableCell className="px-4 py-2">$20,000</TableCell>
                      <TableCell className="flex items-center gap-2 px-4 py-2">
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement("B_20000")}
                        >
                          <Minus />
                        </Button>
                        <input
                          disabled={isDisabled2}
                          type="number"
                          name="B_20000"
                          className="border p-1 w-16 text-center"
                          value={checkin?.servicio?.B_20000 || formData.B_20000}
                          onChange={handleInputChange}
                        />
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement("B_20000")}
                        >
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Billete de 10,000 */}
                    <TableRow>
                      <TableCell className="px-4 py-2">$10,000</TableCell>
                      <TableCell className="flex items-center gap-2 px-4 py-2">
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement("B_10000")}
                        >
                          <Minus />
                        </Button>
                        <input
                          disabled={isDisabled2}
                          type="number"
                          name="B_10000"
                          className="border p-1 w-16 text-center"
                          value={checkin?.servicio?.B_10000 || formData.B_10000}
                          onChange={handleInputChange}
                        />
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement("B_10000")}
                        >
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Billete de 5,000 */}
                    <TableRow>
                      <TableCell className="px-4 py-2">$5,000</TableCell>
                      <TableCell className="flex items-center gap-2 px-4 py-2">
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement("B_5000")}
                        >
                          <Minus />
                        </Button>
                        <input
                          disabled={isDisabled2}
                          type="number"
                          name="B_5000"
                          className="border p-1 w-16 text-center"
                          value={checkin?.servicio?.B_5000 || formData.B_5000}
                          onChange={handleInputChange}
                        />
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement("B_5000")}
                        >
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Billete de 2,000 */}
                    <TableRow>
                      <TableCell className="px-4 py-2">$2,000</TableCell>
                      <TableCell className="flex items-center gap-2 px-4 py-2">
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrement("B_2000")}
                        >
                          <Minus />
                        </Button>
                        <input
                          disabled={isDisabled2}
                          type="number"
                          name="B_2000"
                          className="border p-1 w-16 text-center"
                          value={checkin?.servicio?.B_2000 || formData.B_2000}
                          onChange={handleInputChange}
                        />
                        <Button
                          disabled={isDisabled2}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrement("B_2000")}
                        >
                          <Plus />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Fila para el total */}
                    <TableRow>
                      <TableCell className="px-4 py-2 font-bold">
                        Total
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <input
                          disabled={isDisabled2}
                          type="text"
                          value={checkin?.servicio?.Sum_B || formData.Sum_B}
                          readOnly
                          className="border p-1 w-full text-center"
                        />
                      </TableCell>
                    </TableRow>
                    {/* Fila para la diferencia */}
                    <TableRow>
                      <TableCell className="px-4 py-2 font-bold">
                        Diferencia
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <input
                          disabled={isDisabled2}
                          type="text"
                          value={
                            checkin?.servicio?.diferencia ||
                            formData.diferencia ||
                            0
                          }
                          readOnly
                          className="border p-1 w-full text-center"
                        />
                      </TableCell>
                    </TableRow>
                    {/* Fila para la observación */}
                    <TableRow>
                      <TableCell colSpan={2} className="px-4 py-2">
                        <label
                          htmlFor="observacion"
                          className="block font-bold mb-2"
                        >
                          Observación:
                        </label>
                        <Textarea
                          disabled={isDisabled2}
                          id="observacion"
                          name="observacion"
                          className="border p-2 w-full"
                          value={
                            checkin?.servicio?.observacion ||
                            formData.observacion
                          }
                          onChange={handleTextChange}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Button
                disabled={isDisabled2}
                type="submit"
                className="bg-cyan-700 hover:bg-cyan-900"
              >
                Guardar y cerrar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default IngresoFactura;
