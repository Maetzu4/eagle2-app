-- CreateEnum
CREATE TYPE "State" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "Tfondo" AS ENUM ('Publico', 'Privado');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('checkinero', 'digitador', 'operario');

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "State" NOT NULL,
    "role" "Role" NOT NULL,
    "sedeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Sede" (
    "idSede" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,

    CONSTRAINT "Sede_pkey" PRIMARY KEY ("idSede")
);

-- CreateTable
CREATE TABLE "Checkin" (
    "idCheckin" SERIAL NOT NULL,
    "planilla" INTEGER NOT NULL,
    "sello" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "declarado" INTEGER NOT NULL,
    "rutaLlegadaId" INTEGER,
    "fechaRegistro" TIMESTAMP(3) NOT NULL,
    "checkineroId" INTEGER NOT NULL,
    "fondoId" INTEGER NOT NULL,

    CONSTRAINT "Checkin_pkey" PRIMARY KEY ("idCheckin")
);

-- CreateTable
CREATE TABLE "rutas_llegada" (
    "idRutaLlegada" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "rutas_llegada_pkey" PRIMARY KEY ("idRutaLlegada")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "idServicio" SERIAL NOT NULL,
    "planilla" INTEGER NOT NULL,
    "sello" INTEGER NOT NULL,
    "fecharegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "State" NOT NULL,
    "observacion" TEXT NOT NULL,
    "diferencia" INTEGER NOT NULL,
    "B_100000" INTEGER,
    "B_50000" INTEGER,
    "B_20000" INTEGER,
    "B_10000" INTEGER,
    "B_5000" INTEGER,
    "B_2000" INTEGER,
    "Sum_B" INTEGER NOT NULL,
    "fechaCierreId" INTEGER,
    "clienteId" INTEGER NOT NULL,
    "checkin_id" INTEGER NOT NULL,
    "checkineroId" INTEGER NOT NULL,
    "fondoId" INTEGER NOT NULL,
    "operarioId" INTEGER NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("idServicio")
);

-- CreateTable
CREATE TABLE "FechaCierre" (
    "idFechaCierre" SERIAL NOT NULL,
    "fecha_a_cerrar" TIMESTAMP(3) NOT NULL,
    "digitadorId" INTEGER NOT NULL,
    "fondoId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,

    CONSTRAINT "FechaCierre_pkey" PRIMARY KEY ("idFechaCierre")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "idCliente" SERIAL NOT NULL,
    "name" TEXT,
    "sedeId" INTEGER,
    "fondoId" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "Fondo" (
    "idFondo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "Tfondo" NOT NULL,

    CONSTRAINT "Fondo_pkey" PRIMARY KEY ("idFondo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_role_idx" ON "Usuario"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Sede_nombre_key" ON "Sede"("nombre");

-- CreateIndex
CREATE INDEX "Checkin_clienteId_idx" ON "Checkin"("clienteId");

-- CreateIndex
CREATE INDEX "Checkin_checkineroId_idx" ON "Checkin"("checkineroId");

-- CreateIndex
CREATE INDEX "Checkin_fondoId_idx" ON "Checkin"("fondoId");

-- CreateIndex
CREATE INDEX "Checkin_rutaLlegadaId_idx" ON "Checkin"("rutaLlegadaId");

-- CreateIndex
CREATE UNIQUE INDEX "rutas_llegada_nombre_key" ON "rutas_llegada"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Servicio_checkin_id_key" ON "Servicio"("checkin_id");

-- CreateIndex
CREATE INDEX "Servicio_clienteId_idx" ON "Servicio"("clienteId");

-- CreateIndex
CREATE INDEX "Servicio_checkineroId_idx" ON "Servicio"("checkineroId");

-- CreateIndex
CREATE INDEX "Servicio_fondoId_idx" ON "Servicio"("fondoId");

-- CreateIndex
CREATE INDEX "Servicio_operarioId_idx" ON "Servicio"("operarioId");

-- CreateIndex
CREATE UNIQUE INDEX "FechaCierre_servicioId_key" ON "FechaCierre"("servicioId");

-- CreateIndex
CREATE INDEX "FechaCierre_servicioId_idx" ON "FechaCierre"("servicioId");

-- CreateIndex
CREATE INDEX "FechaCierre_fondoId_idx" ON "FechaCierre"("fondoId");

-- CreateIndex
CREATE INDEX "Cliente_fondoId_idx" ON "Cliente"("fondoId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("idSede") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_checkineroId_fkey" FOREIGN KEY ("checkineroId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "Fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_rutaLlegadaId_fkey" FOREIGN KEY ("rutaLlegadaId") REFERENCES "rutas_llegada"("idRutaLlegada") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_checkin_id_fkey" FOREIGN KEY ("checkin_id") REFERENCES "Checkin"("idCheckin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_checkineroId_fkey" FOREIGN KEY ("checkineroId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "Fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_operarioId_fkey" FOREIGN KEY ("operarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FechaCierre" ADD CONSTRAINT "FechaCierre_digitadorId_fkey" FOREIGN KEY ("digitadorId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FechaCierre" ADD CONSTRAINT "FechaCierre_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "Fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FechaCierre" ADD CONSTRAINT "FechaCierre_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("idServicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "Fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "Sede"("idSede") ON DELETE SET NULL ON UPDATE CASCADE;
