// @/components/Digitador/serviciosTable.tsx
"use client";
import { useState, useEffect } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { Servicio } from "@/types/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/General/pagination";
import { SearchBar } from "@/components/General/searchBar";
import { columns } from "@/components/Digitador/columnsServicios";
import { Button } from "@/components/ui/button";
import { user } from "@/types/interfaces";

interface ServiciosTableProps {
  data: Servicio[];
  onEdit: (id: number) => void;
  onDelete: (ids: number[]) => Promise<void>;
  onCreate?: () => void;
  user: user;
}

export function ServiciosTable({
  data,
  onEdit,
  onDelete,
  onCreate,
  user,
}: ServiciosTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterValue, setFilterValue] = useState("");

  const table = useReactTable<Servicio>({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      globalFilter: filterValue,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.idServicio?.toString() || "",
  });

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection)
      .map((id) => parseInt(id))
      .filter((id): id is number => !isNaN(id));

    if (selectedIds.length > 0) {
      await onDelete(selectedIds);
      setRowSelection({});
    }
  };

  const handleEditSelected = () => {
    const selectedId = Object.keys(rowSelection)[0];
    if (selectedId) {
      onEdit(parseInt(selectedId));
      window.scrollTo(0, 0); // Para que vea el formulario de edición
    }
  };

  useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Servicios</h2>
        <div className="flex items-center space-x-2">
          {user.role === "administrador" && (
            <>
              {onCreate && <Button onClick={onCreate}>Crear Servicio</Button>}
              <Button
                onClick={handleEditSelected}
                disabled={Object.keys(rowSelection).length !== 1}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={Object.keys(rowSelection).length === 0}
              >
                Eliminar
              </Button>
            </>
          )}
          <SearchBar onSearch={setFilterValue} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay servicios registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <Pagination table={table} />
      </div>
    </div>
  );
}
