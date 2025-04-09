// src/components/Admin/usuarioForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Usuario, Sede } from "@/types/interfaces";

interface UsuarioFormProps {
  formData: Usuario;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
}

export function UsuarioForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
}: UsuarioFormProps) {
  // Aquí deberías cargar las sedes disponibles desde tu API
  const sedes: Sede[] = []; // Reemplaza con datos reales

  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Usuario" : "Crear Usuario"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Apellido
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required={!isEditMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Rol
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="checkinero">Checkinero</option>
              <option value="digitador">Digitador</option>
              <option value="operario">Operario</option>
              <option value="administrador">Administrador</option>
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
            {isEditMode ? "Actualizar Usuario" : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
