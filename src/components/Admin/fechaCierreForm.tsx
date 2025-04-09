// src/components/Admin/fechaCierreForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FechaCierre, Usuario, Fondo, Servicio } from "@/types/interfaces";

interface FechaCierreFormProps {
  formData: FechaCierre;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
  usuarios: Usuario[];
  fondos: Fondo[];
  servicios: Servicio[];
}

export function FechaCierreForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
  usuarios,
  fondos,
  servicios,
}: FechaCierreFormProps) {
  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Fecha de Cierre" : "Crear Fecha de Cierre"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Fecha a Cerrar
            </label>
            <input
              type="datetime-local"
              name="fecha_a_cerrar"
              value={
                formData.fecha_a_cerrar
                  ? new Date(formData.fecha_a_cerrar).toISOString().slice(0, 16)
                  : ""
              }
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Digitador
            </label>
            <select
              name="digitadorId"
              value={formData.digitadorId || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="">Seleccione un digitador</option>
              {usuarios
                .filter((u) => u.role === "digitador")
                .map((usuario) => (
                  <option key={usuario.idUsuario} value={usuario.idUsuario}>
                    {usuario.name} {usuario.lastname}
                  </option>
                ))}
            </select>
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
              Servicio
            </label>
            <select
              name="servicioId"
              value={formData.servicioId || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            >
              <option value="">Seleccione un servicio</option>
              {servicios
                .filter((s) => s.estado === "Activo")
                .map((servicio) => (
                  <option key={servicio.idServicio} value={servicio.idServicio}>
                    Planilla {servicio.planilla} - {servicio.clientes?.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
            {isEditMode ? "Actualizar Fecha" : "Crear Fecha"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
