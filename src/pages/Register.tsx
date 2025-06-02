import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Eliminar confirmPassword antes de enviar al API
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      navigate('/login', { 
        state: { message: 'Registro exitoso. Por favor, inicie sesión.' }
      });
    } catch (err) {
      setError('Error al registrar el usuario. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Sistema de Monitoreo de Aire
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mt: 2, mb: 3 }}>
            Registro de Usuario
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Nombre"
                name="first_name"
                autoComplete="given-name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                label="Apellido"
                name="last_name"
                autoComplete="family-name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                label="Usuario"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
              <TextField
                required
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 