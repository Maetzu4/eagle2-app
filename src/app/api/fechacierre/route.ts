// @/app/api/fechacierre/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { servicioId, digitadorId, fondoId, fechaCierre } = await req.json();

    if (!servicioId || !digitadorId || !fondoId || !fechaCierre) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 1. Crear fecha de cierre
    const fechaCierreRecord = await prisma.fechaCierre.create({
      data: {
        fecha_a_cerrar: new Date(fechaCierre),
        servicioId: servicioId,
        digitadorId: digitadorId,
        fondoId: fondoId,
      },
    });

    // 2. Actualizar servicio a inactivo
    const servicioActualizado = await prisma.servicio.update({
      where: { idServicio: servicioId },
      data: { estado: "Inactivo" },
    });

    return NextResponse.json(
      {
        fechaCierre: fechaCierreRecord,
        servicio: servicioActualizado,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al procesar el cierre" },
      { status: 500 }
    );
  }
}
