//@/components/Auth/logOutBtn.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  text: string;
}

const LogOutBtn: React.FC<Props> = ({ text: texto }) => {
  const route = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del diálogo

  const handleLogOut = () => {
    route.push("logout"); // Redirige al usuario a la ruta de logout
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{texto}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción cerrará tu sesión. ¿Deseas continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-cyan-700">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogOut}
            className="bg-red-600 hover:bg-red-800"
          >
            Cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogOutBtn;
