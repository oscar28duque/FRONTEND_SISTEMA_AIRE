import axios from 'axios';
import { API_URL } from './index';

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            if (error.response.status === 401) {
                // Token expirado o inválido
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    try {
                        // Intentar refrescar el token
                        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                            refresh: refreshToken
                        });
                        const { access } = response.data;
                        localStorage.setItem('token', access);
                        // Reintentar la petición original
                        error.config.headers.Authorization = `Bearer ${access}`;
                        return axios(error.config);
                    } catch (refreshError) {
                        // Si falla el refresh, hacer logout
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                    }
                } else {
                    // No hay refresh token, hacer logout
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } else if (error.response.status === 403) {
                // Acceso denegado
                window.location.href = '/dashboard';
            }
        }
        return Promise.reject(error);
    }
);

export default api; 