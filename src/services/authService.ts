import api from '../config/axios';

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}

const authService = {
    // Login
    login: async (data: LoginData): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>('auth/login/', data);
        if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
        }
        return response.data;
    },

    // Registro
    register: async (data: RegisterData) => {
        const response = await api.post('auth/registro/', data);
        return response.data;
    },

    // Obtener usuario actual
    getCurrentUser: async () => {
        const response = await api.get('auth/usuario-actual/');
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    // Solicitar recuperación de contraseña
    requestPasswordRecovery: async (email: string) => {
        const response = await api.post('auth/solicitar-recuperacion/', { email });
        return response.data;
    },

    // Verificar token de recuperación
    verifyRecoveryToken: async (token: string) => {
        const response = await api.post('auth/verificar-token/', { token });
        return response.data;
    },

    // Cambiar contraseña
    changePassword: async (token: string, newPassword: string) => {
        const response = await api.post('auth/cambiar-password/', {
            token,
            new_password: newPassword
        });
        return response.data;
    }
};

export default authService; 