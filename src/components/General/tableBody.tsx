import { flexRender, Table, Column } from "@tanstack/react-table";
import {
  TableBody as TableBodyUI,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface TableBodyProps<TData> {
  table: Table<TData>;
  columns: Column<TData>[];
}

export function TableBody<TData>({ table, columns }: TableBodyProps<TData>) {
  return (
    <TableBodyUI>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No hay resultados.
          </TableCell>
        </TableRow>
      )}
    </TableBodyUI>
  );
}
