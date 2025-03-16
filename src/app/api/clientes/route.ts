import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Asegúrate de tener prisma en la carpeta lib

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        idCliente: true,
        name: true,
        sede: true,
        fondoId: true,
        fondo: true,
        checkin: true,
      },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      {
        error: "Error al obtener los clientes",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
