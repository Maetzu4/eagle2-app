// src/components/Admin/rutaForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RutaLlegada } from "@/types/interfaces";

interface RutaFormProps {
  formData: RutaLlegada;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
}

export function RutaForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
}: RutaFormProps) {
  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Ruta" : "Crear Ruta"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
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
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              rows={3}
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
            {isEditMode ? "Actualizar Ruta" : "Crear Ruta"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
