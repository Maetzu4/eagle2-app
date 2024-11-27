"use client";

import { Button } from "@/components/ui/button";
import LogOutBtn from "@/components/logOutBtn";
import { Card } from "@/components/ui/card";
import CheckinLlegadas from "@/app/checkin/page.client"

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    lastName: string;
  };
}

interface DigitadorOpcionesProps {
  user: Session;
}

const DigitadorOpciones: React.FC<DigitadorOpcionesProps> = ({ user }) => {

  const abrirRuta = () => {
    window.open('/checkin', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <header className="bg-transparent text-white top-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Bienvenido, {user.user.name}</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <LogOutBtn text={"cerrar sesión"} />
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Gestion de procesos
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
            <div className="items-center gap-4">
              <Button
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md">
                Ver Llegadas
              </Button>
            </div>
            <div className="items-center gap-4">
              <Button
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md">
                Ver Fechas Cerradas
              </Button>
            </div>
            <div className="items-center gap-4">
              <Button
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md">
                Ver Fondos
              </Button>
            </div>
            <div className="items-center gap-4">
              <Button
                onClick={abrirRuta}
                className="w-full max-w-xs py-3 text-white bg-cyan-700 hover:bg-cyan-900 rounded-md">
                Proceso de Cierre de Fecha
              </Button>
            </div>
          </div>
        </Card>

        {/* <Card className="bg-white p-6 rounded-lg shadow mt-6">
          <CheckinLlegadas user ={user} />
        </Card> */}

      </main>
    </div>
  );
}

export default DigitadorOpciones;