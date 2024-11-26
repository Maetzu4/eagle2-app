/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Parsear los datos recibidos
    const data = await req.json();
    console.log("Datos recibidos:", data);

    // Validar campos obligatorios
    if (!data.userId || !data.clienteId) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Preparar los datos para guardar
    const checkinData = {
      num_factura: data.num_factura || null,
      sello: data.sello || null,
      valor_declarado: data.valor_declarado || null,
      ruta_llegada: data.ruta_llegada || null,
      userId: data.userId,
      clienteId: data.clienteId,
    };

    // Guardar en la base de datos
    const newCheckin = await prisma.checkin.create({
      data: checkinData,
    });

    // Responder con los datos guardados
    return NextResponse.json(newCheckin, { status: 201 });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);

    // Responder con un error
    return NextResponse.json(
      {
        message: "Error al guardar el check-in",
        //error: error.message,
      },
      { status: 500 }
    );
  }
}


// Obtener todos los registros
export async function GET() {
  try {
    const checkins = await prisma.checkin.findMany({
      include: {
        user: true,
        cliente: true,
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
  const { id, ...data } = await req.json();
  try {
    const updatedCheckin = await prisma.checkin.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedCheckin, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el check-in" },
      { status: 500 }
    );
  }
}

// Eliminar un registro
export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    await prisma.checkin.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Check-in eliminado" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el check-in" },
      { status: 500 }
    );
  }
}
