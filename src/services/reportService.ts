import api from '../config/axios';

export type ReportContentType = 'texto' | 'grafico' | 'tabla' | 'resumen';

export interface ReportDetail {
    id: number;
    reporte: number;
    contenido: string;
    tipo_contenido: ReportContentType;
    orden: number;
    created_at: string;
    updated_at: string;
}

export interface Report {
    id: number;
    titulo: string;
    descripcion: string;
    generado_por: number;
    periodo_inicio: string;
    periodo_fin: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    detalles?: ReportDetail[];
}

export interface ReportParams {
  type: 'alerts' | 'sensors' | 'readings' | 'maintenance';
  startDate: string;
  endDate: string;
}

const reportService = {
    // Obtener todos los reportes
    getAllReports: async (): Promise<Report[]> => {
        const response = await api.get('reports/');
        return response.data;
    },

    // Obtener un reporte por ID
    getReportById: async (id: number): Promise<Report> => {
        const response = await api.get(`reports/${id}/`);
        return response.data;
    },

    // Crear un nuevo reporte
    createReport: async (reportData: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<Report> => {
        const response = await api.post('reports/', reportData);
        return response.data;
    },

    // Actualizar un reporte
    updateReport: async (id: number, reportData: Partial<Report>): Promise<Report> => {
        const response = await api.put(`reports/${id}/`, reportData);
        return response.data;
    },

    // Eliminar un reporte
    deleteReport: async (id: number): Promise<void> => {
        await api.delete(`reports/${id}/`);
    },

    // Agregar detalle a un reporte
    addReportDetail: async (reportId: number, detailData: Omit<ReportDetail, 'id' | 'reporte' | 'created_at' | 'updated_at'>): Promise<ReportDetail> => {
        const response = await api.post(`reports/${reportId}/detalles/`, detailData);
        return response.data;
    },

    // Actualizar detalle de un reporte
    updateReportDetail: async (reportId: number, detailId: number, detailData: Partial<ReportDetail>): Promise<ReportDetail> => {
        const response = await api.put(`reports/${reportId}/detalles/${detailId}/`, detailData);
        return response.data;
    },

    // Eliminar detalle de un reporte
    deleteReportDetail: async (reportId: number, detailId: number): Promise<void> => {
        await api.delete(`reports/${reportId}/detalles/${detailId}/`);
    },

    // Generar reporte automático
    generateAutomaticReport: async (params: { type: string; frequency: string }) => {
        const response = await api.post('reports/automatic/', params);
        return response.data;
    },

    generateReport: async (params: ReportParams) => {
        const response = await api.post('reports/generate/', params, {
            responseType: 'blob'
        });
        return response.data;
    },

    downloadReport: async (sensorId: number, startDate: string, endDate: string) => {
        try {
            const response = await api.get(`/readings/report/`, {
                params: {
                    sensor: sensorId,
                    start_date: startDate,
                    end_date: endDate
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_sensor_${sensorId}_${startDate}_${endDate}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default reportService; 