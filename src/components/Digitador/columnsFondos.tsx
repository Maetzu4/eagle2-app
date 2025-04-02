// @/components/Digitador/columnsFondos.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Fondo, Cliente } from "@/types/interfaces";
import { highlightMatch } from "@/components/General/utils";
import { RadioGroupItem } from "@/components/ui/radio-group";

export const columns: ColumnDef<Fondo>[] = [
  {
    id: "select",
    header: "Selección",
    cell: ({ row }) => (
      <RadioGroupItem
        value={row.original.idFondo.toString()}
        id={`fondo-${row.original.idFondo}`}
      />
    ),
  },
  {
    accessorKey: "idFondo",
    header: "Código",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("idFondo")?.toString() || "";
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
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const value = row.getValue("tipo")?.toString() || "";
      return <div>{highlightMatch(value, filterValue)}</div>;
    },
  },
  {
    accessorKey: "clientes",
    header: "Clientes",
    cell: ({ row, table }) => {
      const filterValue = table.getState().globalFilter || "";
      const clientes: Cliente[] = row.getValue("clientes") || [];

      // Mostramos los primeros 3 clientes y "..." si hay más
      const displayedClients = clientes.slice(0, 3);
      const hasMore = clientes.length > 3;

      return (
        <div>
          {displayedClients.map((cliente, index) => (
            <div key={index}>
              {highlightMatch(cliente.name.replace("_", " "), filterValue)}
            </div>
          ))}
          {hasMore && <div>...</div>}
        </div>
      );
    },
  },
];
