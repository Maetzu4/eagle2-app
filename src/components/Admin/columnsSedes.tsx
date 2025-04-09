// src/components/Admin/columnsSedes.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Sede } from "@/types/interfaces";
import { highlightMatch } from "@/components/General/utils";

export const columns: ColumnDef<Sede>[] = [
  {
    accessorKey: "idSede",
    header: "ID",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("idSede")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("nombre")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "direccion",
    header: "Dirección",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("direccion")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("telefono")?.toString() || "";
      return <div>{highlightMatch(value || "N/A", filterValue)}</div>;
    },
  },
];
