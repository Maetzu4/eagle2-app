// @/components/Digitador/opcionesDigitador.ts
import { OpcionMenu } from "@/components/General/menuBotones";

export const opcionesDigitador: OpcionMenu[] = [
  {
    id: "checkin",
    label: "Abrir llegadas",
    estadoKey: "isCheckin",
  },
  {
    id: "proceso",
    label: "Abrir proceso de Cierre",
    estadoKey: "isProceso",
  },
  {
    id: "pdf",
    label: "Abrir Menu Pdfs",
    estadoKey: "isPdf",
  },
];
