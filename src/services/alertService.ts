import api from '../config/axios';

export type AlertLevel = 'bajo' | 'medio' | 'alto' | 'critico';

export interface Alert {
    id: number;
    sensor: number; // ID del sensor
    tipo_alerta: string;
    descripcion: string;
    nivel_alerta: AlertLevel;
    fecha_hora: string;
    atendida: boolean;
    atendida_por: number | null; // ID del usuario que atendió
    fecha_atencion: string | null;
    created_at: string;
    updated_at: string;
}

const alertService = {
    // Obtener todas las alertas
    getAllAlerts: async (params?: {
        sensor?: number;
        atendida?: boolean;
        nivel_alerta?: AlertLevel;
        startDate?: string;
        endDate?: string;
    }): Promise<Alert[]> => {
        const response = await api.get('alertas/', { params });
        return response.data;
    },

    // Obtener una alerta por ID
    getAlertById: async (id: number): Promise<Alert> => {
        const response = await api.get(`alertas/${id}/`);
        return response.data;
    },

    // Crear una nueva alerta
    createAlert: async (alertData: Omit<Alert, 'id' | 'created_at' | 'updated_at' | 'atendida' | 'atendida_por' | 'fecha_atencion'>): Promise<Alert> => {
        const response = await api.post('alertas/', alertData);
        return response.data;
    },

    // Actualizar una alerta
    updateAlert: async (id: number, alertData: Partial<Alert>): Promise<Alert> => {
        const response = await api.put(`alertas/${id}/`, alertData);
        return response.data;
    },

    // Eliminar una alerta
    deleteAlert: async (id: number): Promise<void> => {
        await api.delete(`alertas/${id}/`);
    },

    // Marcar alerta como atendida
    markAlertAsAttended: async (id: number, userId: number): Promise<Alert> => {
        const response = await api.post(`alertas/${id}/atender/`, {
            atendida_por: userId
        });
        return response.data;
    },

    // Obtener estadísticas de alertas
    getAlertStats: async (params?: {
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.get('alertas/estadisticas/', { params });
        return response.data;
    }
};

export default alertService; 