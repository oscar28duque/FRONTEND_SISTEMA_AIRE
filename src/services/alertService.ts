import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export interface AlertFilters {
    sensor?: number;
    atendida?: boolean;
    start_date?: string;
    end_date?: string;
    limit?: number;
}

export interface Alert {
    id: number;
    sensor: number;
    tipo_alerta: string;
    descripcion: string;
    nivel_alerta: string;
    fecha_hora: string;
    atendida: boolean;
    atendida_por: string | null;
    fecha_atencion: string | null;
    created_at: string;
    updated_at: string;
}

const alertService = {
    getAllAlerts: async (filters?: AlertFilters) => {
        const response = await axios.get(`${API_URL}/alerts/`, {
            params: filters,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    getAlert: async (id: number) => {
        const response = await axios.get(`${API_URL}/alerts/${id}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    createAlert: async (alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) => {
        const response = await axios.post(`${API_URL}/alerts/`, alert, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    updateAlert: async (id: number, alert: Partial<Alert>) => {
        const response = await axios.put(`${API_URL}/alerts/${id}/`, alert, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    deleteAlert: async (id: number) => {
        await axios.delete(`${API_URL}/alerts/${id}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    markAsAttended: async (id: number, userId: number) => {
        const response = await axios.patch(`${API_URL}/alerts/${id}/attend/`, {
            atendida_por: userId,
            fecha_atencion: new Date().toISOString()
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    getAlertStats: async (params?: {
        startDate?: string;
        endDate?: string;
    }) => {
        const response = await axios.get('/alerts/stats', { params });
        return response.data;
    }
};

export default alertService; 