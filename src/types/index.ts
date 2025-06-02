export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string;
}

export interface Sensor {
  id: number;
  tipo_sensor: string;
  modelo: string;
  estado: string;
  estacion: string;
  rango_minimo: number;
  rango_maximo: number;
  unidad_medida: string;
  fecha_instalacion: string;
  fecha_ultima_calibracion: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Reading {
  id: number;
  sensor: number;
  valor: number;
  fecha_hora: string;
  calidad_dato: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: number;
  tipo_alerta: string;
  descripcion: string;
  nivel_alerta: string;
  fecha_hora: string;
  atendida: boolean;
  atendida_por: number | null;
  fecha_atencion: string | null;
  created_at: string;
  updated_at: string;
}

export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';
export type ReadingQuality = 'bueno' | 'regular' | 'malo';
export type SensorState = 'activo' | 'inactivo' | 'mantenimiento' | 'calibracion'; 