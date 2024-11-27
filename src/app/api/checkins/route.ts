/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Parsear los datos recibidos
    const data = await req.json();
    console.log("Datos recibidos:", data);

    // Asegúrate de manejar las relaciones correctamente en Prisma
    const newCheckin = await prisma.checkin.create({
      data: {
        planilla: data.planilla,
        sello: data.sello,
        declarado: data.declarado,
        ruta_llegada: data.ruta_llegada,
        fechaRegistro: new Date(data.fechaRegistro), // Asegúrate de convertir la fecha correctamente
        checkineroId: data.checkineroId,
        fondoId: data.fondoId,
        clienteId: data.clienteID,
      },
    });

    // Responder con los datos guardados
    return NextResponse.json(newCheckin, { status: 201 });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);

    // Responder con un error
    return NextResponse.json(
      {
        message: "Error al guardar el check-in",
      },
      { status: 500 }
    );
  }
}


// Obtener todos los registros
export async function GET() {
  try {
    const checkins = await prisma.checkin.findMany({
      select: {
        idCheckin: true,
        planilla: true,
        sello: true,
        clientes: true,
        declarado: true,
        ruta_llegada: true,
        fechaRegistro: true,
        checkineroId: true,
        checkinero: true,
        fondoId: true,
        fondo: true,
        servicio: true,
      },
    });

    return NextResponse.json(checkins, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los check-ins" },
      { status: 500 }
    );
  }
}

// Actualizar un registro
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { idCheckin, planilla, sello, declarado, ruta_llegada, clienteID, fondoId } = body;

    if (!idCheckin) {
      return NextResponse.json(
        { error: "El ID del check-in es requerido" },
        { status: 400 }
      );
    }

    const updatedCheckin = await prisma.checkin.update({
      where: { idCheckin },
      data: {
        planilla,
        sello,
        declarado,
        ruta_llegada,
        clienteId: clienteID,
        fondoId,
        fechaRegistro: new Date(), // Opcional: actualizar la fecha de registro
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


// Eliminar un registro
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validar que se envió el ID
    if (!id) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }

    // Eliminar el registro de la base de datos
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

