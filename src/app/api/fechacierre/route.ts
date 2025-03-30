// @/app/api/fechacierre/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { servicioId, digitadorId, fondoId } = await req.json();

    if (!servicioId || !digitadorId || !fondoId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // 1. Obtener el servicio para asegurarnos que existe y obtener su fecha
    const servicio = await prisma.servicio.findUnique({
      where: { idServicio: servicioId },
    });

    if (!servicio) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    // 2. Crear fecha de cierre usando la fechaRegistro del servicio
    const fechaCierreRecord = await prisma.fechaCierre.create({
      data: {
        fecha_a_cerrar: servicio.fechaRegistro, // Usamos la fecha del servicio
        digitadorId: digitadorId,
        fondoId: fondoId,
        servicioId: servicioId,
      },
    });

    // 3. Actualizar servicio a inactivo y asociar la fecha de cierre
    const servicioActualizado = await prisma.servicio.update({
      where: { idServicio: servicioId },
      data: {
        estado: "Inactivo",
        fechaCierreId: fechaCierreRecord.idFechaCierre,
      },
      include: {
        fecha_cierre: true,
      },
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
