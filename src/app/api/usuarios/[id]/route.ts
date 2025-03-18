// app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de usuario no válido" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: id },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}
