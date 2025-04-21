//@/components/General/utils.tsx
import { Row } from "@tanstack/react-table";
import { Checkin, Usuario, Cliente, Fondo, Sede } from "@/types/interfaces";
import { subtle } from "crypto";

export const initialFormData: Checkin = {
  planilla: 0,
  sello: 0,
  clienteId: 0,
  declarado: 0,
  rutaLlegadaId: 0,
  fechaRegistro: new Date(),
  checkineroId: 0,
  fondoId: 0,
  fondo: undefined,
};

export const globalFilterFn = <T,>(
  row: Row<T>,
  columnId: string,
  filterValue: string
): boolean => {
  const value = row.getValue(columnId);
  const filter = filterValue.toLowerCase();

  // 1. Manejo de valores nulos/undefined
  if (value === null || value === undefined) return false;

  // 2. Manejo de objetos anidados comunes
  if (typeof value === "object") {
    // Para fondos
    if ("nombre" in value && "tipo" in value) {
      const fondo = value as Fondo;
      return fondo.nombre.toLowerCase().includes(filter);
    }

    // Para sedes
    if ("nombre" in value && "direccion" in value) {
      const sede = value as Sede;
      return sede.nombre.toLowerCase().includes(filter);
    }

    // Para usuarios
    if ("name" in value && "email" in value) {
      const usuario = value as Usuario;
      const fullName = `${usuario.name} ${
        usuario.lastname || ""
      }`.toLowerCase();
      return (
        fullName.includes(filter) ||
        usuario.email.toLowerCase().includes(filter)
      );
    }

    // Para clientes (cuando está anidado)
    if ("name" in value && "idCliente" in value) {
      const cliente = value as Cliente;
      return cliente.name.toLowerCase().includes(filter);
    }
  }

  // 3. Manejo de fechas
  if (value instanceof Date) {
    return value.toLocaleString().toLowerCase().includes(filter);
  }

  // 4. Manejo de números (incluyendo formato monetario)
  if (typeof value === "number") {
    return (
      value.toString().includes(filterValue) ||
      new Intl.NumberFormat().format(value).includes(filterValue)
    );
  }

  // 5. Valor por defecto (strings y otros)
  return value.toString().toLowerCase().includes(filter);
};

// Función para resaltar coincidencias
export const highlightMatch = (text: string, filterValue: string) => {
  if (!filterValue) return text;

  const regex = new RegExp(`(${filterValue})`, "gi");
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: "#0891b2", color: "#000" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

export async function hashPassword(password: string): Promise<string> {
  // Usamos el API Web Crypto para mayor seguridad
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
