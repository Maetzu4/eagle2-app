// @/types/interfaces.ts

// Interfaz para el cliente
export interface Cliente {
  sede: Sede;
  idCliente: number;
  name: string;
  sedeId: number; // Relación con Sede
  fondoId: number; // Relación con Fondo
  fondo: Fondo;
  checkins: Checkin[];
  servicios: Servicio[];
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

// Interfaz para la fecha de cierre
export interface FechaCierre {
  idFechaCierre: number;
  fecha_a_cerrar: Date;
  digitadorId: number;
  digitador: Usuario;
  fondoId: number;
  fondo: Fondo;
  servicioId: number;
  servicio: Servicio;
}

// Interfaz para el servicio
export interface Servicio {
  idServicio?: number;
  planilla: number;
  observacion: string;
  sello: number;
  estado: "Activo" | "Inactivo";
  diferencia: number;
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
  clienteId: number;
  cliente?: Cliente;
}

// Interfaz para el check-in
export interface Checkin {
  idCheckin?: number;
  planilla: number;
  sello: number;
  clienteId: number; // Relación con Cliente
  clientes?: Cliente;
  declarado: number;
  rutaLlegadaId: number; // Relación con RutaLlegada
  rutaLlegada?: RutaLlegada;
  fechaRegistro: Date;
  checkineroId: number; // Relación con Usuario
  checkinero?: Usuario;
  fondoId: number; // Relación con Fondo
  fondo?: Fondo;
  servicio?: Servicio;
}

// Interfaz para el usuario
export interface Usuario {
  idUsuario: number;
  name: string;
  lastname: string;
  email: string;
  status: "Activo" | "Inactivo";
  role: "checkinero" | "digitador" | "operario" | "administrador";
  sedeId: number; // Relación con Sede
  checkins: Checkin[];
  servicios: Servicio[];
  fechaCierres: FechaCierre[];
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para las sesiones
export interface user {
  id: number;
  name: string;
  role: string;
  email: string;
}

// Interfaz para las rutas de llegada
export interface RutaLlegada {
  idRutaLlegada: number;
  nombre: string;
  descripcion?: string;
  checkins: Checkin[];
}

//interface para sede
export interface Sede {
  idSede: number; // Identificador único de la sede
  nombre: string; // Nombre de la sede
  direccion: string; // Dirección de la sede
  telefono?: string; // Teléfono de la sede (opcional)
  usuarios: Usuario[]; // Lista de usuarios asociados a la sede
  clientes: Cliente[]; // Lista de clientes asociados a la sede
}
