import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkin, Cliente, RutaLlegada } from "@/types/checkin";

interface CheckinFormProps {
  formData: Checkin;
  clientes: Cliente[];
  rutas: RutaLlegada[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
}

export function CheckinForm({
  formData,
  clientes,
  rutas,
  onInputChange,
  onSubmit,
  isEditMode,
}: CheckinFormProps) {
  return (
    <Card className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Check-in</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Número de Factura
            </label>
            <input
              type="number"
              name="planilla"
              value={formData.planilla}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Cliente
            </label>
            <select
              name="clienteId"
              value={formData.clienteId || "0"}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="0">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.idCliente} value={cliente.idCliente}>
                  {cliente.name.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Sello
            </label>
            <input
              type="number"
              name="sello"
              value={formData.sello}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Valor Declarado
            </label>
            <input
              type="number"
              name="declarado"
              value={formData.declarado}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Ruta
            </label>
            <select
              name="rutaLlegadaId"
              value={formData.rutaLlegadaId || ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="">Seleccione una ruta</option>
              {rutas.map((ruta) => (
                <option key={ruta.idRutaLlegada} value={ruta.idRutaLlegada}>
                  {ruta.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Fondo
            </label>
            <input
              disabled
              type="text"
              name="fondo"
              value={formData.fondo?.nombre || ""} // Mostrar el nombre del fondo
              className="w-full px-3 py-2 mt-1 border rounded"
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-900">
            {isEditMode ? "Actualizar Check-in" : "Agregar Check-in"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
