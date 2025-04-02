//@/components/Checkin/columnsCheckin.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Usuario, Cliente, Fondo, Checkin } from "@/types/interfaces";
import { highlightMatch } from "@/components/General/utils";

export const columns: ColumnDef<Checkin>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
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
    accessorKey: "declarado",
    header: "Declarado",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("declarado")?.toString() || "";
      const declarado = parseFloat(value);
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(declarado);

      return <div>{highlightMatch(formatted, filterValue)}</div>;
    },
  },
  {
    accessorKey: "rutaLlegadaId",
    header: "Ruta",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("rutaLlegadaId")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "fechaRegistro",
    header: "Fecha de Registro",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = new Date(row.getValue("fechaRegistro")).toLocaleString();
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "checkinero",
    header: "Checkinero",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const checkinero: Usuario = row.getValue("checkinero");
      const value = `${checkinero.name} ${checkinero.lastname}`;
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "clientes",
    header: "Cliente",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const cliente: Cliente = row.getValue("clientes");
      const value = cliente.name;
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "fondo",
    header: "Fondo",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const fondo: Fondo = row.getValue("fondo");
      const value = fondo.nombre;
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
];
