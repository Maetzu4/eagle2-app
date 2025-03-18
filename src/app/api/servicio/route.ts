// app/api/servicio/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Crear un nuevo servicio
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

// Obtener todos los servicios
export async function GET() {
  try {
    const servicios = await prisma.servicio.findMany({
      select: {
        idServicio: true,
        planilla: true,
        sello: true,
        estado: true, // Asegúrate de incluir esta propiedad
        fecharegistro: true,
        Sum_B: true,
        B_100000: true,
        B_50000: true,
        B_20000: true,
        B_10000: true,
        B_5000: true,
        B_2000: true,
        fondoId: true,
        fondo: true, // Si necesitas la relación con Fondo
      },
    });
    return NextResponse.json(servicios);
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    return NextResponse.json(
      { error: "Error al obtener los servicios" },
      { status: 500 }
    );
  }
}

// Actualizar un servicio
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      idServicio,
      planilla,
      sello,
      estado,
      fecharegistro,
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
    } = body;

    // Validar el ID del servicio
    if (!idServicio) {
      return NextResponse.json(
        { error: "El ID del servicio es requerido" },
        { status: 400 }
      );
    }

    // Verificar si el servicio existe
    const servicioExists = await prisma.servicio.findUnique({
      where: { idServicio },
    });
    if (!servicioExists) {
      return NextResponse.json(
        { error: "El servicio no existe" },
        { status: 404 }
      );
    }

    // Actualizar el servicio
    const updatedServicio = await prisma.servicio.update({
      where: { idServicio },
      data: {
        planilla,
        sello,
        estado,
        fecharegistro: new Date(fecharegistro),
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
        clienteId,
        fondoId,
        operarioId,
      },
    });

    return NextResponse.json(updatedServicio, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar el servicio",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
