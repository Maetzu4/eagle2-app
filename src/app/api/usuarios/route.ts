import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Asegúrate de tener prisma en la carpeta lib

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        idUsuario: true,
        name: true,
        lastname: true,
        email: true,
        status: true,
        //roles
        role: true,
        checkinero: true,
        operario: true,
        digitador: true,

        Sede: true,
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener los clientes" },
      { status: 500 }
    );
  }
}
