
import { auth } from "@/auth";
import DigitadorOpciones from "./page.client";
import LogOutBtn from "@/components/logOutBtn";

async function DigitadorOpcionesContainer() {

  const session = await auth();
  let texto = "";

  if (!session) {
    texto = "Volver para iniciar sesión"
    return <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-50">Inicia sesión para continuar</h1>
      </div>
      <div>
        <LogOutBtn text={texto} />
      </div>
    </div>
  }

  if (session?.user?.role !== "digitador") {
    texto = "Volver para iniciar sesión"
    return <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-bl from-slate-400 to-cyan-800 space-y-20">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-cyan-50">Acceso denegado</h1>
    </div>
    <div>
      <LogOutBtn text={texto} />
    </div>
  </div>
  }

  return (
    <DigitadorOpciones user={session} />
  );
}

export default DigitadorOpcionesContainer;