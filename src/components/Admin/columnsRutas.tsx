// src/components/Admin/columnsRutas.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Checkin, RutaLlegada } from "@/types/interfaces";
import { highlightMatch } from "@/components/General/utils";

export const columns: ColumnDef<RutaLlegada>[] = [
  {
    accessorKey: "idRutaLlegada",
    header: "ID",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("idRutaLlegada")?.toString() || "";
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
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value =
        row.getValue("descripcion")?.toString() || "Sin descripción";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "checkins",
    header: "Check-ins",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const checkins: Checkin[] = row.getValue("checkins") || [];
      return (
        <div>{highlightMatch(checkins.length.toString(), filterValue)}</div>
      );
    },
  },
];
