"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Usuario, user } from "@/types/interfaces";
import { Pagination } from "@/components/General/pagination";
import { SearchBar } from "@/components/General/searchBar";
import { TableActions } from "@/components/General/tableActions";
import { TableHeader } from "@/components/General/tableHeader";
import { TableBody } from "@/components/General/tableBody";

interface DataTableProps {
  data: Usuario[];
  columns: ColumnDef<Usuario>[];
  onDelete: (ids: number[]) => void;
  onEdit: (id: number) => void;
  user: user;
}

export function DataTableUsuarios({
  data,
  columns,
  onDelete,
  onEdit,
  user,
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
      const value = row.getValue(columnId)?.toString().toLowerCase() || "";
      return value.includes(filterValue.toLowerCase());
    },
  });

  const handleDeleteSelected = () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.idUsuario)
      .filter((id): id is number => id !== undefined);

    if (selectedIds.length === 0) {
      alert("No se seleccionaron usuarios para eliminar");
      return;
    }

    onDelete(selectedIds);
  };

  React.useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  const handleEditSelected = () => {
    const selectedId = table.getSelectedRowModel().rows[0].original.idUsuario;
    if (selectedId !== undefined) {
      onEdit(selectedId);
      table.toggleAllRowsSelected(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-bold">Usuarios</h2>
          <SearchBar onSearch={setFilterValue} />
        </div>
      </div>

      <div className="rounded-md border">
        <table>
          <TableHeader table={table} />
          <TableBody table={table} columns={table.getAllColumns()} />
        </table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="flex items-center space-x-2">
          {user.role === "administrador" && (
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
