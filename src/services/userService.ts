import api from '../config/axios';

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    estado_cuenta: 'activo' | 'inactivo' | 'bloqueado';
    fecha_registro: string;
}

const userService = {
    // Obtener todos los usuarios
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get('usuarios/');
        return response.data;
    },

    // Obtener un usuario por ID
    getUserById: async (id: number): Promise<User> => {
        const response = await api.get(`usuarios/${id}/`);
        return response.data;
    },

    // Crear un nuevo usuario
    createUser: async (userData: Omit<User, 'id' | 'fecha_registro'>): Promise<User> => {
        const response = await api.post('usuarios/', userData);
        return response.data;
    },

    // Actualizar un usuario
    updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
        const response = await api.put(`usuarios/${id}/`, userData);
        return response.data;
    },

    // Eliminar un usuario
    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`usuarios/${id}/`);
    },

    // Obtener roles de usuario
    getUserRoles: async (userId: number) => {
        const response = await api.get(`usuarios-roles/?usuario=${userId}`);
        return response.data;
    },

    // Asignar rol a usuario
    assignRole: async (userId: number, roleId: number) => {
        const response = await api.post('usuarios-roles/', {
            usuario: userId,
            rol: roleId
        });
        return response.data;
    },

    // Remover rol de usuario
    removeRole: async (userRoleId: number) => {
        await api.delete(`usuarios-roles/${userRoleId}/`);
    }
};

export default userService; 