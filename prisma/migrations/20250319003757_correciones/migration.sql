/*
  Warnings:

  - You are about to drop the column `fecharegistro` on the `Servicio` table. All the data in the column will be lost.
  - Made the column `rutaLlegadaId` on table `Checkin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Cliente` required. This step will fail if there are existing NULL values in that column.
  - Made the column `direccion` on table `Sede` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'administrador';

-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_rutaLlegadaId_fkey";

-- DropForeignKey
ALTER TABLE "FechaCierre" DROP CONSTRAINT "FechaCierre_servicioId_fkey";

-- AlterTable
ALTER TABLE "Checkin" ALTER COLUMN "rutaLlegadaId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "FechaCierre" ALTER COLUMN "servicioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sede" ALTER COLUMN "direccion" SET NOT NULL;

-- AlterTable
ALTER TABLE "Servicio" DROP COLUMN "fecharegistro",
ADD COLUMN     "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Fondo_tipo_idx" ON "Fondo"("tipo");

-- CreateIndex
CREATE INDEX "Usuario_sedeId_role_idx" ON "Usuario"("sedeId", "role");

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_rutaLlegadaId_fkey" FOREIGN KEY ("rutaLlegadaId") REFERENCES "rutas_llegada"("idRutaLlegada") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FechaCierre" ADD CONSTRAINT "FechaCierre_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("idServicio") ON DELETE SET NULL ON UPDATE CASCADE;
