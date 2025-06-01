import api from '../config/axios';

export type SensorState = 'activo' | 'inactivo' | 'mantenimiento' | 'calibracion';

export interface Sensor {
    id: number;
    tipo_sensor: string;
    modelo: string;
    unidad_medida: string;
    fecha_instalacion: string;
    fecha_ultima_calibracion: string | null;
    estado: SensorState;
    estacion: number; // ID de la estación
    rango_minimo: number | null;
    rango_maximo: number | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

const sensorService = {
    // Obtener todos los sensores
    getAllSensors: async (): Promise<Sensor[]> => {
        const response = await api.get('sensores/');
        return response.data;
    },

    // Obtener un sensor por ID
    getSensorById: async (id: number): Promise<Sensor> => {
        const response = await api.get(`sensores/${id}/`);
        return response.data;
    },

    // Crear un nuevo sensor
    createSensor: async (sensorData: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>): Promise<Sensor> => {
        const response = await api.post('sensores/', sensorData);
        return response.data;
    },

    // Actualizar un sensor
    updateSensor: async (id: number, sensorData: Partial<Sensor>): Promise<Sensor> => {
        const response = await api.put(`sensores/${id}/`, sensorData);
        return response.data;
    },

    // Eliminar un sensor
    deleteSensor: async (id: number): Promise<void> => {
        await api.delete(`sensores/${id}/`);
    },

    // Obtener lecturas de un sensor
    getSensorReadings: async (sensorId: number, params?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) => {
        const response = await api.get(`sensores/${sensorId}/lecturas/`, { params });
        return response.data;
    },

    // Obtener alertas de un sensor
    getSensorAlerts: async (sensorId: number) => {
        const response = await api.get(`sensores/${sensorId}/alertas/`);
        return response.data;
    }
};

export default sensorService; 