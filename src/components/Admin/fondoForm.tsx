// src/components/Admin/fondoForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fondo } from "@/types/interfaces";

interface FondoFormProps {
  formData: Fondo;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
}

export function FondoForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
}: FondoFormProps) {
  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Fondo" : "Crear Fondo"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Tipo
            </label>
            <select
              name="tipo"
              value={formData.tipo || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="Publico">Público</option>
              <option value="Privado">Privado</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
            {isEditMode ? "Actualizar Fondo" : "Crear Fondo"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
