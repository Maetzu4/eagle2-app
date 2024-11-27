
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // Asegúrate de tener prisma en la carpeta lib

export async function GET() {
  try {
    const fondos = await prisma.fondo.findMany({
      select: {
        idFondo: true,
        nombre: true,
        clientes: true,
      },
    });

    return NextResponse.json(fondos);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json({ error: "Error al obtener los clientes" }, { status: 500 });
  }
}