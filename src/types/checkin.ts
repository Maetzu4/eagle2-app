// src/types/checkin.ts

// Interfaz para el cliente
export interface Cliente {
  idCliente: number;
  name: string;
  sede: string;
  fondoId: number;
  fondo: Fondo;
  checkin_id: number;
}

// Interfaz Fondo
export interface Fondo {
  idFondo: number;
  nombre: string;
  tipo: "Publico" | "Privado";
  clientes: Cliente[];
  checkins: Checkin[];
  servicios: Servicio[];
  fecha_de_cierre: FechaCierre[];
}

//interface fechacierre
export interface FechaCierre {
  idFechaCierre: number; // @id @default(autoincrement())
  fecha_a_cerrar: Date; // DateTime
  digitadorId: number; // Int
  digitador: Usuario; // Relación con Usuario
  fondoId: number; // Int
  fondo: Fondo; // Relación con Fondo
  servicioId: number; // Int @unique
  servicio: Servicio; // Relación con Servicio
}

// Interfaz para el checkinero
export interface Checkinero {
  idCheckinero: number;
  usuario_id: number;
}

// Interfaz para el servicio
export interface Servicio {
  idServicio: number;
  planilla: number;
  sello: number;
  estado: "Activo" | "Inactivo"; // Añade esta propiedad
  fecharegistro: Date;
  Sum_B: number;
  B_100000: number;
  B_50000: number;
  B_20000: number;
  B_10000: number;
  B_5000: number;
  B_2000: number;
  checkin_id: number;
  checkineroId: number;
  fondoId: number;
  operarioId: number;
}

// Interfaz para el check-in
export interface Checkin {
  idCheckin?: number;
  planilla: number;
  sello: number;
  clienteID: number;
  clientes: Cliente;
  declarado: number;
  ruta_llegada: number;
  fechaRegistro: Date;
  checkineroId: number;
  checkinero: Checkinero;
  fondoId: number;
  fondo: Fondo;
  servicio: Servicio;
}

// Interfaz para el usuario
export interface Usuario {
  idUsuario: number;
  name: string;
  lastname: string;
  email: string;
  status: string;
  role: string;
  checkinero: Checkinero;
  operario: {
    idOperario: number;
    usuario_id: number;
  };
  digitador: {
    idDigitador: number;
    usuario_id: number;
  };
  Sede: string;
}

//esto es para las sessiones
export interface user {
  id: string;
  name: string;
  role: string;
  email: string;
}

//interface de rutas de llegada
export interface RutaLlegada {
  idRutaLlegada: number;
  nombre: string;
  descripcion?: string;
}
