// app/api/checkins/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Checkin } from "@/types/checkin";

// Actualizar un check-in
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Obtener el ID de la URL
    const data: Checkin = await req.json();

    console.log("Datos recibidos:", data); // Depuración: Verificar los datos recibidos

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

    // Actualizar el check-in
    const updatedCheckin = await prisma.checkin.update({
      where: { idCheckin: parseInt(id, 10) }, // Convertir el ID a número
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
