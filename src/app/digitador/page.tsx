//@/app/digitador/page.tsx
import { auth } from "@/auth";
import DigitadorOpciones from "@/app/digitador/page.client";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { user } from "@/types/interfaces";

async function IngresoFacturaContainer() {
  const session = await auth();
  let texto = "";
  const userr: user = {
    id: session?.user.id || "",
    name: session?.user.name || "",
    role: session?.user.role || "",
    email: session?.user.email || "",
  };
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

  // Extraer el rol de la sesión
  const rol = session.user?.role || "";

  // Verificar si el usuario tiene el rol correcto
  if (rol !== "digitador") {
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

  // Pasar el rol como una prop a CheckinLlegadas
  return <DigitadorOpciones user={userr} />;
}

export default IngresoFacturaContainer;
