//@/app/chekin/page.tsx
import { auth } from "@/auth";
import { user } from "@/types/interfaces";
import { Informa } from "@/components/General/informa";
import { Admin } from "@/app/admin/page.client";

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
  if (rol !== "administrador") {
    return (
      <Informa
        text="Acceso denegado"
        btntxt="Volver para iniciar sesión"
        log={true}
      />
    );
  }
  // componente principal con toda la logica de admin
  return <Admin user={userr} />;
}

export default CheckinLlegadasContainer;
