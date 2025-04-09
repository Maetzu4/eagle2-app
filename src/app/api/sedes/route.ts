// src/app/api/sedes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Sede } from "@/types/interfaces";

export async function GET() {
  try {
    const sedes = await prisma.sede.findMany();
    return NextResponse.json(sedes);
  } catch (error) {
    console.error("Error al obtener las sedes:", error);
    return NextResponse.json(
      { error: "Error al obtener las sedes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data: Sede = await req.json();

    if (!data.nombre || !data.direccion) {
      return NextResponse.json(
        { error: "Nombre y dirección son requeridos" },
        { status: 400 }
      );
    }

    const newSede = await prisma.sede.create({
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono || null,
      },
    });

    return NextResponse.json(newSede, { status: 201 });
  } catch (error) {
    console.error("Error al crear la sede:", error);
    return NextResponse.json(
      { error: "Error al crear la sede" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data: Sede = await req.json();

    if (!data.idSede || !data.nombre || !data.direccion) {
      return NextResponse.json(
        { error: "ID, nombre y dirección son requeridos" },
        { status: 400 }
      );
    }

    const updatedSede = await prisma.sede.update({
      where: { idSede: data.idSede },
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono || null,
      },
    });

    return NextResponse.json(updatedSede, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la sede:", error);
    return NextResponse.json(
      { error: "Error al actualizar la sede" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    // Verificar si hay usuarios o clientes asociados
    const usuarios = await prisma.usuario.findMany({
      where: { sedeId: { in: ids } },
    });

    const clientes = await prisma.cliente.findMany({
      where: { sedeId: { in: ids } },
    });

    if (usuarios.length > 0 || clientes.length > 0) {
      return NextResponse.json(
        {
          error:
            "No se pueden eliminar sedes con usuarios o clientes asociados",
          usuarios: usuarios.map((u) => u.idUsuario),
          clientes: clientes.map((c) => c.idCliente),
        },
        { status: 400 }
      );
    }

    await prisma.sede.deleteMany({
      where: { idSede: { in: ids } },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar sedes:", error);
    return NextResponse.json(
      { error: "Error al eliminar sedes" },
      { status: 500 }
    );
  }
}
