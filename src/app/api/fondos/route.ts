// app/api/fondos/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // Asegúrate de tener prisma en la carpeta lib

export async function GET() {
  try {
    const fondos = await prisma.fondo.findMany({
      select: {
        idFondo: true,
        nombre: true,
        tipo: true,
        clientes: true,
        checkins: true,
        servicios: true,
        fecha_de_cierre: true,
      }
    });
    return NextResponse.json(fondos);
  } catch (error) {
    console.error("Error al obtener los fondos:", error);
    return NextResponse.json({ error: "Error al obtener los fondos" }, { status: 500 });
  }
}
