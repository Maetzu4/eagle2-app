// @/components/Digitador/fondosTable.tsx
"use client";
import { Cliente, Fondo } from "@/types/interfaces";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Pagination } from "@/components/General/pagination";
import { SearchBar } from "@/components/General/searchBar";
import { TableHeader } from "@/components/General/tableHeader";
import { TableBody } from "@/components/General/tableBody";
import { highlightMatch } from "@/components/Checkin/utils";

export const columns: ColumnDef<Fondo>[] = [
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

interface FondosTableProps {
  data: Fondo[];
}

export function FondosTable({ data }: FondosTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterValue, setFilterValue] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filterValue,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const lowercaseFilter = filterValue.toLowerCase();
      const fondo = row.original;

      // Buscar en campos directos
      if (
        fondo.idFondo.toString().toLowerCase().includes(lowercaseFilter) ||
        fondo.nombre.toLowerCase().includes(lowercaseFilter) ||
        fondo.tipo.toLowerCase().includes(lowercaseFilter)
      ) {
        return true;
      }

      // Buscar en nombres de clientes
      if (
        fondo.clientes?.some((cliente) =>
          cliente.name.toLowerCase().includes(lowercaseFilter)
        )
      ) {
        return true;
      }

      return false;
    },
  });

  useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h2 className="text-2xl font-bold">Listado de Fondos</h2>
        <SearchBar onSearch={setFilterValue} />
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <TableHeader table={table} />
          <TableBody table={table} columns={table.getAllColumns()} />
        </table>
      </div>

      <div className="flex justify-end py-4">
        <Pagination table={table} />
      </div>
    </div>
  );
}
