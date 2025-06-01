import api from '../config/axios';

export interface Role {
    id: number;
    nombre_rol: string;
    descripcion: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

const roleService = {
    // Obtener todos los roles
    getAllRoles: async (): Promise<Role[]> => {
        const response = await api.get('roles/');
        return response.data;
    },

    // Obtener un rol por ID
    getRoleById: async (id: number): Promise<Role> => {
        const response = await api.get(`roles/${id}/`);
        return response.data;
    },

    // Crear un nuevo rol
    createRole: async (roleData: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Promise<Role> => {
        const response = await api.post('roles/', roleData);
        return response.data;
    },

    // Actualizar un rol
    updateRole: async (id: number, roleData: Partial<Role>): Promise<Role> => {
        const response = await api.put(`roles/${id}/`, roleData);
        return response.data;
    },

    // Eliminar un rol
    deleteRole: async (id: number): Promise<void> => {
        await api.delete(`roles/${id}/`);
    }
};

export default roleService; 