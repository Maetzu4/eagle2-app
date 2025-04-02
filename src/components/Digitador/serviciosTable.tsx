// @/components/Digitador/serviciosTable.tsx
"use client";
import { Servicio, Fondo, Cliente } from "@/types/interfaces";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  OnChangeFn,
  HeaderGroup,
  Row,
  Cell,
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/General/pagination";
import { SearchBar } from "@/components/General/searchBar";
import { columns } from "@/components/Digitador/columnsServicios";

interface ServiciosTableProps {
  data: Servicio[];
  onSelectionChange: (selected: number[]) => void;
}

export function ServiciosTable({
  data,
  onSelectionChange,
}: ServiciosTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterValue, setFilterValue] = useState("");

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const newState =
      typeof updater === "function" ? updater(rowSelection) : updater;

    const selectedIds = Object.keys(newState)
      .filter((key) => newState[key])
      .map((key) => {
        const row = data.find((d) => d.idServicio?.toString() === key);
        return row?.idServicio;
      })
      .filter((id): id is number => id !== undefined);

    setRowSelection(newState);
    onSelectionChange(selectedIds);
  };

  const table = useReactTable<Servicio>({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      globalFilter: filterValue,
    },
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.idServicio?.toString() || "",
    globalFilterFn: (row, columnId, filterValue) => {
      const visibleFields = [
        "planilla",
        "sello",
        "Sum_B",
        "fondoId",
        "clienteId",
      ];

      return visibleFields.some((field) => {
        const value = row.original[field as keyof Servicio];

        if (field === "fondoId") {
          const fondo =
            (row.original as Servicio & { fondo?: Fondo })?.fondo?.nombre || "";
          return fondo.toLowerCase().includes(filterValue.toLowerCase());
        }

        if (field === "clienteId") {
          const cliente =
            (
              row.original as Servicio & { clientes?: Cliente }
            )?.clientes?.name?.replace("_", " ") || "";
          return cliente.toLowerCase().includes(filterValue.toLowerCase());
        }

        if (field === "Sum_B") {
          const sum = row.original.Sum_B?.toString() || "0";
          return sum.toLowerCase().includes(filterValue.toLowerCase());
        }

        return value
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    },
  });

  // Configurar paginación inicial
  useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SearchBar onSearch={setFilterValue} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<Servicio>) => (
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
              table.getRowModel().rows.map((row: Row<Servicio>) => (
                <TableRow key={row.id}>
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<Servicio, unknown>) => (
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
                  No hay servicios inactivos
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
