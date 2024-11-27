/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const planilla = parseInt(url.searchParams.get("planilla") || "0", 10);

    if (!planilla) {
      return NextResponse.json(
        { error: "El parámetro 'planilla' es requerido" },
        { status: 400 }
      );
    }

    const checkin = await prisma.checkin.findFirst({
      where: { planilla },
      include: {
        clientes: true,
        fondo: true,
        checkinero: true,
        servicio: true,
      },
    });

    if (!checkin) {
      return NextResponse.json(
        { error: "Checkin no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(checkin, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener los check-ins" },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    const { planilla } = await req.json();

    const checkin = await prisma.checkin.findFirst({
      where: { planilla },
    });

    return NextResponse.json(checkin, { status: 200 });
  
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los check-ins" },
      { status: 500 }
    );
  }
}
