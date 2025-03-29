// @/components/Digitador/procesoForm.tsx
import { Button } from "@/components/ui/button";
import { Fondo } from "@/types/interfaces";
import { useEffect, useState } from "react";

interface ProcesoFormProps {
  fondos: Fondo[];
  selectedFondoId: number | null;
  onFondoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (date: string) => void;
  onCerrarFecha: () => void;
}

export function ProcesoForm({
  fondos,
  selectedFondoId,
  onFondoChange,
  onDateChange,
  onCerrarFecha,
}: ProcesoFormProps) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Obtener fechas con servicios activos
  useEffect(() => {
    if (selectedFondoId) {
      const fondoSeleccionado = fondos.find(
        (f) => f.idFondo === selectedFondoId
      );

      // Obtener fechas únicas y válidas
      const dates = Array.from(
        new Set(
          fondoSeleccionado?.servicios
            ?.filter((s) => s.estado === "Activo")
            ?.map((s) => {
              const date = new Date(s.fecharegistro);
              return !isNaN(date.getTime())
                ? date.toISOString().split("T")[0]
                : null;
            })
            ?.filter((dateStr): dateStr is string => dateStr !== null)
        )
      ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      setAvailableDates(dates);
    }
  }, [selectedFondoId, fondos]);

  const handleDateSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    onDateChange(date);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Proceso de Cierre de Fechas
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Seleccionar Fondo
          </label>
          <select
            value={selectedFondoId || ""}
            onChange={onFondoChange}
            className="w-full px-3 py-2 mt-1 border rounded"
            required
          >
            <option value="">Seleccione un fondo</option>
            {fondos.map((fond) => (
              <option key={fond.idFondo} value={fond.idFondo}>
                {fond.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Fechas Disponibles
          </label>
          <select
            value={selectedDate}
            onChange={handleDateSelection}
            disabled={!selectedFondoId}
            className="w-full px-3 py-2 mt-1 border rounded"
            required
          >
            <option value="">Seleccione una fecha</option>
            {availableDates.map((fecha) => (
              <option key={fecha} value={fecha}>
                {new Date(fecha).toLocaleDateString("es-ES")}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <Button
            type="button"
            onClick={onCerrarFecha}
            disabled={!selectedDate}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            {selectedDate
              ? `Cerrar fecha ${new Date(selectedDate).toLocaleDateString(
                  "es-ES"
                )}`
              : "Seleccione una fecha para cerrar"}
          </Button>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Servicios a cerrar:{" "}
            {
              fondos
                .find((f) => f.idFondo === selectedFondoId)
                ?.servicios?.filter(
                  (s) =>
                    new Date(s.fecharegistro).toISOString().split("T")[0] ===
                      selectedDate && s.estado === "Activo"
                ).length
            }
          </p>
        </div>
      )}
    </form>
  );
}
