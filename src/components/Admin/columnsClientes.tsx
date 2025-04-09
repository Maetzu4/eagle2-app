// src/components/Admin/columnsClientes.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Cliente, Fondo, Sede } from "@/types/interfaces";
import { highlightMatch } from "@/components/General/utils";

export const columns: ColumnDef<Cliente>[] = [
  {
    accessorKey: "idCliente",
    header: "ID",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("idCliente")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("name")?.toString().replace("_", " ") || "";
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
