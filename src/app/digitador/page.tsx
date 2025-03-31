//@/app/digitador/page.tsx
import { auth } from "@/auth";
import DigitadorOpciones from "@/app/digitador/page.client";
import { user } from "@/types/interfaces";
import { Informa } from "@/components/General/informa";

async function IngresoFacturaContainer() {
  const session = await auth();
  const userr: user = {
    id: session?.user.id || "",
    name: session?.user.name || "",
    role: session?.user.role || "",
    email: session?.user.email || "",
  };
  //verificar que la sesion exista
  if (!session) {
    return (
      <Informa
        text="Inicia sesión para continuar"
        btntxt="Volver para iniciar sesión"
        log={true}
      />
    );
  }
  // Verificar si el usuario tiene el rol correcto
  const rol = session.user?.role || "";
  if (rol !== "digitador") {
    return (
      <Informa
        text="Acceso denegado"
        btntxt="Volver para iniciar sesión"
        log={true}
      />
    );
  }
  // Componente principal con toda la logica de digitador
  return <DigitadorOpciones user={userr} />;
}

export default IngresoFacturaContainer;
