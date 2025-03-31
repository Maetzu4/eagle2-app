import React from "react";
import LogOutBtn from "@/components/Auth/logOutBtn";
import { Usuario } from "@/types/interfaces";

interface TopPageProps {
  user: Usuario;
}

export const TopPage: React.FC<TopPageProps> = ({ user }) => {
  return (
    <header className="bg-transparent text-white top-0 z-50 p-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          Bienvenido, {user.name + " " + user.lastname}
        </h1>
        <div className="flex space-x-4">
          <LogOutBtn text={"Cerrar sesión"} />
        </div>
      </div>
    </header>
  );
};
