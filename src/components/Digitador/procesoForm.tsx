// @/components/Digitador/procesoForm.tsx
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Fondo, Servicio } from "@/types/interfaces";
import { Label } from "@/components/ui/label";

interface ProcesoFormProps {
  fondos: Fondo[];
  selectedFondoId: number | null;
  onFondoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSelectionChange: (id: number) => void; // Cambio a selección única
  onCerrarFecha: () => void;
  availableServices: Servicio[];
  selectedServiceId: number | null; // Ahora es un solo ID
}

const meses = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const ProcesoForm: React.FC<ProcesoFormProps> = ({
  fondos,
  selectedFondoId,
  onFondoChange,
  onSelectionChange,
  onCerrarFecha,
  availableServices,
  selectedServiceId,
}) => {
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");

    return `${dia} ${mes} ${año} - ${horas}:${minutos}`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Cierre de Servicios</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-2">
            Seleccionar Fondo
          </Label>
          <select
            value={selectedFondoId || ""}
            onChange={onFondoChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Seleccione un fondo</option>
            {fondos.map((fondo) => (
              <option key={fondo.idFondo} value={fondo.idFondo}>
                {fondo.nombre} ({fondo.tipo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedFondoId && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Servicios Activos ({availableServices.length})
            </h3>

            {availableServices.length === 0 ? (
              <p className="text-gray-500">No hay servicios activos</p>
            ) : (
              <RadioGroup
                value={selectedServiceId?.toString() || ""}
                onValueChange={(value: string) =>
                  onSelectionChange(Number(value))
                }
                className="space-y-3"
              >
                {availableServices.map((service) => (
                  <div
                    key={service.idServicio}
                    className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50"
                  >
                    <RadioGroupItem
                      value={(service.idServicio || 0).toString()}
                      id={(service.idServicio || 0).toString()}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={(service.idServicio || 0).toString()}>
                          Planilla: {service.planilla}
                        </Label>
                        <span className="text-sm text-gray-500">
                          {formatDate(service.fechaRegistro)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Cliente: {service.cliente?.name.replace("_", " ")}
                      </div>
                      <div className="text-sm text-gray-600">
                        Monto: ${service.Sum_B?.toLocaleString("es-CO")}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <Button
            onClick={onCerrarFecha}
            disabled={!selectedServiceId}
            className="w-full py-4 text-lg"
          >
            {selectedServiceId
              ? `Cerrar servicio ${
                  availableServices.find(
                    (s) => s.idServicio === selectedServiceId
                  )?.planilla
                }`
              : "Seleccione un servicio para cerrar"}
          </Button>
        </div>
      )}
    </div>
  );
};
