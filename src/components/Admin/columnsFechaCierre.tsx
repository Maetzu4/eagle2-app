// src/components/Admin/columnsFechaCierre.tsx
import { ColumnDef } from "@tanstack/react-table";
import { FechaCierre, Usuario, Fondo, Servicio } from "@/types/interfaces";
import { highlightMatch } from "@/components/General/utils";

export const columns: ColumnDef<FechaCierre>[] = [
  {
    accessorKey: "idFechaCierre",
    header: "ID",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("idFechaCierre")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "fecha_a_cerrar",
    header: "Fecha Cerrada",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const fecha: Date = row.getValue("fecha_a_cerrar");
      const dateObj = new Date(fecha);
      const value = dateObj.toLocaleString(); // Formato consistente con el resto del proyecto
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "digitador",
    header: "Digitador",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const digitador: Usuario = row.getValue("digitador");
      const value = `${digitador?.name} ${digitador?.lastname}`;
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "fondo",
    header: "Fondo",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const fondo: Fondo = row.getValue("fondo");
      const value = fondo?.nombre || "Sin fondo";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "servicio",
    header: "Servicio",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const servicio: Servicio = row.getValue("servicio");
      const value = servicio ? `Planilla ${servicio.planilla}` : "Sin servicio";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
];
