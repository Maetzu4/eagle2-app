// @/app/operario/page.client.tsx
"use client";
import { useEffect, useState } from "react";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { useFetchData } from "@/hooks/General/useFetchData";
import { Checkin, Servicio, user } from "@/types/interfaces";
import { useToast } from "@/hooks/General/use-toast";
import { Loading } from "@/components/General/loading";
import { Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface IngresoFacturaProps {
  user: user;
}

const IngresoFactura: React.FC<IngresoFacturaProps> = ({ user }) => {
  const { toast } = useToast();
  const { usuarios, loading, error } = useFetchData(user.email);
  const [checkin, setCheckin] = useState<Checkin>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Servicio>({
    planilla: 0,
    sello: 0,
    estado: "Activo",
    observacion: "",
    diferencia: 0,
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
    operarioId: 0,
    clienteId: 0,
  });

  useEffect(() => {
    if (usuarios.length > 0) {
      const usuario = usuarios[0];
      setFormData((prev) => ({
        ...prev,
        operarioId: usuario.idUsuario,
      }));
    }
  }, [usuarios, setFormData]);

  useEffect(() => {
    if (checkin && checkin.declarado) {
      const newSum_B =
        formData.B_100000 * 100000 +
        formData.B_50000 * 50000 +
        formData.B_20000 * 20000 +
        formData.B_10000 * 10000 +
        formData.B_5000 * 5000 +
        formData.B_2000 * 2000;

      const diferencia = newSum_B - checkin.declarado;

      setFormData((prev) => ({
        ...prev,
        Sum_B: newSum_B,
        diferencia,
      }));
    }
  }, [
    formData.B_100000,
    formData.B_50000,
    formData.B_20000,
    formData.B_10000,
    formData.B_5000,
    formData.B_2000,
    checkin,
  ]);

  const resetForm = () => {
    setFormData({
      planilla: 0,
      sello: 0,
      estado: "Activo",
      observacion: "",
      diferencia: 0,
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
      operarioId: 0,
      clienteId: 0,
    });
    setIsDisabled(false); // Habilitar el campo de planilla
    setIsEditing(true); // Cambiar a modo "edición"
    setCheckin(undefined); // Limpiar el checkin
  };

  const consultar = async () => {
    try {
      // Realizar la consulta al servidor
      const response = await fetch(
        `/api/checkins?planilla=${formData.planilla}`
      );
      if (!response.ok) {
        throw new Error("La planilla no existe");
      }

      // Obtener los datos del checkin
      const data = await response.json();
      setCheckin(data); // Guardar el checkin en el estado

      // Actualizar el formulario con los datos del checkin
      setFormData((prev) => ({
        ...prev,
        planilla: data.planilla, // Asignar el número de planilla
        sello: data.sello, // Asignar el sello
        checkin_id: data.idCheckin, // Asignar el ID del checkin
        checkineroId: data.checkineroId, // Asignar el ID del checkinero
        fondoId: data.fondoId, // Asignar el ID del fondo
        clienteId: data.clienteId, // Asignar el ID del cliente
      }));

      // Si hay un servicio asociado, actualizar el formulario con sus datos
      if (data.servicio) {
        setFormData((prev) => ({
          ...prev,
          ...data.servicio, // Asignar los datos del servicio
        }));
        setIsDisabled2(data.servicio.estado === "Inactivo"); // Deshabilitar si el servicio está inactivo
      }

      // Deshabilitar el campo de planilla después de consultar
      setIsDisabled(true);
      setIsEditing(false);

      // Depuración
      console.log("Datos del checkin:", data);
      console.log("Datos del servicio:", data.servicio);
      console.log("Formulario actualizado:", {
        ...formData,
        planilla: data.planilla,
        sello: data.sello,
        checkin_id: data.idCheckin,
        checkineroId: data.checkineroId,
        fondoId: data.fondoId,
        clienteId: data.clienteId,
      });
    } catch (error) {
      // Mostrar mensaje de error
      toast({
        description: "" + error,
        variant: "destructive",
      });
    }
  };

  const habilitarEdicion = () => {
    setIsDisabled(false);
    setIsEditing(true);
  };

  const handleIncrement = (
    denom: keyof Pick<
      Servicio,
      "B_100000" | "B_50000" | "B_20000" | "B_10000" | "B_5000" | "B_2000"
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [denom]: prev[denom] + 1,
    }));
  };

  const handleDecrement = (
    denom: keyof Pick<
      Servicio,
      "B_100000" | "B_50000" | "B_20000" | "B_10000" | "B_5000" | "B_2000"
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [denom]: Math.max(prev[denom] - 1, 0),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value, 10);

    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!checkin) {
        throw new Error(
          "Debes consultar una planilla válida antes de guardar."
        );
      }

      // Crear el objeto serviceData con todos los campos requeridos
      const serviceData = {
        planilla: formData.planilla,
        sello: formData.sello,
        estado: formData.estado,
        observacion: formData.observacion,
        B_100000: formData.B_100000,
        B_50000: formData.B_50000,
        B_20000: formData.B_20000,
        B_10000: formData.B_10000,
        B_5000: formData.B_5000,
        B_2000: formData.B_2000,
        Sum_B: formData.Sum_B,
        diferencia: formData.diferencia,
        checkin_id: checkin.idCheckin,
        checkineroId: checkin.checkineroId,
        fondoId: checkin.fondoId,
        operarioId: formData.operarioId,
        clienteId: checkin.clienteId,
        fecharegistro: new Date().toISOString(),
      };

      console.log("Datos enviados al servidor:", serviceData); // Depuración

      // Determinar si es una creación (POST) o actualización (PUT)
      const method = formData.idServicio ? "PUT" : "POST";
      const endpoint = "/api/servicio";

      // Enviar la solicitud al servidor
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (!res.ok) {
        const errorData = await res.json(); // Obtener detalles del error
        console.error("Error del servidor:", errorData); // Depuración
        throw new Error(errorData.error || "Error en la solicitud");
      }

      // Mostrar mensaje de éxito
      toast({
        title: "Éxito",
        description: "Servicio guardado correctamente.",
        variant: "normal",
      });

      // Limpiar los campos después de guardar
      resetForm();
    } catch (error) {
      // Mostrar mensaje de error
      toast({
        title: "Error",
        description: "Error al enviar el formulario: " + error,
        variant: "destructive",
      });
    }
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmDialogOpen(true); // Mostrar el diálogo de confirmación
  };

  if (loading) {
    return <Loading text="Cargando..." />;
  }

  if (error) {
    return <Loading text={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">
            Bienvenido, {usuarios[0].name + " " + usuarios[0].lastname}
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
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Factura de detallado de cliente
            </h2>
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
                    disabled={isDisabled}
                  />
                  <Button
                    type="button"
                    onClick={isEditing ? consultar : habilitarEdicion}
                    className="bg-cyan-700 hover:bg-cyan-900"
                  >
                    {isEditing ? "Consultar" : "Editar"}
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
                  value={checkin?.declarado || ""}
                  readOnly
                />
              </div>
            </div>

            {/* Tabla de billetes */}
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
                      value={formData.B_100000}
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
                  <TableCell className="px-4 py-2 font-bold">Total</TableCell>
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
              </TableBody>
            </Table>

            {/* Observación */}
            <div className="mt-6">
              <label htmlFor="observacion" className="block font-bold mb-2">
                Observación:
              </label>
              <Textarea
                disabled={isDisabled2}
                id="observacion"
                name="observacion"
                className="border p-2 w-full"
                value={checkin?.servicio?.observacion || formData.observacion}
                onChange={handleTextChange}
              />
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <Button
                disabled={isDisabled2}
                type="button" // Cambiar a type="button" para evitar el envío automático del formulario
                className="bg-cyan-700 hover:bg-cyan-900"
                onClick={handleConfirmSubmit} // Llamar a handleConfirmSubmit
              >
                Guardar y cerrar
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción guardará el servicio, no sera posible editarlo despues
              y limpiará el formulario. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default IngresoFactura;
