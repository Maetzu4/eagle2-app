import { flexRender, Table } from "@tanstack/react-table";
import {
  TableHead,
  TableHeader as BaseTableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableHeaderProps<TData> {
  table: Table<TData>;
}

export function TableHeader<TData>({ table }: TableHeaderProps<TData>) {
  return (
    <BaseTableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id} className="bg-cyan-700 text-white">
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
    </BaseTableHeader>
  );
}
