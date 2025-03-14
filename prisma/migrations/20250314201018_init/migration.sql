-- CreateEnum
CREATE TYPE "State" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "Fondo" AS ENUM ('Publico', 'Privado');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('checkinero', 'digitador', 'operario');

-- CreateTable
CREATE TABLE "usuario" (
    "idUsuario" SERIAL NOT NULL,
    "name" TEXT,
    "lastname" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "State" NOT NULL,
    "role" "Role" NOT NULL,
    "Sede" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "cliente" (
    "idCliente" SERIAL NOT NULL,
    "name" TEXT,
    "sede" TEXT NOT NULL,
    "fondoId" INTEGER NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "checkin" (
    "idCheckin" SERIAL NOT NULL,
    "planilla" INTEGER NOT NULL,
    "sello" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "declarado" INTEGER NOT NULL,
    "ruta_llegada" INTEGER NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL,
    "checkineroId" INTEGER NOT NULL,
    "fondoId" INTEGER NOT NULL,

    CONSTRAINT "checkin_pkey" PRIMARY KEY ("idCheckin")
);

-- CreateTable
CREATE TABLE "servicio" (
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
    "clienteId" INTEGER NOT NULL,
    "checkin_id" INTEGER NOT NULL,
    "checkineroId" INTEGER NOT NULL,
    "fondoId" INTEGER NOT NULL,
    "operarioId" INTEGER NOT NULL,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("idServicio")
);

-- CreateTable
CREATE TABLE "fondo" (
    "idFondo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "Fondo" NOT NULL,

    CONSTRAINT "fondo_pkey" PRIMARY KEY ("idFondo")
);

-- CreateTable
CREATE TABLE "fecha_cierre" (
    "idFechaCierre" SERIAL NOT NULL,
    "planilla" INTEGER NOT NULL,
    "fecha_a_cerrar" TIMESTAMP(3) NOT NULL,
    "digitadorId" INTEGER NOT NULL,
    "fondoId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,

    CONSTRAINT "fecha_cierre_pkey" PRIMARY KEY ("idFechaCierre")
);

-- CreateTable
CREATE TABLE "checkinero" (
    "idCheckinero" SERIAL NOT NULL,
    "usuario_id" INTEGER,

    CONSTRAINT "checkinero_pkey" PRIMARY KEY ("idCheckinero")
);

-- CreateTable
CREATE TABLE "operario" (
    "idOperario" SERIAL NOT NULL,
    "usuario_id" INTEGER,

    CONSTRAINT "operario_pkey" PRIMARY KEY ("idOperario")
);

-- CreateTable
CREATE TABLE "digitador" (
    "idDigitador" SERIAL NOT NULL,
    "fecha_cierre" TIMESTAMP(3) NOT NULL,
    "revisado" INTEGER NOT NULL,
    "usuario_id" INTEGER,

    CONSTRAINT "digitador_pkey" PRIMARY KEY ("idDigitador")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_checkin_id_key" ON "servicio"("checkin_id");

-- CreateIndex
CREATE UNIQUE INDEX "fecha_cierre_servicioId_key" ON "fecha_cierre"("servicioId");

-- CreateIndex
CREATE UNIQUE INDEX "checkinero_usuario_id_key" ON "checkinero"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "operario_usuario_id_key" ON "operario"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "digitador_usuario_id_key" ON "digitador"("usuario_id");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_checkineroId_fkey" FOREIGN KEY ("checkineroId") REFERENCES "checkinero"("idCheckinero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_checkin_id_fkey" FOREIGN KEY ("checkin_id") REFERENCES "checkin"("idCheckin") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_checkineroId_fkey" FOREIGN KEY ("checkineroId") REFERENCES "checkinero"("idCheckinero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_operarioId_fkey" FOREIGN KEY ("operarioId") REFERENCES "operario"("idOperario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fecha_cierre" ADD CONSTRAINT "fecha_cierre_digitadorId_fkey" FOREIGN KEY ("digitadorId") REFERENCES "digitador"("idDigitador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fecha_cierre" ADD CONSTRAINT "fecha_cierre_fondoId_fkey" FOREIGN KEY ("fondoId") REFERENCES "fondo"("idFondo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fecha_cierre" ADD CONSTRAINT "fecha_cierre_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicio"("idServicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkinero" ADD CONSTRAINT "checkinero_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operario" ADD CONSTRAINT "operario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digitador" ADD CONSTRAINT "digitador_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;
