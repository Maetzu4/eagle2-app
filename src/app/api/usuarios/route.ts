// pages/api/usuarios/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email"); // Obtener el correo de la query

    if (!email) {
      return NextResponse.json(
        { error: "El correo es requerido" },
        { status: 400 }
      );
    }

    // Buscar el usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
      select: {
        idUsuario: true,
        name: true,
        lastname: true,
        email: true,
        status: true,
        role: true,
        sede: true,
      },
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
