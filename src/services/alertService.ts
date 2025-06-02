import api from '../config/axios';

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

interface AlertFilters {
    atendida?: boolean;
    tipo_alerta?: string;
    nivel_alerta?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
}

const alertService = {
    getAllAlerts: async (filters: AlertFilters = {}) => {
        const response = await api.get('/alerts', { params: filters });
        return response.data;
    },

    getAlertById: async (id: number) => {
        const response = await api.get(`/alerts/${id}`);
        return response.data;
    },

    createAlert: async (alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await api.post('/alerts', alert);
        return response.data;
    },

    updateAlert: async (id: number, alert: Partial<Alert>) => {
        const response = await api.put(`/alerts/${id}`, alert);
        return response.data;
    },

    deleteAlert: async (id: number) => {
        const response = await api.delete(`/alerts/${id}`);
        return response.data;
    },

    markAsAttended: async (id: number, userId: number) => {
        const response = await api.put(`/alerts/${id}/attend`, {
            atendida_por: userId,
            fecha_atencion: new Date().toISOString(),
        });
        return response.data;
    },

    getAlertStats: async (params?: {
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await api.get('/alerts/stats', { params });
        return response.data;
    }
};

export default alertService; 