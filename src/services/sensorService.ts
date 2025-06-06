import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Configurar el interceptor para incluir el token en todas las solicitudes
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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
        const response = await axios.get(`${API_URL}/sensores/`, { params: filters });
        return response.data;
    },

    getSensorById: async (id: number) => {
        const response = await axios.get(`${API_URL}/sensores/${id}/`);
        return response.data;
    },

    createSensor: async (sensor: Omit<Sensor, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axios.post(`${API_URL}/sensores/`, sensor);
        return response.data;
    },

    updateSensor: async (id: number, sensor: Partial<Sensor>) => {
        const response = await axios.put(`${API_URL}/sensores/${id}/`, sensor);
        return response.data;
    },

    deleteSensor: async (id: number) => {
        const response = await axios.delete(`${API_URL}/sensores/${id}/`);
        return response.data;
    },

    calibrateSensor: async (id: number) => {
        const response = await axios.put(`${API_URL}/sensores/${id}/calibrar/`, {
            fecha_ultima_calibracion: new Date().toISOString(),
        });
        return response.data;
    },

    getSensorReadings: async (id: number, params?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) => {
        const response = await axios.get(`${API_URL}/sensores/${id}/lecturas/`, { params });
        return response.data;
    },

    getSensorAlerts: async (sensorId: number) => {
        const response = await axios.get(`${API_URL}/sensores/${sensorId}/alertas/`);
        return response.data;
    }
};

export default sensorService; 