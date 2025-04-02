// @/app/operario/page.client.tsx
"use client";
import { useIngresoFacturaLogic } from "@/hooks/Operario/useIngresoFactura";
import { Informa } from "@/components/General/informa";
import { TopPage } from "@/components/General/topPage";
import { DataTable } from "@/components/Checkin/dataTableCheckin";
import { useCheckinForm } from "@/hooks/Checkin/useCheckinForm";
import { initialFormData } from "@/components/General/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BilletesForm } from "@/components/Operario/billetesForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { user } from "@/types/interfaces";
import { useToast } from "@/hooks/General/use-toast";

interface IngresoFacturaProps {
  user: user;
}

const IngresoFactura: React.FC<IngresoFacturaProps> = ({ user }) => {
  const { toast } = useToast();
  const {
    formData,
    checki,
    isDisabled,
    isDisabled2,
    isEditing,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    loading,
    error,
    usuarios,
    clientes,
    setCheckin,
    checkin,
    consultar,
    habilitarEdicion,
    handleDenominationChange,
    handleInputChange,
    handleSubmit,
  } = useIngresoFacturaLogic(user);

  const { handleEdit, handleDelete } = useCheckinForm(
    initialFormData,
    clientes,
    checkin,
    setCheckin,
    toast
  );

  if (loading) return <Informa text="Cargando" btntxt="N/A" log={false} />;
  if (error) return <Informa text={error} btntxt="cerrar sesion" log={true} />;

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <TopPage user={usuarios[0]} />
      <main className="container mx-auto p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsConfirmDialogOpen(true);
          }}
        >
          <Card className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Factura de detallado de cliente
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
              {/* Campos del formulario */}
              <div className="items-center gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="planilla"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Número de Planilla:
                  </label>
                </div>
                <div className="flex gap-4">
                  <input
                    type="number"
                    id="planilla"
                    name="planilla"
                    className="border p-2 w-full"
                    value={formData.planilla}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                  />
                  <Button
                    type="button"
                    onClick={isEditing ? consultar : habilitarEdicion}
                    className="bg-cyan-700 hover:bg-cyan-900"
                  >
                    {isEditing ? "Consultar" : "Editar"}
                  </Button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="nombreCliente"
                  className="block text-sm font-medium text-gray-600"
                >
                  Nombre del Cliente:
                </label>
                <input
                  disabled
                  type="text"
                  id="name"
                  name="name"
                  className="border p-2 w-full"
                  value={checki?.clientes?.name?.replace("_", " ") || ""}
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="sello"
                  className="block text-sm font-medium text-gray-600"
                >
                  Sello de la Factura:
                </label>
                <input
                  disabled
                  type="text"
                  id="sello"
                  name="sello"
                  className="border p-2 w-full"
                  value={checki?.sello || ""}
                  readOnly
                />
              </div>

              <div>
                <label
                  htmlFor="valorDeclarado"
                  className="block text-sm font-medium text-gray-600"
                >
                  Valor Declarado:
                </label>
                <input
                  disabled
                  type="number"
                  id="valorDeclarado"
                  name="valorDeclarado"
                  className="border p-2 w-full"
                  value={checki?.declarado || ""}
                  readOnly
                />
              </div>
            </div>
          </Card>

          {!isEditing && (
            <Card className="bg-white p-6 rounded-lg shadow mt-6">
              <BilletesForm
                formData={formData}
                isDisabled2={isDisabled2}
                onDenominationChange={handleDenominationChange}
              />

              <div className="mt-6">
                <label htmlFor="observacion" className="block font-bold mb-2">
                  Observación:
                </label>
                <Textarea
                  disabled={isDisabled2}
                  id="observacion"
                  name="observacion"
                  className="border p-2 w-full"
                  value={formData.observacion}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <Button
                  disabled={isDisabled2}
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-900"
                >
                  Guardar y cerrar
                </Button>
              </div>
            </Card>
          )}

          {isEditing && (
            <Card className="bg-white p-6 rounded-lg shadow mt-6">
              <DataTable
                data={checkin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                user={user}
              />
            </Card>
          )}
        </form>

        <AlertDialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción guardará el servicio, no sera posible editarlo
                despues y limpiará el formulario. ¿Deseas continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default IngresoFactura;
