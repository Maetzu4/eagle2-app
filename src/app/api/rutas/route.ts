// app/api/rutas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rutas = await prisma.rutaLlegada.findMany();
    return NextResponse.json(rutas);
  } catch (error) {
    console.error("Error al obtener las rutas:", error);
    return NextResponse.json(
      { error: "Error al obtener las rutas" },
      { status: 500 }
    );
  }
}
