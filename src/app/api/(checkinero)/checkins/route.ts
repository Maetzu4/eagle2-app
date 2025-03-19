import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Checkin } from "@/types/checkin";

// Obtener todos los check-ins
export async function GET() {
  try {
    const checkins = await prisma.checkin.findMany({
      include: {
        clientes: true,
        fondo: true,
        checkinero: true,
        rutaLlegada: true,
        servicio: true,
      },
    });
    return NextResponse.json(checkins, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los check-ins" + error },
      { status: 500 }
    );
  }
}

// Crear un nuevo check-in
export async function POST(req: Request) {
  try {
    const data: Checkin = await req.json();

    // Validar campos requeridos
    if (
      !data.planilla ||
      !data.sello ||
      !data.declarado ||
      !data.rutaLlegadaId ||
      !data.fechaRegistro ||
      !data.checkineroId ||
      !data.fondoId ||
      !data.clienteId
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Crear el check-in
    const newCheckin = await prisma.checkin.create({
      data: {
        planilla: data.planilla,
        sello: data.sello,
        declarado: data.declarado,
        rutaLlegadaId: data.rutaLlegadaId,
        fechaRegistro: new Date(data.fechaRegistro),
        checkineroId: data.checkineroId,
        fondoId: data.fondoId,
        clienteId: data.clienteId,
      },
    });

    return NextResponse.json(newCheckin, { status: 201 });
  } catch (error) {
    console.error("Error al crear el check-in:", error);
    return NextResponse.json(
      { error: "Error al crear el check-in" },
      { status: 500 }
    );
  }
}

// Actualizar un check-in
export async function PUT(req: Request) {
  try {
    const data: Checkin = await req.json();

    // Validar campos requeridos
    if (
      !data.idCheckin ||
      !data.planilla ||
      !data.sello ||
      !data.declarado ||
      !data.rutaLlegadaId ||
      !data.fechaRegistro ||
      !data.checkineroId ||
      !data.fondoId ||
      !data.clienteId
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Actualizar el check-in
    const updatedCheckin = await prisma.checkin.update({
      where: { idCheckin: data.idCheckin },
      data: {
        planilla: data.planilla,
        sello: data.sello,
        declarado: data.declarado,
        rutaLlegadaId: data.rutaLlegadaId,
        fechaRegistro: new Date(data.fechaRegistro),
        checkineroId: data.checkineroId,
        fondoId: data.fondoId,
        clienteId: data.clienteId,
      },
    });

    return NextResponse.json(updatedCheckin, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el check-in:", error);
    return NextResponse.json(
      { error: "Error al actualizar el check-in" },
      { status: 500 }
    );
  }
}

// Eliminar un check-in
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validar que se envió el ID
    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }

    // Eliminar el check-in
    const deletedCheckin = await prisma.checkin.delete({
      where: { idCheckin: id },
    });

    return NextResponse.json(deletedCheckin, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el check-in:", error);
    return NextResponse.json(
      { error: "Error al eliminar el check-in" },
      { status: 500 }
    );
  }
}
