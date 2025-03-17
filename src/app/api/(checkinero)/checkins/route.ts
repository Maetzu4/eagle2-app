/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/(checkinero)/checkins/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Parsear los datos recibidos
    const data = await req.json();
    console.log("Datos recibidos:", data);

    // Validar los datos de entrada
    if (
      !data.planilla ||
      !data.sello ||
      !data.declarado ||
      !data.ruta_llegada ||
      !data.fechaRegistro ||
      !data.checkineroId ||
      !data.fondoId ||
      !data.clienteID
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el checkinero, fondo y cliente existen
    const checkineroExists = await prisma.usuario.findUnique({
      where: { idUsuario: data.checkineroId },
    });
    if (!checkineroExists) {
      return NextResponse.json(
        { error: "El checkinero no existe" },
        { status: 404 }
      );
    }

    const fondoExists = await prisma.fondo.findUnique({
      where: { idFondo: data.fondoId },
    });
    if (!fondoExists) {
      return NextResponse.json(
        { error: "El fondo no existe" },
        { status: 404 }
      );
    }

    const clienteExists = await prisma.cliente.findUnique({
      where: { idCliente: data.clienteID },
    });
    if (!clienteExists) {
      return NextResponse.json(
        { error: "El cliente no existe" },
        { status: 404 }
      );
    }

    // Crear el checkin
    const newCheckin = await prisma.checkin.create({
      data: {
        planilla: data.planilla,
        sello: data.sello,
        declarado: data.declarado,
        rutaLlegadaId: data.ruta_llegada, // Asegúrate de que sea un ID válido
        fechaRegistro: new Date(data.fechaRegistro), // Convertir a fecha
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
        error: error instanceof Error ? error.message : "Error desconocido",
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
        rutaLlegadaId: true,
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
      {
        error: "Error al obtener los check-ins",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// Actualizar un registro
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      idCheckin,
      planilla,
      sello,
      declarado,
      ruta_llegada,
      clienteID,
      fondoId,
    } = body;

    // Validar el ID del check-in
    if (!idCheckin) {
      return NextResponse.json(
        { error: "El ID del check-in es requerido" },
        { status: 400 }
      );
    }

    // Verificar si el check-in existe
    const checkinExists = await prisma.checkin.findUnique({
      where: { idCheckin },
    });
    if (!checkinExists) {
      return NextResponse.json(
        { error: "El check-in no existe" },
        { status: 404 }
      );
    }

    // Actualizar el check-in
    const updatedCheckin = await prisma.checkin.update({
      where: { idCheckin },
      data: {
        planilla,
        sello,
        declarado,
        rutaLlegadaId: ruta_llegada, // Asegúrate de que sea un ID válido
        clienteId: clienteID,
        fondoId,
        fechaRegistro: new Date(), // Opcional: actualizar la fecha de registro
      },
    });

    return NextResponse.json(updatedCheckin, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el check-in:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar el check-in",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
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

    // Verificar si el check-in existe
    const checkinExists = await prisma.checkin.findUnique({
      where: { idCheckin: id },
    });
    if (!checkinExists) {
      return NextResponse.json(
        { error: "El check-in no existe" },
        { status: 404 }
      );
    }

    // Eliminar el registro de la base de datos
    const deletedCheckin = await prisma.checkin.delete({
      where: { idCheckin: id },
    });

    return NextResponse.json(deletedCheckin, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar el check-in:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar el check-in",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
