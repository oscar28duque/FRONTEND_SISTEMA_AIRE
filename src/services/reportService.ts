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
    generado_por: number; // ID del usuario
    periodo_inicio: string;
    periodo_fin: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    detalles?: ReportDetail[];
}

const reportService = {
    // Obtener todos los reportes
    getAllReports: async (): Promise<Report[]> => {
        const response = await api.get('reportes/');
        return response.data;
    },

    // Obtener un reporte por ID
    getReportById: async (id: number): Promise<Report> => {
        const response = await api.get(`reportes/${id}/`);
        return response.data;
    },

    // Crear un nuevo reporte
    createReport: async (reportData: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<Report> => {
        const response = await api.post('reportes/', reportData);
        return response.data;
    },

    // Actualizar un reporte
    updateReport: async (id: number, reportData: Partial<Report>): Promise<Report> => {
        const response = await api.put(`reportes/${id}/`, reportData);
        return response.data;
    },

    // Eliminar un reporte
    deleteReport: async (id: number): Promise<void> => {
        await api.delete(`reportes/${id}/`);
    },

    // Agregar detalle a un reporte
    addReportDetail: async (reportId: number, detailData: Omit<ReportDetail, 'id' | 'reporte' | 'created_at' | 'updated_at'>): Promise<ReportDetail> => {
        const response = await api.post(`reportes/${reportId}/detalles/`, detailData);
        return response.data;
    },

    // Actualizar detalle de un reporte
    updateReportDetail: async (reportId: number, detailId: number, detailData: Partial<ReportDetail>): Promise<ReportDetail> => {
        const response = await api.put(`reportes/${reportId}/detalles/${detailId}/`, detailData);
        return response.data;
    },

    // Eliminar detalle de un reporte
    deleteReportDetail: async (reportId: number, detailId: number): Promise<void> => {
        await api.delete(`reportes/${reportId}/detalles/${detailId}/`);
    },

    // Generar reporte automático
    generateAutomaticReport: async (params: {
        tipo: string;
        periodo_inicio: string;
        periodo_fin: string;
        sensores?: number[];
        zonas?: number[];
    }): Promise<Report> => {
        const response = await api.post('reportes/generar-automatico/', params);
        return response.data;
    }
};

export default reportService; 