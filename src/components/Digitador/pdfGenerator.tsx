// @/components/Digitador/pdfGenerator.tsx
import { jsPDF } from "jspdf";
import { Servicio, Fondo, Cliente } from "@/types/interfaces";

interface PdfGeneratorProps {
  selectedServices: Servicio[];
  groupBy: "fondo" | "cliente";
  fondos: Fondo[];
  clientes: Cliente[];
}

export const generatePDF = ({
  selectedServices,
  groupBy,
  fondos,
  clientes,
}: PdfGeneratorProps) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const margin = 10;
  let yPosition = margin + 10;

  // Título centrado
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  const titleWidth = doc.getTextWidth("Informe de Servicios Cerrados");
  doc.text(
    "Informe de Servicios Cerrados",
    (doc.internal.pageSize.width - titleWidth) / 2,
    yPosition
  );
  yPosition += 15;

  // Agrupar servicios
  const groupedServices: { [key: string]: Servicio[] } = {};

  if (groupBy === "fondo") {
    selectedServices.forEach((service) => {
      const fondo = fondos.find((f) => f.idFondo === service.fondoId);
      const key = fondo?.nombre || "Sin fondo";
      if (!groupedServices[key]) groupedServices[key] = [];
      groupedServices[key].push(service);
    });
  } else {
    selectedServices.forEach((service) => {
      const cliente = clientes.find((c) => c.idCliente === service.clienteId);
      const key = cliente?.name?.replace("_", " ") || "Sin cliente";
      if (!groupedServices[key]) groupedServices[key] = [];
      groupedServices[key].push(service);
    });
  }

  // Contenido del PDF
  Object.entries(groupedServices).forEach(([groupName, services]) => {
    doc.setFontSize(14);
    doc.text(`Grupo: ${groupName}`, margin, yPosition);
    yPosition += 8;

    // Cabecera de tabla
    const headers = [
      "Planilla",
      "Sello",
      "Total",
      groupBy === "fondo" ? "Cliente" : "Fondo",
    ];
    const columnWidths = [30, 30, 40, 60];

    let xPosition = margin;
    headers.forEach((header, index) => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(header, xPosition, yPosition);
      xPosition += columnWidths[index];
    });

    yPosition += 8;
    doc.setFont("helvetica", "normal");

    // Filas de datos
    services.forEach((service) => {
      xPosition = margin;
      const row = [
        service.planilla.toString(),
        service.sello.toString(),
        `$${service.Sum_B?.toLocaleString("es-CO") || 0}`,
        groupBy === "fondo"
          ? clientes
              .find((c) => c.idCliente === service.clienteId)
              ?.name?.replace("_", " ") || ""
          : fondos.find((f) => f.idFondo === service.fondoId)?.nombre || "",
      ];

      row.forEach((text, index) => {
        doc.setFontSize(10);
        doc.text(text, xPosition, yPosition);
        xPosition += columnWidths[index];
      });

      yPosition += 8;

      // Salto de página si es necesario
      if (yPosition > 190) {
        doc.addPage();
        yPosition = margin;
      }
    });

    yPosition += 12;
  });

  // Pie de página
  const footerText = `Generado por Eagle 2 - ${new Date().toLocaleDateString()}`;
  doc.setFontSize(14);
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(footerText);
  doc.text(footerText, pageWidth - textWidth - margin, 200);

  doc.save("informe-servicios.pdf");
};
