// src/components/Admin/columnsUsuarios.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Usuario, Sede } from "@/types/interfaces";
import { highlightMatch } from "@/components/General/utils";

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "idUsuario",
    header: "ID",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("idUsuario")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("name")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "lastname",
    header: "Apellido",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("lastname")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("email")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("role")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "sede",
    header: "Sede",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const sede: Sede = row.getValue("sede");
      const value = sede?.nombre || "Sin sede";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
];
