// @/app/api/checkins/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Checkin } from "@/types/interfaces";

// Obtener todos los check-ins o buscar por planilla
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const planilla = url.searchParams.get("planilla");

    if (planilla) {
      console.log("Buscando checkin con planilla:", planilla); // Log para depuración
      const checkin = await prisma.checkin.findFirst({
        where: { planilla: parseInt(planilla, 10) },
        include: {
          clientes: true,
          fondo: true,
          checkinero: true,
          rutaLlegada: true,
          servicio: true,
        },
      });

      if (!checkin) {
        console.log("Checkin no encontrado para planilla:", planilla); // Log para depuración
        return NextResponse.json(
          { error: "Checkin no encontrado" },
          { status: 404 }
        );
      }

      console.log("Checkin encontrado:", checkin); // Log para depuración
      return NextResponse.json(checkin, { status: 200 });
    }

    // Obtener todos los check-ins
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
    console.error("Error al obtener los check-ins:", error);
    return NextResponse.json(
      { error: "Error al obtener los check-ins" },
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

// Eliminar múltiples check-ins
export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json(); // Obtener los IDs del cuerpo de la solicitud

    // Validar que se enviaron IDs
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Se requiere una lista de IDs válida" },
        { status: 400 }
      );
    }

    // Verificar si los checkins existen y si tienen servicios relacionados
    const checkins = await prisma.checkin.findMany({
      where: { idCheckin: { in: ids } },
      include: { servicio: true },
    });

    // Verificar si alguno de los checkins tiene un servicio relacionado
    const checkinsConServicio = checkins.filter(
      (checkin) => checkin.servicio !== null
    );

    if (checkinsConServicio.length > 0) {
      return NextResponse.json(
        {
          error:
            "No se pueden eliminar los check-ins porque algunos tienen servicios relacionados",
          checkinsConServicio: checkinsConServicio.map((c) => c.idCheckin),
        },
        { status: 400 }
      );
    }

    // Eliminar los check-ins
    const deletedCheckins = await prisma.checkin.deleteMany({
      where: { idCheckin: { in: ids } },
    });

    return NextResponse.json(deletedCheckins, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar los check-ins:", error);

    // Manejar errores de integridad referencial
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "No se pueden eliminar los check-ins porque tienen registros relacionados",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar los check-ins" },
      { status: 500 }
    );
  }
}
