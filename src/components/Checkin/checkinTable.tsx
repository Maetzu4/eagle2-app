// src/components/checkin/CheckinTable.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkin, Cliente, Usuario } from "@/types/checkin";

interface CheckinTableProps {
  checkin: Checkin[];
  clientes: Cliente[];
  usuarios: Usuario[];
  rol: string;
  onEdit: (checkin: Checkin) => void;
  onDelete: (id: number) => void;
}

export function CheckinTable({
  checkin,
  clientes,
  usuarios,
  rol,
  onEdit,
  onDelete,
}: CheckinTableProps) {
  return (
    <Card className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Listado de Check-ins
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número de Factura</TableHead>
            <TableHead>Sello</TableHead>
            <TableHead>Valor Declarado</TableHead>
            <TableHead>Ruta</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha Registro</TableHead>
            <TableHead>Creado Por</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checkin.map((check) => {
            const cliente = clientes.find(
              (c) => c.idCliente === check.clienteId
            );
            const checkinero = usuarios.find(
              (u) => u.idUsuario === check.checkineroId
            );

            return (
              <TableRow key={check.idCheckin}>
                <TableCell>{check.planilla}</TableCell>
                <TableCell>{check.sello}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(check.declarado)}
                </TableCell>
                <TableCell>{check.rutaLlegadaId}</TableCell>
                <TableCell>
                  {cliente ? cliente.name.replace("_", " ") : "N/A"}
                </TableCell>
                <TableCell>
                  {check.fechaRegistro
                    ? new Date(check.fechaRegistro).toLocaleDateString(
                        "es-CO",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {checkinero
                    ? checkinero.name + " " + checkinero.lastname
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {rol === "checkinero" && (
                      <Button
                        onClick={() => onEdit(check)}
                        className="bg-cyan-700 hover:bg-cyan-900"
                      >
                        Editar
                      </Button>
                    )}
                    <Button
                      onClick={() => onDelete(check.idCheckin!)}
                      className="bg-red-600 hover:bg-red-800"
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
