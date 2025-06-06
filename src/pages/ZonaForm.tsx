import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ZonaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre_zona: '',
    descripcion: '',
  });

  useEffect(() => {
    if (id) {
      fetchZona();
    }
  }, [id]);

  const fetchZona = async () => {
    try {
      const response = await axios.get(`${API_URL}/zonas/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormData({
        nombre_zona: response.data.nombre_zona,
        descripcion: response.data.descripcion,
      });
    } catch (err) {
      console.error('Error al cargar la zona:', err);
      setError('Error al cargar la zona. Por favor, intente nuevamente.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        is_active: true
      };

      if (id) {
        // Actualizar zona existente
        await axios.put(`${API_URL}/zonas/${id}/`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Crear nueva zona
        await axios.post(`${API_URL}/zonas/`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      navigate('/zonas');
    } catch (err: any) {
      console.error('Error al guardar la zona:', err);
      console.error('Datos de error:', err.response?.data);
      const errorMessage = err.response?.data || 'Error al guardar la zona. Por favor, verifique los datos e intente nuevamente.';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage, null, 2) : errorMessage);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Editar Zona' : 'Nueva Zona'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Nombre de la Zona"
                  name="nombre_zona"
                  value={formData.nombre_zona}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/zonas')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    {id ? 'Actualizar' : 'Guardar'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ZonaForm; 