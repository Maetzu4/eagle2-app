// @/components/General/MenuBotones.tsx
"use client";
import { Button } from "@/components/ui/button";

export interface OpcionMenu {
  id: string;
  label: string;
  estadoKey: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

interface MenuBotonesProps {
  opciones: OpcionMenu[];
  estados: Record<string, boolean>;
  setEstados: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onResetSelection?: () => void;
}

export function MenuBotones({
  opciones,
  estados,
  setEstados,
  onResetSelection,
}: MenuBotonesProps) {
  const handleClick = (opcion: OpcionMenu) => {
    const newEstados = { ...estados };

    // Alternar el estado de la opción clickeada
    newEstados[opcion.estadoKey] = !newEstados[opcion.estadoKey];

    // Apagar los demás estados
    Object.keys(newEstados).forEach((key) => {
      if (key !== opcion.estadoKey) {
        newEstados[key] = false;
      }
    });

    setEstados(newEstados);
    onResetSelection?.();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      {opciones.map((opcion) => (
        <Button
          key={opcion.id}
          onClick={() => handleClick(opcion)}
          variant={opcion.variant || "default"}
          className={opcion.className}
        >
          {estados[opcion.estadoKey]
            ? opcion.label.replace("Abrir", "Cerrar")
            : opcion.label}
        </Button>
      ))}
    </div>
  );
}
