// @/hooks/Digitador/useDigitador.ts
import { useState, useEffect } from "react";
import { user, Servicio } from "@/types/interfaces";
import { useFetchData } from "@/hooks/General/useFetchData";
import { useToast } from "@/hooks/General/use-toast";
import { opcionesDigitador } from "@/components/Digitador/opcionesDigitador";

export function useDigitadorLogic(user: user) {
  const { toast } = useToast();
  const {
    usuarios,
    fondos,
    servicios,
    loading,
    error,
    setServicios,
    checkin,
    clientes,
    setCheckin,
  } = useFetchData(user.email);

  // Estados para las opciones del menú
  const initialEstados = Object.fromEntries(
    opcionesDigitador.map((opcion) => [opcion.estadoKey, false])
  );
  const [estados, setEstados] =
    useState<Record<string, boolean>>(initialEstados);

  const [groupBy, setGroupBy] = useState<"fondo" | "cliente">("fondo");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedFondoId, setSelectedFondoId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [availableServices, setAvailableServices] = useState<Servicio[]>([]);

  useEffect(() => {
    if (!selectedFondoId) {
      setAvailableServices([]);
      return;
    }

    const serviciosActivos = servicios.filter(
      (s) => s.fondoId === selectedFondoId && s.estado === "Activo"
    );

    const serviciosOrdenados = [...serviciosActivos].sort(
      (a, b) =>
        new Date(b.fechaRegistro).getTime() -
        new Date(a.fechaRegistro).getTime()
    );

    setAvailableServices(serviciosOrdenados);
  }, [selectedFondoId, servicios]);

  const handleCerrarFecha = async () => {
    if (!selectedServiceId) {
      toast({
        title: "Error",
        description: "Seleccione un servicio",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFondoId) {
      toast({
        title: "Error",
        description: "Seleccione un fondo válido",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/fechacierre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicioId: selectedServiceId,
          digitadorId: usuarios[0].idUsuario,
          fondoId: selectedFondoId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cerrar el servicio");
      }

      setServicios((prev) =>
        prev.map((s) =>
          s.idServicio === selectedServiceId ? { ...s, estado: "Inactivo" } : s
        )
      );

      setSelectedServiceId(null);
      setAvailableServices((prev) =>
        prev.filter((s) => s.idServicio !== selectedServiceId)
      );

      toast({
        title: "Éxito",
        description: "Servicio cerrado correctamente",
        variant: "normal",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleFondoSelect = (fondoId: number) => {
    setSelectedFondoId(fondoId);
  };

  const resetSelection = () => {
    setSelectedFondoId(null);
  };

  return {
    estados,
    setEstados,
    groupBy,
    setGroupBy,
    selectedServices,
    setSelectedServices,
    selectedFondoId,
    setSelectedFondoId,
    selectedServiceId,
    setSelectedServiceId,
    availableServices,
    usuarios,
    fondos,
    servicios,
    loading,
    error,
    checkin,
    clientes,
    setCheckin,
    toast,
    handleCerrarFecha,
    handleFondoSelect,
    resetSelection,
  };
}
