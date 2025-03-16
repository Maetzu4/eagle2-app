import { auth } from "@/auth";
import IngresoFactura from "./page.cliente";
import LogOutBtn from "@/components/logOutBtn";
import { prisma } from "@/lib/prisma"; // Importa prisma para obtener datos adicionales

async function IngresoFacturaContainer() {
  const session = await auth();
  let texto = "";

  if (!session) {
    texto = "Volver para iniciar sesión";
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-cyan-50">
            Inicia sesión para continuar
          </h1>
        </div>
        <div>
          <LogOutBtn text={texto} />
        </div>
      </div>
    );
  }

  // Obtén datos adicionales del usuario desde la base de datos
  const user = await prisma.usuario.findUnique({
    where: {
      email: session.user?.email || "", // Usa el email de la sesión
    },
    select: {
      idUsuario: true, // Usa idUsuario en lugar de id
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    texto = "Volver para iniciar sesión";
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-cyan-50">
            Usuario no encontrado
          </h1>
        </div>
        <div>
          <LogOutBtn text={texto} />
        </div>
      </div>
    );
  }

  if (user.role !== "operario") {
    texto = "Volver para iniciar sesión";
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-cyan-50">Acceso denegado</h1>
        </div>
        <div>
          <LogOutBtn text={texto} />
        </div>
      </div>
    );
  }

  // Pasa solo los datos necesarios al client component
  return (
    <IngresoFactura
      user={{
        id: user.idUsuario.toString(), // Convierte idUsuario a string
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    />
  );
}

export default IngresoFacturaContainer;
