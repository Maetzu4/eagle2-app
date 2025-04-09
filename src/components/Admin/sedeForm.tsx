// src/components/Admin/sedeForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sede } from "@/types/interfaces";

interface SedeFormProps {
  formData: Sede;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
}

export function SedeForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
}: SedeFormProps) {
  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Sede" : "Crear Sede"}
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
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
            {isEditMode ? "Actualizar Sede" : "Crear Sede"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
