//app/digitador/page.txs
import { auth } from "@/auth";
import { DigitadorOpciones } from "@/app/digitador/page.client";
import LogOutBtn from "@/components/Auth/logOutBtn";

async function DigitadorOpcionesContainer() {
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

  // Pasar el rol como una prop a DigitadorOpciones
  return <DigitadorOpciones rol={rol} />;
}

export default DigitadorOpcionesContainer;
