
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";  // Asegúrate de tener prisma en la carpeta lib

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nom_cliente: true,
      },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json({ error: "Error al obtener los clientes" }, { status: 500 });
  }
}