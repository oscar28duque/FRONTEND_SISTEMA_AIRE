import api from '../config/axios';

export interface Reading {
    id: number;
    sensor: number;
    valor: number;
    fecha_hora: string;
    calidad_dato: string;
    created_at: string;
    updated_at: string;
}

interface ReadingFilters {
    sensor?: number;
    startDate?: string;
    endDate?: string;
    calidad_dato?: string;
    limit?: number;
}

const readingService = {
    getAllReadings: async (filters: ReadingFilters = {}) => {
        const response = await api.get('/readings', { params: filters });
        return response.data;
    },

    getReadingById: async (id: number) => {
        const response = await api.get(`/readings/${id}`);
        return response.data;
    },

    createReading: async (reading: Omit<Reading, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await api.post('/readings', reading);
        return response.data;
    },

    updateReading: async (id: number, reading: Partial<Reading>) => {
        const response = await api.put(`/readings/${id}`, reading);
        return response.data;
    },

    deleteReading: async (id: number) => {
        const response = await api.delete(`/readings/${id}`);
        return response.data;
    },

    getReadingsBySensor: async (sensorId: number, params?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) => {
        const response = await api.get(`/sensors/${sensorId}/readings`, { params });
        return response.data;
    },

    getReadingsStats: async (params?: {
        sensor?: number;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.get('/readings/stats', { params });
        return response.data;
    },
};

export default readingService; 