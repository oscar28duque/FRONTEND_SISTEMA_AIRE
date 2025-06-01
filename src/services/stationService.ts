import api from '../config/axios';

export interface Station {
    id: number;
    nombre_estacion: string;
    ubicacion: string;
    latitud: number | null;
    longitud: number | null;
    zona: number; // ID de la zona
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

const stationService = {
    // Obtener todas las estaciones
    getAllStations: async (): Promise<Station[]> => {
        const response = await api.get('estaciones/');
        return response.data;
    },

    // Obtener una estación por ID
    getStationById: async (id: number): Promise<Station> => {
        const response = await api.get(`estaciones/${id}/`);
        return response.data;
    },

    // Crear una nueva estación
    createStation: async (stationData: Omit<Station, 'id' | 'created_at' | 'updated_at'>): Promise<Station> => {
        const response = await api.post('estaciones/', stationData);
        return response.data;
    },

    // Actualizar una estación
    updateStation: async (id: number, stationData: Partial<Station>): Promise<Station> => {
        const response = await api.put(`estaciones/${id}/`, stationData);
        return response.data;
    },

    // Eliminar una estación
    deleteStation: async (id: number): Promise<void> => {
        await api.delete(`estaciones/${id}/`);
    },

    // Obtener sensores de una estación
    getStationSensors: async (stationId: number) => {
        const response = await api.get(`estaciones/${stationId}/sensores/`);
        return response.data;
    }
};

export default stationService; 