// @/components/Digitador/procesoForm.tsx
import { Button } from "@/components/ui/button";
import { Fondo } from "@/types/interfaces";
import { useState } from "react";

interface ProcesoFormProps {
  fondos: Fondo[];
  selectedFondoId: number | null;
  onFondoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (date: string) => void;
  onCerrarFecha: () => void;
  availableDates: string[];
}

export const ProcesoForm: React.FC<ProcesoFormProps> = ({
  fondos,
  selectedFondoId,
  onFondoChange,
  onDateChange,
  onCerrarFecha,
  availableDates,
}) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
            {fondos.map((fondo) => (
              <option key={fondo.idFondo} value={fondo.idFondo}>
                {fondo.nombre}
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
            onChange={handleDateChange}
            disabled={!selectedFondoId || availableDates.length === 0}
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
    </form>
  );
};
