//@/app/chekin/page.tsx
import { auth } from "@/auth";
import CheckinLlegadas from "@/app/checkin/page.client";
import { user } from "@/types/interfaces";
import { Informa } from "@/components/General/informa";

async function CheckinLlegadasContainer() {
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
  if (rol !== "checkinero") {
    return (
      <Informa
        text="Acceso denegado"
        btntxt="Volver para iniciar sesión"
        log={true}
      />
    );
  }
  // componente principal con toda la logica de checkin
  return <CheckinLlegadas user={userr} />;
}

export default CheckinLlegadasContainer;
