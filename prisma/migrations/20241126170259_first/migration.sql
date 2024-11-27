-- CreateTable
CREATE TABLE `usuario` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` ENUM('Activo', 'Inactivo') NOT NULL,
    `Sede` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente` (
    `idCliente` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `sede` VARCHAR(191) NOT NULL,
    `fondoId` INTEGER NOT NULL,
    `checkin_id` INTEGER NOT NULL,

    UNIQUE INDEX `cliente_checkin_id_key`(`checkin_id`),
    PRIMARY KEY (`idCliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkin` (
    `idCheckin` INTEGER NOT NULL AUTO_INCREMENT,
    `planilla` INTEGER NOT NULL,
    `sello` INTEGER NOT NULL,
    `declarado` INTEGER NOT NULL,
    `ruta_llegada` INTEGER NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL,
    `checkineroId` INTEGER NOT NULL,
    `fondoId` INTEGER NOT NULL,

    PRIMARY KEY (`idCheckin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio` (
    `idServicio` INTEGER NOT NULL AUTO_INCREMENT,
    `planilla` INTEGER NOT NULL,
    `sello` INTEGER NOT NULL,
    `fecharegistro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `B_100000` INTEGER NULL,
    `B_50000` INTEGER NULL,
    `B_20000` INTEGER NULL,
    `B_10000` INTEGER NULL,
    `B_5000` INTEGER NULL,
    `B_2000` INTEGER NULL,
    `Sum_B` INTEGER NOT NULL,
    `checkin_id` INTEGER NOT NULL,
    `checkineroId` INTEGER NOT NULL,
    `fondoId` INTEGER NOT NULL,
    `operarioId` INTEGER NOT NULL,

    UNIQUE INDEX `servicio_checkin_id_key`(`checkin_id`),
    PRIMARY KEY (`idServicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fondo` (
    `idFondo` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('Publico', 'Privado') NOT NULL,

    PRIMARY KEY (`idFondo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fecha_cierre` (
    `idFechaCierre` INTEGER NOT NULL AUTO_INCREMENT,
    `planilla` INTEGER NOT NULL,
    `fecha_a_cerrar` DATETIME(3) NOT NULL,
    `digitadorId` INTEGER NOT NULL,
    `fondoId` INTEGER NOT NULL,
    `servicioId` INTEGER NOT NULL,

    UNIQUE INDEX `fecha_cierre_servicioId_key`(`servicioId`),
    PRIMARY KEY (`idFechaCierre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checkinero` (
    `idCheckinero` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NULL,

    UNIQUE INDEX `checkinero_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`idCheckinero`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operario` (
    `idOperario` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NULL,

    UNIQUE INDEX `operario_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`idOperario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `digitador` (
    `idDigitador` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha_cierre` DATETIME(3) NOT NULL,
    `revisado` INTEGER NOT NULL,
    `usuario_id` INTEGER NULL,

    UNIQUE INDEX `digitador_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`idDigitador`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cliente` ADD CONSTRAINT `cliente_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo`(`idFondo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cliente` ADD CONSTRAINT `cliente_checkin_id_fkey` FOREIGN KEY (`checkin_id`) REFERENCES `checkin`(`idCheckin`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_checkineroId_fkey` FOREIGN KEY (`checkineroId`) REFERENCES `checkinero`(`idCheckinero`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo`(`idFondo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_checkin_id_fkey` FOREIGN KEY (`checkin_id`) REFERENCES `checkin`(`idCheckin`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_checkineroId_fkey` FOREIGN KEY (`checkineroId`) REFERENCES `checkinero`(`idCheckinero`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo`(`idFondo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_operarioId_fkey` FOREIGN KEY (`operarioId`) REFERENCES `operario`(`idOperario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fecha_cierre` ADD CONSTRAINT `fecha_cierre_digitadorId_fkey` FOREIGN KEY (`digitadorId`) REFERENCES `digitador`(`idDigitador`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fecha_cierre` ADD CONSTRAINT `fecha_cierre_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo`(`idFondo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fecha_cierre` ADD CONSTRAINT `fecha_cierre_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicio`(`idServicio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkinero` ADD CONSTRAINT `checkinero_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operario` ADD CONSTRAINT `operario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digitador` ADD CONSTRAINT `digitador_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;
