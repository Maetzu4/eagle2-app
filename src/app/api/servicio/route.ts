import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parseamos el cuerpo de la solicitud
    const data = await req.json();

    // Validación de los datos necesarios
    const {
      planilla,
      sello,
      fecharegistro,
      estado,
      observacion,
      B_100000,
      B_50000,
      B_20000,
      B_10000,
      B_5000,
      B_2000,
      Sum_B,
      diferencia,
      checkin_id,
      checkineroId,
      fondoId,
      operarioId,
      clienteId,
    } = data;

    // Validación básica de campos obligatorios
    if (
      !planilla ||
      !sello ||
      !fecharegistro ||
      !checkin_id ||
      !checkineroId ||
      !fondoId ||
      !clienteId ||
      !operarioId
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    // Validar que `fecharegistro` esté en formato correcto (opcional)
    const fechaRegistroValida = new Date(fecharegistro);
    if (isNaN(fechaRegistroValida.getTime())) {
      return NextResponse.json(
        { error: "La fecha de registro no es válida." },
        { status: 400 }
      );
    }

    console.log(data);

    // Crear el registro en la base de datos
    const servicio = await prisma.servicio.create({
      data: {
        planilla,
        sello,
        fecharegistro: fechaRegistroValida,
        estado: estado || "Activo", // Default: 'Activo'
        observacion: observacion || "",
        B_100000: B_100000 || 0,
        B_50000: B_50000 || 0,
        B_20000: B_20000 || 0,
        B_10000: B_10000 || 0,
        B_5000: B_5000 || 0,
        B_2000: B_2000 || 0,
        Sum_B: Sum_B || 0,
        diferencia: diferencia || 0,
        checkin_id,
        checkineroId,
        clienteId,
        fondoId,
        operarioId,
      },
    });

    // Devolver respuesta exitosa
    return NextResponse.json(
      { message: "Servicio creado exitosamente", servicio },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear el servicio:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear el servicio." },
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
        rutaLlegadaId: ruta_llegada, // Cambiado a rutaLlegadaId
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
