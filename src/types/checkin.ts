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

// Interfaz para el fondo
export interface Fondo {
  idFondo: number;
  nombre: string;
  tipo: string;
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
  fecharegistro: Date;
  B_100000: number;
  B_50000: number;
  B_20000: number;
  B_10000: number;
  B_5000: number;
  B_2000: number;
  Sum_B: number;
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
