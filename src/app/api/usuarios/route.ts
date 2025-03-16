import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        idUsuario: true,
        name: true,
        lastname: true,
        email: true,
        status: true,
        role: true, // Usa el campo `role` en lugar de `checkinero`, `operario`, `digitador`
        Sede: true,
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
