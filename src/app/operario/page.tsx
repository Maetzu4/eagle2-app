"use client";

import React, { useState } from "react";

export default function IngresoFactura() {
  const [formData, setFormData] = useState({
    numeroPlanilla: "",
    nombreCliente: "",
    sello: "",
    valorDeclarado: 0,
    billetes: {
      "100000": 0,
      "50000": 0,
      "20000": 0,
      "10000": 0,
      "5000": 0,
      "2000": 0,
    },
    total: 0,
    observacion: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("billete")) {
      const denominacion = name.split("_")[1]; // Extraer denominación
      const cantidad = parseInt(value, 10) || 0;

      setFormData((prev) => {
        const updatedBilletes = { ...prev.billetes, [denominacion]: cantidad };
        const newTotal = Object.entries(updatedBilletes).reduce(
          (acc, [denom, count]) => acc + parseInt(denom) * count,
          0
        );
        return { ...prev, billetes: updatedBilletes, total: newTotal };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Lógica para enviar datos al backend
  };

  const handleCerrarConteo = () => {
    console.log("Cerrando conteo...");
    // Lógica para manejar el cierre de conteo
  };

  return (
    <div>
      <header className="bg-gray-800 text-white py-4 text-center">
        <h1 className="text-xl font-bold">Ingreso de Factura por Operario</h1>
      </header>

      <nav className="bg-gray-600 text-white py-2 sticky top-0 z-50">
        <ul className="flex justify-end space-x-4 pr-4">
          <li><a href="#" className="hover:underline">Inicio</a></li>
          <li><a href="#" className="hover:underline">Acerca de</a></li>
          <li><a href="#" className="hover:underline">Servicios</a></li>
          <li><a href="/logout" className="hover:underline">Cerrar Sesión</a></li>
        </ul>
      </nav>

      <main className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="numeroPlanilla" className="block font-bold mb-2">Número de Planilla:</label>
            <input
              type="text"
              id="numeroPlanilla"
              name="numeroPlanilla"
              className="border p-2 w-full"
              value={formData.numeroPlanilla}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="nombreCliente" className="block font-bold mb-2">Nombre del Cliente:</label>
            <input
              type="text"
              id="nombreCliente"
              name="nombreCliente"
              className="border p-2 w-full"
              value={formData.nombreCliente}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sello" className="block font-bold mb-2">Sello de la Factura:</label>
            <input
              type="text"
              id="sello"
              name="sello"
              className="border p-2 w-full"
              value={formData.sello}
              readOnly
            />
          </div>

          <div className="mb-4">
            <label htmlFor="valorDeclarado" className="block font-bold mb-2">Valor Declarado:</label>
            <input
              type="number"
              id="valorDeclarado"
              name="valorDeclarado"
              className="border p-2 w-full"
              value={formData.valorDeclarado}
              readOnly
            />
          </div>

          <h3 className="text-lg font-bold mt-6">Cantidad de Billetes por Denominación</h3>
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Denominación</th>
                <th className="border border-gray-300 px-4 py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(formData.billetes).map((denom) => (
                <tr key={denom}>
                  <td className="border border-gray-300 px-4 py-2">${parseInt(denom).toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      name={`billete_${denom}`}
                      className="border p-1 w-full"
                      value={formData.billetes[denom]}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-bold">Total</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input type="text" value={formData.total} readOnly className="border p-1 w-full" />
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-6">
            <label htmlFor="observacion" className="block font-bold mb-2">Observación:</label>
            <textarea
              id="observacion"
              name="observacion"
              className="border p-2 w-full"
              value={formData.observacion}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Guardar Información
            </button>
            <button type="button" className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600" onClick={handleCerrarConteo}>
              Cerrar Conteo
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
