// src/app/admin/page.client.tsx
"use client";
import { Card } from "@/components/ui/card";
import { Informa } from "@/components/General/informa";
import { DataTableCheckin } from "@/components/Checkin/dataTableCheckin";
import { ServiciosTable } from "@/components/Digitador/serviciosTable";
import { TopPage } from "@/components/General/topPage";
import { useCheckinForm } from "@/hooks/Checkin/useCheckinForm";
import { initialFormData } from "@/components/General/utils";
import { MenuBotones } from "@/components/General/menuBotones";
import { opcionesAdmin } from "@/components/Admin/opcionesAdmin";
import { useAdminLogic } from "@/hooks/Admin/useAdmin";
import { user } from "@/types/interfaces";
import { UsuarioForm } from "@/components/Admin/usuarioForm";
import { FondoForm } from "@/components/Admin/fondoForm";
import { ClienteForm } from "@/components/Admin/clienteForm";
import { RutaForm } from "@/components/Admin/rutaForm";
import { ServicioForm } from "@/components/Admin/servicioForm";
import { FechaCierreForm } from "@/components/Admin/fechaCierreForm";
import { SedeForm } from "@/components/Admin/sedeForm";
import { DataTableUsuarios } from "@/components/Admin/dataTableUsuarios";
import { DataTableFondos } from "@/components/Digitador/dataTableFondos";
import { DataTableClientes } from "@/components/Admin/dataTableClientes";
import { DataTableRutas } from "@/components/Admin/dataTableRutas";
import { DataTableFechasCierre } from "@/components/Admin/dataTableFechasCierre";
import { DataTableSedes } from "@/components/Admin/dataTableSedes";

interface AdminProps {
  user: user;
}

const Admin: React.FC<AdminProps> = ({ user }) => {
  const {
    estados,
    setEstados,
    selectedTable,
    setSelectedTable,
    loading,
    error,
    usuarios,
    fondos,
    clientes,
    rutas,
    servicios,
    fechasCierre,
    checkin,
    setCheckin,
    toast,
    handleDelete,
    handleEdit,
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useAdminLogic(user);

  const { handleEdit: handleEditCheckin, handleDelete: handleDeleteCheckin } =
    useCheckinForm(initialFormData, clientes, checkin, setCheckin, toast);

  if (loading) {
    return <Informa text="Cargando..." btntxt="si" log={false} />;
  }
  if (error) {
    return <Informa text={error} btntxt="Cerrar sesion" log={true} />;
  }
  if (!usuarios.length) {
    return (
      <Informa
        text="No se encontraron datos"
        btntxt="Volver para iniciar sesión"
        log={true}
      />
    );
  }

  const renderTable = () => {
    switch (selectedTable) {
      case "usuarios":
        return (
          <DataTableUsuarios
            data={usuarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user}
          />
        );
      case "fondos":
        return (
          <DataTableFondos
            data={fondos}
            onDelete={handleDelete}
            onEdit={handleEdit}
            user={user}
            mode="admin"
          />
        );
      case "clientes":
        return (
          <DataTableClientes
            data={clientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user}
          />
        );
      case "rutas":
        return (
          <DataTableRutas
            data={rutas}
            onEdit={handleEdit}
            onDelete={handleDelete}
            columns={rutaColumns}
            user={user}
          />
        );
      case "checkins":
        return (
          <DataTableCheckin
            data={checkin}
            onEdit={handleEditCheckin}
            onDelete={handleDeleteCheckin}
            user={user}
          />
        );
      case "servicios":
        return (
          <ServiciosTable
            data={servicios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            columns={servicioColumns}
            user={user}
          />
        );
      case "fechasCierre":
        return (
          <DataTableFechasCierre
            data={fechasCierre}
            onEdit={handleEdit}
            onDelete={handleDelete}
            columns={fechaCierreColumns}
            user={user}
          />
        );
      case "sedes":
        return (
          <DataTableSedes
            data={sedes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            columns={sedeColumns}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  const renderForm = () => {
    switch (selectedTable) {
      case "usuarios":
        return (
          <UsuarioForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            isEditMode={!!formData.idUsuario}
          />
        );
      case "fondos":
        return (
          <FondoForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            isEditMode={!!formData.idFondo}
          />
        );
      case "clientes":
        return (
          <ClienteForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            isEditMode={!!formData.idCliente}
            fondos={fondos}
          />
        );
      case "rutas":
        return (
          <RutaForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            isEditMode={!!formData.idRutaLlegada}
          />
        );
      case "servicios":
        return (
          <ServicioForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            isEditMode={!!formData.idServicio}
            checkin={checkin}
            usuarios={usuarios}
            clientes={clientes}
            fondos={fondos}
          />
        );
      case "fechasCierre":
        return (
          <FechaCierreForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            isEditMode={!!formData.idFechaCierre}
            usuarios={usuarios}
            fondos={fondos}
            servicios={servicios}
          />
        );
      case "sedes":
        return (
          <SedeForm
            formData={formData}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            isEditMode={!!formData.idSede}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <TopPage user={usuarios[0]} />
      <main className="container mx-auto p-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Panel de Administración
          </h2>
          <MenuBotones
            opciones={opcionesAdmin}
            estados={estados}
            setEstados={setEstados}
            onResetSelection={() => {
              setSelectedTable("");
              resetForm();
            }}
          />
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow mt-6">
          {selectedTable ? (
            <>
              <div className="mb-6">{renderForm()}</div>
              {renderTable()}
            </>
          ) : (
            <h3 className="text-center w-full font-bold text-3xl">
              Seleccione una tabla para administrar
            </h3>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Admin;
