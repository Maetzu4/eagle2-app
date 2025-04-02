// @/components/Digitador/columnsServicios.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Servicio, Fondo, Cliente } from "@/types/interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { highlightMatch } from "@/components/General/utils";

export const columns: ColumnDef<Servicio>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "planilla",
    header: "Planilla",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("planilla")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "sello",
    header: "Sello",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("sello")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "Sum_B",
    header: "Total",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = `$${row.original.Sum_B?.toLocaleString("es-CO")}`;
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "fondoId",
    header: "Fondo",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const servicio = row.original as Servicio & { fondo?: Fondo };
      const value = servicio.fondo?.nombre || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "clienteId",
    header: "Cliente",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const servicio = row.original as Servicio & { clientes?: Cliente };
      const value = servicio.clientes?.name?.replace("_", " ") || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
];
