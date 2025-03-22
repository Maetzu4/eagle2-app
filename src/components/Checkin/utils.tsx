import { Row } from "@tanstack/react-table";
import { Checkin, Usuario, Cliente, Fondo } from "@/types/checkin";

// Función de filtrado global
export const globalFilterFn = (
  row: Row<Checkin>,
  columnId: string,
  filterValue: string
): boolean => {
  const visibleFields = [
    "planilla",
    "sello",
    "declarado",
    "rutaLlegadaId",
    "fechaRegistro",
    "checkinero",
    "clientes",
    "fondo",
  ];

  return visibleFields.some((field) => {
    const value = row.original[field as keyof Checkin];

    if (field === "checkinero") {
      const checkinero: Usuario = value as Usuario;
      const fullName = `${checkinero.name} ${checkinero.lastname}`;
      return fullName.toLowerCase().includes(filterValue.toLowerCase());
    }

    if (field === "clientes") {
      const cliente: Cliente = value as Cliente;
      return cliente.name.toLowerCase().includes(filterValue.toLowerCase());
    }

    if (field === "fondo") {
      const fondo: Fondo = value as Fondo;
      return fondo.nombre.toLowerCase().includes(filterValue.toLowerCase());
    }

    if (field === "fechaRegistro") {
      if (value instanceof Date) {
        return value
          .toLocaleString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      if (typeof value === "string") {
        const date = new Date(value);
        return date
          .toLocaleString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }
      return false;
    }

    if (field === "declarado") {
      const declarado = parseFloat(value?.toString() || "0");
      const formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(declarado);
      return formatted.toLowerCase().includes(filterValue.toLowerCase());
    }

    return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
  });
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
