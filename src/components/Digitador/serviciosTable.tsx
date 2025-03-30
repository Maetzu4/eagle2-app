// @/components/Digitador/serviciosTable.tsx
"use client";
import { Servicio, Fondo, Cliente } from "@/types/interfaces";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  OnChangeFn,
  HeaderGroup,
  Row,
  Cell,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

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
  },
  {
    accessorKey: "sello",
    header: "Sello",
  },
  {
    accessorKey: "Sum_B",
    header: "Total",
    cell: ({ row }) => `$${row.original.Sum_B?.toLocaleString("es-CO")}`,
  },
  {
    accessorKey: "fondoId",
    header: "Fondo",
    cell: ({ row }) => {
      const servicio = row.original as Servicio & { fondo?: Fondo };
      return servicio.fondo?.nombre || "";
    },
  },
  {
    accessorKey: "clienteId",
    header: "Cliente",
    cell: ({ row }) => {
      const servicio = row.original as Servicio & { clientes?: Cliente };
      return servicio.clientes?.name?.replace("_", " ") || "";
    },
  },
];

interface ServiciosTableProps {
  data: Servicio[];
  columns: ColumnDef<Servicio>[];
  onSelectionChange: (selected: number[]) => void;
}

export function ServiciosTable({
  data,
  columns,
  onSelectionChange,
}: ServiciosTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
    },
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.idServicio?.toString() || "",
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<Servicio>) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
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
                {row.getVisibleCells().map((cell: Cell<Servicio, unknown>) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay servicios inactivos
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
