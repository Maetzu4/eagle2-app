// @/app/api/fechacierre/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// src/app/api/fechacierre/route.ts
export async function POST(req: Request) {
  try {
    const { fecha, servicioIds, digitadorId, fondoId } = await req.json();

    // Validar campos
    if (!fecha || !servicioIds?.length || !digitadorId || !fondoId) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Convertir la fecha a objeto Date
    const fechaCierre = new Date(fecha);
    if (isNaN(fechaCierre.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
    }

    // Verificar que los servicios existen y son del fondo correcto
    const servicios = await prisma.servicio.findMany({
      where: {
        idServicio: { in: servicioIds },
        fondoId: fondoId,
        estado: "Activo",
      },
    });

    if (servicios.length !== servicioIds.length) {
      return NextResponse.json(
        { error: "Algunos servicios no existen o no están activos" },
        { status: 400 }
      );
    }

    // Crear transacción
    const result = await prisma.$transaction([
      // Actualizar servicios
      prisma.servicio.updateMany({
        where: { idServicio: { in: servicioIds } },
        data: { estado: "Inactivo" },
      }),

      // Crear fechas de cierre
      ...servicioIds.map((servicioId: number) =>
        prisma.fechaCierre.create({
          data: {
            fecha_a_cerrar: fechaCierre,
            servicioId: servicioId,
            digitadorId: digitadorId,
            fondoId: fondoId,
          },
        })
      ),
    ]);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al procesar el cierre" },
      { status: 500 }
    );
  }
}
