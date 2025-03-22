"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Checkin, Cliente, Fondo, Usuario } from "@/types/checkin";

interface DataTableProps {
  data: Checkin[];
  onDelete: (ids: number[]) => void;
  onEdit: (id: number) => void;
}

// Función de filtrado global
const globalFilterFn = (
  row: Row<Checkin>,
  columnId: string,
  filterValue: string
): boolean => {
  const visibleFields = [
    "planilla",
    "sello",
    "declarado",
    "rutaLlegadaId",
    "fechaRegistro",
    "checkinero",
    "clientes",
    "fondo",
  ];

  return visibleFields.some((field) => {
    const value = row.original[field as keyof Checkin];

    // Manejar campos relacionados
    if (field === "checkinero") {
      const checkinero: Usuario = value as Usuario;
      const fullName = `${checkinero.name} ${checkinero.lastname}`;
      return fullName.toLowerCase().includes(filterValue.toLowerCase());
    }

    if (field === "clientes") {
      const cliente: Cliente = value as Cliente;
      return cliente.name.toLowerCase().includes(filterValue.toLowerCase());
    }

    if (field === "fondo") {
      const fondo: Fondo = value as Fondo;
      return fondo.nombre.toLowerCase().includes(filterValue.toLowerCase());
    }

    // Manejar campos simples
    if (field === "fechaRegistro") {
      if (value instanceof Date) {
        return value
          .toLocaleString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      if (typeof value === "string") {
        const date = new Date(value);
        return date
          .toLocaleString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      return false;
    }

    if (field === "declarado") {
      const declarado = parseFloat(value?.toString() || "0");
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(declarado);
      return formatted.toLowerCase().includes(filterValue.toLowerCase());
    }

    // Para otros campos, simplemente comparar el valor como string
    return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
  });
};

// Función para resaltar coincidencias
const highlightMatch = (text: string, filterValue: string) => {
  if (!filterValue) return text; // No resaltar si no hay valor de filtro

  const regex = new RegExp(`(${filterValue})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: "#0891b2", color: "#000" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

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
      const value = new Date(row.getValue("fechaRegistro")).toLocaleString(); // Mostrar fecha y hora
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

export function DataTable({ data, onDelete, onEdit }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterValue, setFilterValue] = React.useState(""); // Estado para el filtro global

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
      globalFilter: filterValue, // Filtro global
    },
    globalFilterFn: globalFilterFn, // Función de filtrado global
  });

  // Función para eliminar múltiples registros
  const handleDeleteSelected = () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.idCheckin)
      .filter((id): id is number => id !== undefined);

    console.log("IDs seleccionados para eliminar:", selectedIds); // Depuración

    if (selectedIds.length === 0) {
      alert("No se seleccionaron check-ins para eliminar");
      return;
    }

    onDelete(selectedIds); // Llamar a la función handleDelete del componente padre
  };

  // Función para editar un solo registro
  const handleEditSelected = () => {
    const selectedId = table.getSelectedRowModel().rows[0].original.idCheckin;
    if (selectedId !== undefined) {
      onEdit(selectedId); // Llamar a la función handleEdit del componente padre
      table.toggleAllRowsSelected(false); // Deseleccionar todas las filas
      window.scrollTo(0, 0); // Mover el scroll hasta arriba
    }
  };

  return (
    <Card className="bg-white p-6 rounded-lg shadow mt-6">
      <div className="w-full">
        <div className="flex items-center py-4">
          <div className="flex justify-between w-full">
            <h2 className="text-3xl font-bold">Check-ins</h2>
            <Input
              placeholder="Buscar en todas las columnas..."
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="bg-cyan-700 text-white"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
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
                    No hay resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
          </div>
          <div className="flex items-center space-x-2">
            {table.getSelectedRowModel().rows.length === 1 && (
              <Button
                onClick={handleEditSelected}
                className="bg-cyan-700 text-white hover:bg-cyan-800"
              >
                Editar
              </Button>
            )}

            {table.getSelectedRowModel().rows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Eliminar seleccionados (
                    {table.getSelectedRowModel().rows.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminarán los
                      check-ins seleccionados permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteSelected}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-cyan-700 text-white hover:bg-cyan-800"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-cyan-700 text-white hover:bg-cyan-800"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
