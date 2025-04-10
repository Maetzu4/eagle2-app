// @/app/digitador/page.client.tsx
"use client";
import { Card } from "@/components/ui/card";
import { Informa } from "@/components/General/informa";
import { DataTableFondos } from "@/components/Digitador/dataTableFondos";
import { ProcesoForm } from "@/components/Digitador/procesoForm";
import { DataTable } from "@/components/Checkin/dataTableCheckin";
import { ServiciosTable } from "@/components/Digitador/serviciosTable";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generatePDF } from "@/components/Digitador/pdfGenerator";
import { TopPage } from "@/components/General/topPage";
import { useCheckinForm } from "@/hooks/Checkin/useCheckinForm";
import { initialFormData } from "@/components/General/utils";
import { MenuBotones } from "@/components/General/menuBotones";
import { opcionesDigitador } from "@/components/Digitador/opcionesDigitador";
import { useDigitadorLogic } from "@/hooks/Digitador/useDigitador";
import { user } from "@/types/interfaces";
import { Button } from "@/components/ui/button";

interface DigitadorOpcionesProps {
  user: user;
}

const DigitadorOpciones: React.FC<DigitadorOpcionesProps> = ({ user }) => {
  const {
    estados,
    setEstados,
    groupBy,
    setGroupBy,
    selectedServices,
    setSelectedServices,
    selectedFondoId,
    setSelectedFondoId,
    selectedServiceId,
    setSelectedServiceId,
    availableServices,
    usuarios,
    fondos,
    servicios,
    loading,
    error,
    checkin,
    clientes,
    setCheckin,
    toast,
    handleCerrarFecha,
    handleFondoSelect,
    resetSelection,
  } = useDigitadorLogic(user);

  const { handleEdit, handleDelete } = useCheckinForm(
    initialFormData,
    clientes,
    checkin,
    setCheckin,
    toast
  );

  if (loading) {
    return <Informa text="Cargando..." btntxt="si" log={false} />;
  }
  if (error) {
    return <Informa text={error} btntxt="Cerrar sesion" log={true} />;
  }
  if (!usuarios.length || !fondos.length) {
    return (
      <Informa
        text="No se encontraron datos"
        btntxt="Volver para iniciar sesión"
        log={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <TopPage user={usuarios[0]} />
      <main className="container mx-auto p-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Gestión de procesos
          </h2>
          <MenuBotones
            opciones={opcionesDigitador}
            estados={estados}
            setEstados={setEstados}
            onResetSelection={resetSelection}
          />
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow mt-6">
          {Object.values(estados).every((estado) => !estado) && (
            <h3 className="text-center w-full font-bold text-3xl">
              Abra alguna opción..
            </h3>
          )}

          {/* Sección de Checkins */}
          {estados.isCheckin && (
            <DataTable
              data={checkin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              user={user}
            />
          )}

          {/* Sección de Proceso de Cierre */}
          {estados.isProceso && (
            <div className="space-y-6">
              <div>
                <DataTableFondos
                  data={fondos}
                  user={user}
                  onSelect={handleFondoSelect}
                  selectedFondoId={selectedFondoId}
                  setSelectedServiceId={setSelectedServiceId}
                  mode="selection"
                />
              </div>

              {selectedFondoId && (
                <ProcesoForm
                  fondos={fondos}
                  selectedFondoId={selectedFondoId}
                  onFondoChange={(e) =>
                    setSelectedFondoId(Number(e.target.value))
                  }
                  onSelectionChange={setSelectedServiceId}
                  onCerrarFecha={handleCerrarFecha}
                  availableServices={availableServices}
                  selectedServiceId={selectedServiceId}
                />
              )}
            </div>
          )}

          {/* Seccion de generar pdfs*/}
          {estados.isPdf && (
            <div className="space-y-4 mt-8">
              <div className="flex justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  Servicios para Informar
                </h2>
                <div className="flex items-center gap-4">
                  <Label>Agrupar por:</Label>
                  <RadioGroup
                    value={groupBy}
                    onValueChange={(value) =>
                      setGroupBy(value as "fondo" | "cliente")
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="fondo" id="fondo" />
                      <Label htmlFor="fondo">Fondo</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="cliente" id="cliente" />
                      <Label htmlFor="cliente">Cliente</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <ServiciosTable
                data={servicios.filter((s) => s.estado === "Inactivo")}
                onSelectionChange={setSelectedServices}
              />

              <Button
                onClick={() => {
                  const selected = servicios.filter((s) =>
                    selectedServices.includes(s.idServicio || 0)
                  );

                  generatePDF({
                    selectedServices: selected,
                    groupBy,
                    fondos,
                    clientes,
                  });
                }}
                disabled={selectedServices.length === 0}
                className="w-full"
              >
                Generar PDF ({selectedServices.length} seleccionados)
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default DigitadorOpciones;
