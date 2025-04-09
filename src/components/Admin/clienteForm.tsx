// src/components/Admin/clienteForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cliente, Fondo, Sede } from "@/types/interfaces";

interface ClienteFormProps {
  formData: Cliente;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
  fondos: Fondo[];
}

export function ClienteForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
  fondos,
}: ClienteFormProps) {
  // Aquí deberías cargar las sedes disponibles desde tu API
  const sedes: Sede[] = []; // Reemplaza con datos reales

  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Cliente" : "Crear Cliente"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Fondo
            </label>
            <select
              name="fondoId"
              value={formData.fondoId || ""}
              onChange={onInputChange}
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
              Sede
            </label>
            <select
              name="sedeId"
              value={formData.sedeId || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            >
              <option value="">Seleccione una sede</option>
              {sedes.map((sede) => (
                <option key={sede.idSede} value={sede.idSede}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
            {isEditMode ? "Actualizar Cliente" : "Crear Cliente"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
