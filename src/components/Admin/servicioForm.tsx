// src/components/Admin/servicioForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Servicio, Checkin, Usuario, Cliente, Fondo } from "@/types/interfaces";

interface ServicioFormProps {
  formData: Servicio;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
  checkin: Checkin[];
  usuarios: Usuario[];
  clientes: Cliente[];
  fondos: Fondo[];
}

export function ServicioForm({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
  checkin,
  usuarios,
}: ServicioFormProps) {
  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Servicio" : "Crear Servicio"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Check-in
            </label>
            <select
              name="checkin_id"
              value={formData.checkin_id || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="">Seleccione un check-in</option>
              {checkin.map((c) => (
                <option key={c.idCheckin} value={c.idCheckin}>
                  Planilla {c.planilla} - {c.clientes?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Checkinero
            </label>
            <select
              name="checkineroId"
              value={formData.checkineroId || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="">Seleccione un checkinero</option>
              {usuarios
                .filter((u) => u.role === "checkinero")
                .map((usuario) => (
                  <option key={usuario.idUsuario} value={usuario.idUsuario}>
                    {usuario.name} {usuario.lastname}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Operario
            </label>
            <select
              name="operarioId"
              value={formData.operarioId || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="">Seleccione un operario</option>
              {usuarios
                .filter((u) => u.role === "operario")
                .map((usuario) => (
                  <option key={usuario.idUsuario} value={usuario.idUsuario}>
                    {usuario.name} {usuario.lastname}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Observación
            </label>
            <textarea
              name="observacion"
              value={formData.observacion || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              rows={3}
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
            {isEditMode ? "Actualizar Servicio" : "Crear Servicio"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
