import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface Sensor {
    id: number;
    tipo_sensor: string;
    modelo: string;
    estado: string;
    estacion: number;
    rango_minimo: number | null;
    rango_maximo: number | null;
    unidad_medida: string | null;
    fecha_instalacion: string | null;
    fecha_ultima_calibracion: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

interface SensorFilters {
    tipo_sensor?: string;
    estado?: string;
    estacion?: number;
    is_active?: boolean;
}

const sensorService = {
    getAllSensors: async (filters: SensorFilters = {}) => {
        const response = await axios.get(`${API_URL}/sensors`, { params: filters });
        return response.data;
    },

    getSensorById: async (id: number) => {
        const response = await axios.get(`${API_URL}/sensors/${id}`);
        return response.data;
    },

    createSensor: async (sensor: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axios.post(`${API_URL}/sensors`, sensor);
        return response.data;
    },

    updateSensor: async (id: number, sensor: Partial<Sensor>) => {
        const response = await axios.put(`${API_URL}/sensors/${id}`, sensor);
        return response.data;
    },

    deleteSensor: async (id: number) => {
        const response = await axios.delete(`${API_URL}/sensors/${id}`);
        return response.data;
    },

    calibrateSensor: async (id: number) => {
        const response = await axios.put(`${API_URL}/sensors/${id}/calibrate`, {
            fecha_ultima_calibracion: new Date().toISOString(),
        });
        return response.data;
    },

    getSensorReadings: async (id: number, params?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) => {
        const response = await axios.get(`${API_URL}/sensors/${id}/readings`, { params });
        return response.data;
    },

    getSensorAlerts: async (sensorId: number) => {
        const response = await axios.get(`${API_URL}/sensors/${sensorId}/alertas/`);
        return response.data;
    }
};

export default sensorService; 