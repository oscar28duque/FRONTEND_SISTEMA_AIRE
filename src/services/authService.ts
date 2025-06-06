import api from '../config/axios';

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
}

export interface TokenResponse {
    access: string;
    refresh: string;
}

export class AuthError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'AuthError';
    }
}

const authService = {
    // Login
    login: async (data: LoginData): Promise<TokenResponse> => {
        try {
            const response = await api.post<TokenResponse>('auth/login/', data);
            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
            }
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new AuthError('Credenciales inválidas', 401);
            }
            throw new AuthError('Error al iniciar sesión');
        }
    },

    // Registro
    register: async (data: RegisterData) => {
        try {
            const response = await api.post('auth/registro/', data);
            return response.data;
        } catch (error: any) {
            console.log('Error completo:', error.response?.data);
            if (error.response?.data?.username) {
                throw new AuthError('El nombre de usuario ya está en uso');
            }
            if (error.response?.data?.email) {
                throw new AuthError('El correo electrónico ya está registrado');
            }
            if (error.response?.data?.password) {
                throw new AuthError(error.response.data.password[0]);
            }
            if (error.response?.data?.password2) {
                throw new AuthError(error.response.data.password2[0]);
            }
            throw new AuthError('Error al registrar usuario: ' + JSON.stringify(error.response?.data));
        }
    },

    // Obtener usuario actual
    getCurrentUser: async () => {
        try {
            const response = await api.get('auth/usuario-actual/');
            return response.data;
        } catch (error: any) {
            throw new AuthError('Error al obtener información del usuario');
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    },

    // Solicitar recuperación de contraseña
    requestPasswordRecovery: async (email: string) => {
        try {
            const response = await api.post('auth/solicitar-recuperacion/', { email });
            return response.data;
        } catch (error: any) {
            throw new AuthError('Error al solicitar recuperación de contraseña');
        }
    },

    // Verificar token de recuperación
    verifyRecoveryToken: async (token: string) => {
        try {
            const response = await api.post('auth/verificar-token/', { token });
            return response.data;
        } catch (error: any) {
            throw new AuthError('Token de recuperación inválido o expirado');
        }
    },

    // Cambiar contraseña
    changePassword: async (token: string, newPassword: string) => {
        try {
            const response = await api.post('auth/cambiar-password/', {
                token,
                new_password: newPassword
            });
            return response.data;
        } catch (error: any) {
            throw new AuthError('Error al cambiar la contraseña');
        }
    }
};

export default authService; 