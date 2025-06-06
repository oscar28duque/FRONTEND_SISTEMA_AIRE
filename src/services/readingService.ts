import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface ReadingFilters {
    sensor?: number;
    start_date?: string;
    end_date?: string;
    limit?: number;
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

const readingService = {
    getAllReadings: async (filters?: ReadingFilters) => {
        const response = await axios.get(`${API_URL}/readings/`, {
            params: filters,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    getReading: async (id: number) => {
        const response = await axios.get(`${API_URL}/readings/${id}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    createReading: async (reading: Omit<Reading, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axios.post(`${API_URL}/readings/`, reading, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    updateReading: async (id: number, reading: Partial<Reading>) => {
        const response = await axios.put(`${API_URL}/readings/${id}/`, reading, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    deleteReading: async (id: number) => {
        await axios.delete(`${API_URL}/readings/${id}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    getReadingsBySensor: async (sensorId: number, params?: {
        startDate?: string;
        endDate?: string;
        limit?: number;
    }) => {
        const response = await axios.get(`${API_URL}/sensors/${sensorId}/readings`, { params });
        return response.data;
    },

    getReadingsStats: async (params?: {
        sensor?: number;
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await axios.get('/readings/stats', { params });
        return response.data;
    },
};

export default readingService; 