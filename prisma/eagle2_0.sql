-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-11-2024 a las 00:01:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `eagle2_0`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `checkin`
--

CREATE TABLE `checkin` (
  `idCheckin` int(11) NOT NULL,
  `planilla` int(11) NOT NULL,
  `sello` int(11) NOT NULL,
  `clienteId` int(11) NOT NULL,
  `declarado` int(11) NOT NULL,
  `ruta_llegada` int(11) NOT NULL,
  `fechaRegistro` datetime(3) NOT NULL,
  `checkineroId` int(11) NOT NULL,
  `fondoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `checkin`
--

INSERT INTO `checkin` (`idCheckin`, `planilla`, `sello`, `clienteId`, `declarado`, `ruta_llegada`, `fechaRegistro`, `checkineroId`, `fondoId`) VALUES
(1, 1111, 1100, 1, 10000000, 2, '1970-01-01 00:00:00.000', 1, 1),
(2, 2222, 2200, 1, 2000000, 2, '2024-11-27 04:25:50.555', 1, 1),
(4, 4444, 4400, 4, 50000000, 15, '2024-11-27 21:06:34.989', 1, 3),
(5, 3333, 3300, 4, 6000000, 12, '2024-11-27 21:10:56.902', 1, 3),
(6, 66666, 5500, 3, 3000000, 7, '2024-11-27 22:45:15.431', 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `checkinero`
--

CREATE TABLE `checkinero` (
  `idCheckinero` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `checkinero`
--

INSERT INTO `checkinero` (`idCheckinero`, `usuario_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `idCliente` int(11) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `sede` varchar(191) NOT NULL,
  `fondoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`idCliente`, `name`, `sede`, `fondoId`) VALUES
(1, 'Banco_bogota', 'Calle_72', 1),
(2, 'Banco_Occidente', 'Norte_51B', 1),
(3, 'Colpatria_portal', 'Portal_Del_Prado', 2),
(4, 'Tiendas_Ara', 'La_Victoria', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `digitador`
--

CREATE TABLE `digitador` (
  `idDigitador` int(11) NOT NULL,
  `fecha_cierre` datetime(3) NOT NULL,
  `revisado` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `digitador`
--

INSERT INTO `digitador` (`idDigitador`, `fecha_cierre`, `revisado`, `usuario_id`) VALUES
(1, '1970-01-01 00:00:00.000', 0, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fecha_cierre`
--

CREATE TABLE `fecha_cierre` (
  `idFechaCierre` int(11) NOT NULL,
  `planilla` int(11) NOT NULL,
  `fecha_a_cerrar` datetime(3) NOT NULL,
  `digitadorId` int(11) NOT NULL,
  `fondoId` int(11) NOT NULL,
  `servicioId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fondo`
--

CREATE TABLE `fondo` (
  `idFondo` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `tipo` enum('Publico','Privado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `fondo`
--

INSERT INTO `fondo` (`idFondo`, `nombre`, `tipo`) VALUES
(1, 'Grupo_Aval', 'Privado'),
(2, 'AXXA', 'Privado'),
(3, 'JRM', 'Privado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `operario`
--

CREATE TABLE `operario` (
  `idOperario` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `operario`
--

INSERT INTO `operario` (`idOperario`, `usuario_id`) VALUES
(1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `idServicio` int(11) NOT NULL,
  `planilla` int(11) NOT NULL,
  `sello` int(11) NOT NULL,
  `fecharegistro` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `B_100000` int(11) DEFAULT NULL,
  `B_50000` int(11) DEFAULT NULL,
  `B_20000` int(11) DEFAULT NULL,
  `B_10000` int(11) DEFAULT NULL,
  `B_5000` int(11) DEFAULT NULL,
  `B_2000` int(11) DEFAULT NULL,
  `Sum_B` int(11) NOT NULL,
  `clienteId` int(11) NOT NULL,
  `checkin_id` int(11) NOT NULL,
  `checkineroId` int(11) NOT NULL,
  `fondoId` int(11) NOT NULL,
  `operarioId` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL,
  `diferencia` int(11) NOT NULL,
  `observacion` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`idServicio`, `planilla`, `sello`, `fecharegistro`, `B_100000`, `B_50000`, `B_20000`, `B_10000`, `B_5000`, `B_2000`, `Sum_B`, `clienteId`, `checkin_id`, `checkineroId`, `fondoId`, `operarioId`, `estado`, `diferencia`, `observacion`) VALUES
(1, 1111, 1100, '2024-11-27 16:41:42.805', 50, 45, 88, 40, 100, 400, 10710000, 1, 1, 1, 1, 1, 'Inactivo', 710000, 'hola'),
(3, 4444, 4400, '2024-11-27 21:07:48.218', 200, 400, 500, 1, 1, 3, 50021000, 4, 4, 1, 3, 1, 'Inactivo', 21000, 'Sobrante 21000'),
(4, 3333, 3300, '2024-11-27 21:11:31.864', 40, 39, 0, 2, 1, 2, 5979000, 4, 5, 1, 3, 1, 'Inactivo', -21000, 'Faltante -21000'),
(5, 66666, 5500, '2024-11-27 22:45:53.504', 20, 5, 40, 2, 0, 0, 3070000, 3, 6, 1, 2, 1, 'Inactivo', 70000, 'Diferencia a favor de 70000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `lastname` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `status` enum('Activo','Inactivo') NOT NULL,
  `role` enum('checkinero','digitador','operario') NOT NULL,
  `Sede` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `name`, `lastname`, `email`, `password`, `status`, `role`, `Sede`, `createdAt`, `updatedAt`) VALUES
(1, 'Maikol', 'Castro', 'checkinero@mail.com', '1234', 'Activo', 'checkinero', 'Barranquilla', '2024-11-27 04:21:03.922', '2024-11-27 04:21:03.922'),
(2, 'Nathan', 'Olmos', 'operario@mail.com', '1234', 'Activo', 'operario', 'Barranquilla', '2024-11-27 04:21:43.537', '2024-11-27 04:21:43.537'),
(3, 'Jhonathan', 'Gomez', 'digitador@mail.com', '1234', 'Activo', 'digitador', 'Barranquilla', '2024-11-27 17:38:13.689', '2024-11-27 17:38:13.689');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('e87d779c-cdfe-47aa-9d47-67c1ab74fb09', '61327b8211cfb04858edc8d8dea7e7ad3665fb459be2224268dcc1264888e397', '2024-11-27 04:19:40.391', '20241127041938_first', NULL, NULL, '2024-11-27 04:19:38.844', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `checkin`
--
ALTER TABLE `checkin`
  ADD PRIMARY KEY (`idCheckin`),
  ADD KEY `checkin_clienteId_fkey` (`clienteId`),
  ADD KEY `checkin_checkineroId_fkey` (`checkineroId`),
  ADD KEY `checkin_fondoId_fkey` (`fondoId`);

--
-- Indices de la tabla `checkinero`
--
ALTER TABLE `checkinero`
  ADD PRIMARY KEY (`idCheckinero`),
  ADD UNIQUE KEY `checkinero_usuario_id_key` (`usuario_id`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idCliente`),
  ADD KEY `cliente_fondoId_fkey` (`fondoId`);

--
-- Indices de la tabla `digitador`
--
ALTER TABLE `digitador`
  ADD PRIMARY KEY (`idDigitador`),
  ADD UNIQUE KEY `digitador_usuario_id_key` (`usuario_id`);

--
-- Indices de la tabla `fecha_cierre`
--
ALTER TABLE `fecha_cierre`
  ADD PRIMARY KEY (`idFechaCierre`),
  ADD UNIQUE KEY `fecha_cierre_servicioId_key` (`servicioId`),
  ADD KEY `fecha_cierre_digitadorId_fkey` (`digitadorId`),
  ADD KEY `fecha_cierre_fondoId_fkey` (`fondoId`);

--
-- Indices de la tabla `fondo`
--
ALTER TABLE `fondo`
  ADD PRIMARY KEY (`idFondo`);

--
-- Indices de la tabla `operario`
--
ALTER TABLE `operario`
  ADD PRIMARY KEY (`idOperario`),
  ADD UNIQUE KEY `operario_usuario_id_key` (`usuario_id`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`idServicio`),
  ADD UNIQUE KEY `servicio_checkin_id_key` (`checkin_id`),
  ADD KEY `servicio_clienteId_fkey` (`clienteId`),
  ADD KEY `servicio_checkineroId_fkey` (`checkineroId`),
  ADD KEY `servicio_fondoId_fkey` (`fondoId`),
  ADD KEY `servicio_operarioId_fkey` (`operarioId`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `usuario_email_key` (`email`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `checkin`
--
ALTER TABLE `checkin`
  MODIFY `idCheckin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `checkinero`
--
ALTER TABLE `checkinero`
  MODIFY `idCheckinero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `digitador`
--
ALTER TABLE `digitador`
  MODIFY `idDigitador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `fecha_cierre`
--
ALTER TABLE `fecha_cierre`
  MODIFY `idFechaCierre` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fondo`
--
ALTER TABLE `fondo`
  MODIFY `idFondo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `operario`
--
ALTER TABLE `operario`
  MODIFY `idOperario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `idServicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `checkin`
--
ALTER TABLE `checkin`
  ADD CONSTRAINT `checkin_checkineroId_fkey` FOREIGN KEY (`checkineroId`) REFERENCES `checkinero` (`idCheckinero`) ON UPDATE CASCADE,
  ADD CONSTRAINT `checkin_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente` (`idCliente`) ON UPDATE CASCADE,
  ADD CONSTRAINT `checkin_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo` (`idFondo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `checkinero`
--
ALTER TABLE `checkinero`
  ADD CONSTRAINT `checkinero_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo` (`idFondo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `digitador`
--
ALTER TABLE `digitador`
  ADD CONSTRAINT `digitador_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `fecha_cierre`
--
ALTER TABLE `fecha_cierre`
  ADD CONSTRAINT `fecha_cierre_digitadorId_fkey` FOREIGN KEY (`digitadorId`) REFERENCES `digitador` (`idDigitador`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fecha_cierre_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo` (`idFondo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fecha_cierre_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicio` (`idServicio`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `operario`
--
ALTER TABLE `operario`
  ADD CONSTRAINT `operario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `servicio_checkin_id_fkey` FOREIGN KEY (`checkin_id`) REFERENCES `checkin` (`idCheckin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_checkineroId_fkey` FOREIGN KEY (`checkineroId`) REFERENCES `checkinero` (`idCheckinero`) ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente` (`idCliente`) ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_fondoId_fkey` FOREIGN KEY (`fondoId`) REFERENCES `fondo` (`idFondo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_operarioId_fkey` FOREIGN KEY (`operarioId`) REFERENCES `operario` (`idOperario`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
