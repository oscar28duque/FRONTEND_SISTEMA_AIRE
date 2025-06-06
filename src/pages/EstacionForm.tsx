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
  MenuItem,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface Zona {
  id: number;
  nombre_zona: string;
}

const EstacionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [formData, setFormData] = useState({
    nombre_estacion: '',
    ubicacion: '',
    zona: '',
  });

  useEffect(() => {
    fetchZonas();
    if (id) {
      fetchEstacion();
    }
  }, [id]);

  const fetchZonas = async () => {
    try {
      const response = await axios.get(`${API_URL}/zonas/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setZonas(response.data);
    } catch (err) {
      console.error('Error al cargar las zonas:', err);
      setError('Error al cargar las zonas. Por favor, intente nuevamente.');
    }
  };

  const fetchEstacion = async () => {
    try {
      const response = await axios.get(`${API_URL}/estaciones/${id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormData({
        nombre_estacion: response.data.nombre_estacion,
        ubicacion: response.data.ubicacion,
        zona: response.data.zona.toString(),
      });
    } catch (err) {
      console.error('Error al cargar la estación:', err);
      setError('Error al cargar la estación. Por favor, intente nuevamente.');
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
        zona: parseInt(formData.zona),
        is_active: true
      };

      if (id) {
        // Actualizar estación existente
        await axios.put(`${API_URL}/estaciones/${id}/`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        // Crear nueva estación
        await axios.post(`${API_URL}/estaciones/`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      navigate('/estaciones');
    } catch (err: any) {
      console.error('Error al guardar la estación:', err);
      console.error('Datos de error:', err.response?.data);
      const errorMessage = err.response?.data || 'Error al guardar la estación. Por favor, verifique los datos e intente nuevamente.';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage, null, 2) : errorMessage);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Editar Estación' : 'Nueva Estación'}
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
                  label="Nombre de la Estación"
                  name="nombre_estacion"
                  value={formData.nombre_estacion}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Ubicación"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Zona"
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                >
                  {zonas.map((zona) => (
                    <MenuItem key={zona.id} value={zona.id}>
                      {zona.nombre_zona}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/estaciones')}
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

export default EstacionForm; 