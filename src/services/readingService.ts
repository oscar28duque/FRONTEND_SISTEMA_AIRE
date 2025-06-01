import api from '../config/axios';

export type ReadingQuality = 'bueno' | 'dudoso' | 'malo';

export interface Reading {
    id: number;
    sensor: number; // ID del sensor
    valor: number;
    fecha_hora: string;
    calidad_dato: ReadingQuality;
    created_at: string;
    updated_at: string;
}

const readingService = {
    // Obtener todas las lecturas
    getAllReadings: async (params?: {
        sensor?: number;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }): Promise<Reading[]> => {
        const response = await api.get('lecturas/', { params });
        return response.data;
    },

    // Obtener una lectura por ID
    getReadingById: async (id: number): Promise<Reading> => {
        const response = await api.get(`lecturas/${id}/`);
        return response.data;
    },

    // Crear una nueva lectura
    createReading: async (readingData: Omit<Reading, 'id' | 'created_at' | 'updated_at'>): Promise<Reading> => {
        const response = await api.post('lecturas/', readingData);
        return response.data;
    },

    // Actualizar una lectura
    updateReading: async (id: number, readingData: Partial<Reading>): Promise<Reading> => {
        const response = await api.put(`lecturas/${id}/`, readingData);
        return response.data;
    },

    // Eliminar una lectura
    deleteReading: async (id: number): Promise<void> => {
        await api.delete(`lecturas/${id}/`);
    },

    // Obtener estadísticas de lecturas
    getReadingStats: async (sensorId: number, params?: {
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.get(`lecturas/estadisticas/${sensorId}/`, { params });
        return response.data;
    }
};

export default readingService; 