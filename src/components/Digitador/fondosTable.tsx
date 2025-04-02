// @/components/Digitador/fondosTable.tsx
"use client";
import { Fondo } from "@/types/interfaces";
import {
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
import { RadioGroup } from "@/components/ui/radio-group";
import { columns } from "@/components/Digitador/columnsFondos";

interface FondosTableProps {
  data: Fondo[];
  onSelect: (fondoId: number) => void;
  selectedFondoId: number | null;
  setSelectedServiceId: (selectedServiceId: null) => void;
  selectedServiceId: null | number;
}

export function FondosTable({
  data,
  onSelect,
  selectedFondoId,
  setSelectedServiceId,
}: FondosTableProps) {
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
        <h3 className="text-3xl font-bold">Listado de Fondos</h3>
        <SearchBar onSearch={setFilterValue} />
      </div>

      <RadioGroup
        value={selectedFondoId?.toString() || ""}
        onValueChange={(value) => {
          onSelect(Number(value));
          setSelectedServiceId(null);
        }}
        className="space-y-4"
      >
        <div className="rounded-md border">
          <table className="w-full">
            <TableHeader table={table} />
            <TableBody table={table} columns={table.getAllColumns()} />
          </table>
        </div>
      </RadioGroup>

      <div className="flex justify-end py-4">
        <Pagination table={table} />
      </div>
    </div>
  );
}
