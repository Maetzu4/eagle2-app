// Importando el paquete mysql2 para la configuración de la base de datos
import { query } from "../../../lib/config";

/**
 * Este código maneja una solicitud GET, ejecutando una consulta a la base de datos para obtener datos de empleados.
 * Utiliza Response para devolver los resultados en formato JSON, asegurando que se incluya el encabezado Content-Type
 * esto para indicar que la respuesta es de tipo JSON, y maneja adecuadamente los errores, proporcionando mensajes claros.
 */


export async function GET() {
  try {
    // Ejecuta una consulta para obtener todos los empleados de la base de datos
    const usuarios = await query({
      query: "SELECT * FROM usuario",
      values: [],
    });

    // Retorna una respuesta en formato JSON con un código de estado 200
    return new Response(JSON.stringify({ usuarios }), {
      status: 200,
      headers: {
        "Content-Type": "application/json", // Especifica que el contenido es JSON
      },
    });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    // Si hay un error, retorna una respuesta JSON con el mensaje de error y un código de estado 500
    return new Response(JSON.stringify({ error: (error as Error).message || "Error al ejecutar la consulta" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json", // Especifica que el contenido es JSON
      },
    });
  }
}


/**
 * Este código utiliza NextResponse el cual es un componente de Next.js, que permite manejar las respuestas en API routes de Next.js,
 * asegurando que las respuestas sean correctamente formateadas como JSON y que se incluyan los códigos de estado HTTP
 * correspondientes adecuados para facilitar el manejo de errores.
 */

/* import { NextResponse } from "next/server";
export async function GET() {
  try {
    // Ejecuta una consulta para obtener todos los empleados de la base de datos
    const usuarios = await query({
      query: "SELECT * FROM usuario",
      values: [],
    });

    // Retorna la respuesta en formato JSON con un código de estado 200 (OK) y los datos de los empleados
    return NextResponse.json({ usuarios }, { status: 200 });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    // Si hay un error, retorna una respuesta JSON con el mensaje de error y un código de estado 500 (Internal Server Error)
    return NextResponse.json({ error: (error as Error).message || "Error al ejecutar la consulta" }, { status: 500 });
  }
} */
