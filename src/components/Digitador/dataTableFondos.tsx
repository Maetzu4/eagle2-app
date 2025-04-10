//@/components/Digitador/dataTableFondos.tsx
"use client";
import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fondo, user } from "@/types/interfaces";
import { Pagination } from "@/components/General/pagination";
import { SearchBar } from "@/components/General/searchBar";
import { TableHeader } from "@/components/General/tableHeader";
import { TableBody } from "@/components/General/tableBody";
import { RadioGroup } from "@/components/ui/radio-group";
import { columns } from "@/components/Digitador/columnsFondos";
import { TableActions } from "@/components/General/tableActions";

interface DataTableProps {
  data: Fondo[];
  onDelete?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
  user: user;
  // Nuevas props para la selección
  onSelect?: (fondoId: number) => void;
  selectedFondoId?: number | null;
  setSelectedServiceId?: (selectedServiceId: null) => void;
  mode?: "admin" | "selection"; // Modo de operación
}

export function DataTableFondos({
  data,
  onDelete,
  onEdit,
  user,
  onSelect,
  selectedFondoId,
  setSelectedServiceId,
  mode = "admin", // Por defecto modo admin
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterValue, setFilterValue] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filterValue,
    },
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

  const handleDeleteSelected = () => {
    if (!onDelete) return;

    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.idFondo)
      .filter((id): id is number => id !== undefined);

    if (selectedIds.length === 0) {
      alert("No se seleccionaron fondos para eliminar");
      return;
    }

    onDelete(selectedIds);
  };

  React.useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  const handleEditSelected = () => {
    if (!onEdit) return;

    const selectedId = table.getSelectedRowModel().rows[0].original.idFondo;
    if (selectedId !== undefined) {
      onEdit(selectedId);
      table.toggleAllRowsSelected(false);
      window.scrollTo(0, 0);
    }
  };

  // Contenido común para ambos modos
  const tableContent = (
    <>
      <div className="flex items-center py-4">
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-bold">Fondos</h2>
          <SearchBar onSearch={setFilterValue} />
        </div>
      </div>

      <div className="rounded-md border">
        <table>
          <TableHeader table={table} />
          <TableBody table={table} columns={table.getAllColumns()} />
        </table>
      </div>
    </>
  );

  return (
    <div className="w-full">
      {mode === "selection" && onSelect ? (
        <RadioGroup
          value={selectedFondoId?.toString() || ""}
          onValueChange={(value) => {
            onSelect(Number(value));
            if (setSelectedServiceId) {
              setSelectedServiceId(null);
            }
          }}
          className="space-y-4"
        >
          {tableContent}
        </RadioGroup>
      ) : (
        tableContent
      )}

      <div className="flex items-center justify-between py-4">
        {mode === "admin" && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
          </div>
        )}
        <div className="flex items-center space-x-2">
          {mode === "admin" && user.role === "administrador" && (
            <TableActions
              onEdit={handleEditSelected}
              onDelete={handleDeleteSelected}
              selectedCount={table.getSelectedRowModel().rows.length}
            />
          )}
          <Pagination table={table} />
        </div>
      </div>
    </div>
  );
}
