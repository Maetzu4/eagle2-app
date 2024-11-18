import { NextResponse } from "next/server";
import { query } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Leer el cuerpo de la solicitud
    const { usuario, contrasena } = body;

    if (!usuario || !contrasena) {
      return NextResponse.json(
        { message: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const sql = "SELECT rol FROM usuario WHERE nombre_usuario = ? AND password1 = ?";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = await query({ query: sql, values: [usuario, contrasena] });

    if (results.length === 0) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
    }

    const { rol } = results[0];

    // Enviar respuesta con el rol del usuario
    return NextResponse.json({ area: rol });
  } catch (error) {
    console.error("Error en la API de login:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
