import api from '../config/axios';

export interface Zone {
    id: number;
    nombre_zona: string;
    descripcion: string;
    latitud: number | null;
    longitud: number | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

const zoneService = {
    // Obtener todas las zonas
    getAllZones: async (): Promise<Zone[]> => {
        const response = await api.get('zonas/');
        return response.data;
    },

    // Obtener una zona por ID
    getZoneById: async (id: number): Promise<Zone> => {
        const response = await api.get(`zonas/${id}/`);
        return response.data;
    },

    // Crear una nueva zona
    createZone: async (zoneData: Omit<Zone, 'id' | 'created_at' | 'updated_at'>): Promise<Zone> => {
        const response = await api.post('zonas/', zoneData);
        return response.data;
    },

    // Actualizar una zona
    updateZone: async (id: number, zoneData: Partial<Zone>): Promise<Zone> => {
        const response = await api.put(`zonas/${id}/`, zoneData);
        return response.data;
    },

    // Eliminar una zona
    deleteZone: async (id: number): Promise<void> => {
        await api.delete(`zonas/${id}/`);
    },

    // Obtener estaciones de una zona
    getZoneStations: async (zoneId: number) => {
        const response = await api.get(`zonas/${zoneId}/estaciones/`);
        return response.data;
    }
};

export default zoneService; 