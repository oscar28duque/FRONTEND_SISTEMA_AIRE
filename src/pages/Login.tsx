import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recoveryDialogOpen, setRecoveryDialogOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  // Cargar usuario guardado al iniciar
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({
        ...prev,
        username: savedUsername,
        rememberMe: true
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(formData);
      
      // Guardar usuario si "Recordar usuario" está marcado
      if (formData.rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecoveryLoading(true);
    setRecoveryMessage(null);

    try {
      await authService.requestPasswordRecovery(recoveryEmail);
      setRecoveryMessage('Se ha enviado un correo con las instrucciones para recuperar su contraseña.');
      setTimeout(() => {
        setRecoveryDialogOpen(false);
        setRecoveryEmail('');
        setRecoveryMessage(null);
      }, 3000);
    } catch (err) {
      setRecoveryMessage('Error al procesar la solicitud. Por favor, intente nuevamente.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleCloseRecoveryDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!recoveryLoading) {
      setRecoveryDialogOpen(false);
      setRecoveryEmail('');
      setRecoveryMessage(null);
    }
  };

  const handleOpenRecoveryDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecoveryDialogOpen(true);
  };

  return (
    <Container component="main" maxWidth="xs">
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
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  color="primary"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
              }
              label="Recordar usuario"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleOpenRecoveryDialog}
                sx={{ cursor: 'pointer' }}
              >
                ¿Olvidó su contraseña?
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ cursor: 'pointer' }}
              >
                ¿No tienes una cuenta? Regístrate
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Diálogo de recuperación de contraseña */}
      <Dialog 
        open={recoveryDialogOpen} 
        onClose={handleCloseRecoveryDialog}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Recuperar Contraseña</DialogTitle>
        <DialogContent>
          {recoveryMessage ? (
            <Alert severity={recoveryMessage.includes('Error') ? 'error' : 'success'}>
              {recoveryMessage}
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleRecoverySubmit} onClick={(e) => e.stopPropagation()}>
              <TextField
                autoFocus
                margin="dense"
                label="Correo electrónico"
                type="email"
                fullWidth
                variant="outlined"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                required
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseRecoveryDialog}
            disabled={recoveryLoading}
          >
            Cancelar
          </Button>
          {!recoveryMessage && (
            <Button 
              onClick={handleRecoverySubmit} 
              variant="contained"
              disabled={!recoveryEmail || recoveryLoading}
            >
              {recoveryLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login; 