// src/components/Admin/opcionesAdmin.ts
import { OpcionMenu } from "@/components/General/menuBotones";

export const opcionesAdmin: OpcionMenu[] = [
  {
    id: "usuarios",
    label: "Administrar Usuarios",
    estadoKey: "isUsuarios",
  },
  {
    id: "fondos",
    label: "Administrar Fondos",
    estadoKey: "isFondos",
  },
  {
    id: "clientes",
    label: "Administrar Clientes",
    estadoKey: "isClientes",
  },
  {
    id: "rutas",
    label: "Administrar Rutas",
    estadoKey: "isRutas",
  },
  {
    id: "checkins",
    label: "Administrar Check-ins",
    estadoKey: "isCheckins",
  },
  {
    id: "servicios",
    label: "Administrar Servicios",
    estadoKey: "isServicios",
  },
  {
    id: "fechasCierre",
    label: "Administrar Fechas Cierre",
    estadoKey: "isFechasCierre",
  },
  {
    id: "sedes",
    label: "Administrar Sedes",
    estadoKey: "isSedes",
  },
];
