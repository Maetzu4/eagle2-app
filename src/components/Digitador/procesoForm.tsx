// src/components/Digitador/ProcesoForm.tsx
import { Button } from "@/components/ui/button";
import { Fondo } from "@/types/checkin";

interface ProcesoFormProps {
  fondos: Fondo[];
  selectedFondoId: number | null;
  inactiveDates: string[];
  onFondoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCalcular: () => void;
}

export function ProcesoForm({
  fondos,
  selectedFondoId,
  inactiveDates,
  onFondoChange,
  onDateChange,
  onCalcular,
}: ProcesoFormProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Proceso de Fechas de cierre
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Fondo
          </label>
          <select
            name="fondos"
            value={selectedFondoId || ""}
            onChange={onFondoChange}
            className="w-full px-3 py-2 mt-1 border rounded"
            required
          >
            <option value="">Seleccione un fondo</option>
            {fondos.map((fond) => (
              <option key={fond.idFondo} value={fond.idFondo}>
                {fond.idFondo + " " + fond.nombre.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Fechas a cerrar
          </label>
          <select
            name="fecha"
            disabled={!selectedFondoId}
            onChange={onDateChange}
            className="w-full px-3 py-2 mt-1 border rounded"
            required
          >
            <option value="">Seleccione una fecha</option>
            {inactiveDates.map((fecha, index) => (
              <option key={index} value={fecha}>
                {fecha}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button
            type="button"
            onClick={onCalcular}
            className="bg-cyan-700 hover:bg-cyan-900"
          >
            Calcular
          </Button>
        </div>
      </div>
    </form>
  );
}
