// src/components/Digitador/FondosTable.tsx
"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Fondo } from "@/types/checkin";

interface FondosTableProps {
  fondos: Fondo[];
}

export function FondosTable({ fondos }: FondosTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Clientes</TableHead>
          {/* <TableHead>Fechas de cierre</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {fondos.map((fond) => (
          <TableRow key={fond.idFondo}>
            <TableCell>{fond.idFondo}</TableCell>
            <TableCell>{fond.nombre}</TableCell>
            <TableCell>{fond.tipo}</TableCell>
            <TableCell>
              {fond.clientes.map((client, index) => (
                <span key={index}>
                  - {client.name.replace("_", " ")}
                  <br />
                </span>
              ))}
            </TableCell>
            {/* <TableCell>
              {fond.fecha_de_cierre
                ? new Date(fond.fecha_de_cierre).toLocaleDateString()
                : "Sin fecha de cierre"}
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
