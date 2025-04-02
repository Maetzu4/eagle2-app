// @/components/Operario/BilletesForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Servicio } from "@/types/interfaces";

type DenominationKey =
  | "B_100000"
  | "B_50000"
  | "B_20000"
  | "B_10000"
  | "B_5000"
  | "B_2000";

interface BilletesFormProps {
  formData: Servicio;
  isDisabled2: boolean;
  onDenominationChange: (denom: DenominationKey, value: number) => void;
}

const denominations: { key: DenominationKey; label: string; value: number }[] =
  [
    { key: "B_100000", label: "$100,000", value: 100000 },
    { key: "B_50000", label: "$50,000", value: 50000 },
    { key: "B_20000", label: "$20,000", value: 20000 },
    { key: "B_10000", label: "$10,000", value: 10000 },
    { key: "B_5000", label: "$5,000", value: 5000 },
    { key: "B_2000", label: "$2,000", value: 2000 },
  ];

export function BilletesForm({
  formData,
  isDisabled2,
  onDenominationChange,
}: BilletesFormProps) {
  return (
    <Table className="w-full mt-4 border border-gray-300">
      <TableHeader>
        <TableRow>
          <TableHead className="px-4 py-2 text-left">Denominación</TableHead>
          <TableHead className="px-4 py-2 text-left">Cantidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {denominations.map((denom) => (
          <TableRow key={denom.key}>
            <TableCell className="px-4 py-2">{denom.label}</TableCell>
            <TableCell className="flex items-center gap-2 px-4 py-2">
              <Button
                disabled={isDisabled2}
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onDenominationChange(
                    denom.key,
                    (formData[denom.key as keyof Servicio] as number) - 1
                  )
                }
              >
                <Minus />
              </Button>
              <input
                disabled={isDisabled2}
                type="number"
                name={denom.key}
                className="border p-1 w-16 text-center"
                value={formData[denom.key as keyof Servicio] as number}
                onChange={(e) =>
                  onDenominationChange(denom.key, parseInt(e.target.value) || 0)
                }
              />
              <Button
                disabled={isDisabled2}
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onDenominationChange(
                    denom.key,
                    (formData[denom.key as keyof Servicio] as number) + 1
                  )
                }
              >
                <Plus />
              </Button>
            </TableCell>
          </TableRow>
        ))}

        {/* Totales */}
        <TableRow>
          <TableCell className="px-4 py-2 font-bold">Total</TableCell>
          <TableCell className="px-4 py-2">
            <input
              disabled={true}
              type="text"
              value={formData.Sum_B}
              readOnly
              className="border p-1 w-full text-center"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="px-4 py-2 font-bold">Diferencia</TableCell>
          <TableCell className="px-4 py-2">
            <input
              disabled={true}
              type="text"
              value={formData.diferencia || 0}
              readOnly
              className="border p-1 w-full text-center"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
