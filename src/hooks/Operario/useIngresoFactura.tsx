// @/hooks/Operario/useIngresoFactura.ts
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/General/use-toast";
import { useFetchData } from "@/hooks/General/useFetchData";
import { Checkin, Servicio, user } from "@/types/interfaces";

const initialServicioData: Servicio = {
  planilla: 0,
  sello: 0,
  estado: "Activo",
  observacion: "",
  diferencia: 0,
  fechaRegistro: new Date(),
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
};

export function useIngresoFacturaLogic(user: user) {
  const { toast } = useToast();
  const { usuarios, loading, error, checkin, clientes, setCheckin } =
    useFetchData(user.email);

  const [checki, setChecki] = useState<Checkin>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled2, setIsDisabled2] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [formData, setFormData] = useState<Servicio>({
    ...initialServicioData,
    operarioId: usuarios[0]?.idUsuario || 0,
  });

  useEffect(() => {
    if (usuarios.length > 0) {
      setFormData((prev) => ({
        ...prev,
        operarioId: usuarios[0].idUsuario,
      }));
    }
  }, [usuarios]);

  // Efecto corregido para evitar loops infinitos
  useEffect(() => {
    if (checki?.declarado) {
      const newSum_B = calculateSum(formData);
      const diferencia = newSum_B - checki.declarado;

      // Solo actualiza si los valores realmente cambiaron
      setFormData((prev) => {
        if (prev.Sum_B === newSum_B && prev.diferencia === diferencia) {
          return prev;
        }
        return {
          ...prev,
          Sum_B: newSum_B,
          diferencia,
        };
      });
    }
    // Dependencias específicas en lugar de todo formData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    checki?.declarado,
    formData.B_100000,
    formData.B_50000,
    formData.B_20000,
    formData.B_10000,
    formData.B_5000,
    formData.B_2000,
  ]);

  const calculateSum = (data: Servicio) => {
    return (
      data.B_100000 * 100000 +
      data.B_50000 * 50000 +
      data.B_20000 * 20000 +
      data.B_10000 * 10000 +
      data.B_5000 * 5000 +
      data.B_2000 * 2000
    );
  };

  const resetForm = () => {
    setFormData({
      ...initialServicioData, // Usamos initialServicioData en lugar de initialFormData
      operarioId: usuarios[0]?.idUsuario || 0,
    });
    setIsDisabled(false);
    setIsEditing(true);
    setChecki(undefined);
  };

  const consultar = async () => {
    resetForm();
    try {
      const response = await fetch(
        `/api/checkins?planilla=${formData.planilla}`
      );
      if (!response.ok) throw new Error("La planilla no existe");

      const data = await response.json();
      setChecki(data);

      setFormData((prev) => ({
        ...prev,
        planilla: data.planilla,
        sello: data.sello,
        checkin_id: data.idCheckin,
        checkineroId: data.checkineroId,
        fondoId: data.fondoId,
        clienteId: data.clienteId,
        ...(data.servicio || {}),
      }));

      if (data.servicio?.Sum_B > 0) {
        setIsDisabled2(true);
      }

      setIsDisabled(true);
      setIsEditing(false);
    } catch (error) {
      toast({
        description: "" + error,
        variant: "destructive",
      });
    }
  };

  const habilitarEdicion = () => {
    setIsDisabled(false);
    setIsEditing(true);
    setIsDisabled2(false);
  };

  const handleDenominationChange = (
    denom: keyof Pick<
      Servicio,
      "B_100000" | "B_50000" | "B_20000" | "B_10000" | "B_5000" | "B_2000"
    >,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [denom]: Math.max(value, 0),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "observacion" ? value : parseInt(value, 10) || 0,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!checki)
        throw new Error(
          "Debes consultar una planilla válida antes de guardar."
        );

      const serviceData = {
        ...formData,
        fechaRegistro: new Date().toISOString(),
      };

      const method = formData.idServicio ? "PUT" : "POST";
      const res = await fetch("/api/servicio", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error en la solicitud");
      }

      toast({
        title: "Éxito",
        description: "Servicio guardado correctamente.",
        variant: "normal",
      });

      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al enviar el formulario: " + error,
        variant: "destructive",
      });
    }
  };

  return {
    // Estados
    formData,
    checki,
    isDisabled,
    isDisabled2,
    isEditing,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    loading,
    error,
    usuarios,
    checkin,
    clientes, // Añadimos clientes
    setCheckin, // Añadimos setCheckin

    // Funciones
    consultar,
    habilitarEdicion,
    handleDenominationChange,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
