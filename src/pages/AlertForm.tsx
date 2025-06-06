import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import alertService from '../services/alertService';
import sensorService from '../services/sensorService';

const niveles = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' }
];

const tipos = [
  { value: 'error', label: 'Error' },
  { value: 'advertencia', label: 'Advertencia' },
  { value: 'info', label: 'Información' }
];

interface Sensor {
  id: number;
  tipo_sensor: string;
  modelo: string;
}

const AlertForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [formData, setFormData] = useState({
    sensor: '',
    tipo_alerta: '',
    descripcion: '',
    nivel_alerta: 'medio',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sensorsResponse = await sensorService.getAllSensors();
        setSensors(sensorsResponse);
        
        if (id) {
          const alertResponse = await alertService.getAlert(parseInt(id));
          setFormData({
            sensor: alertResponse.sensor.toString(),
            tipo_alerta: alertResponse.tipo_alerta,
            descripcion: alertResponse.descripcion,
            nivel_alerta: alertResponse.nivel_alerta,
          });
        }
      } catch (err) {
        setError('Error al cargar los datos');
      }
    };
    fetchData();
  }, [id]);

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
        sensor: parseInt(formData.sensor),
        tipo_alerta: formData.tipo_alerta,
        descripcion: formData.descripcion,
        nivel_alerta: formData.nivel_alerta,
        fecha_hora: new Date().toISOString(),
        atendida: false,
        atendida_por: null,
        fecha_atencion: null
      };

      if (id) {
        // Actualizar alerta existente
        await alertService.updateAlert(parseInt(id), dataToSend);
      } else {
        // Crear nueva alerta
        await alertService.createAlert(dataToSend);
      }
      navigate('/alerts');
    } catch (err) {
      setError('Error al guardar la alerta');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Editar Alerta' : 'Nueva Alerta'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Sensor"
                  name="sensor"
                  value={formData.sensor}
                  onChange={handleChange}
                >
                  {sensors.map((sensor) => (
                    <MenuItem key={sensor.id} value={sensor.id}>
                      {sensor.tipo_sensor} - {sensor.modelo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Tipo de Alerta"
                  name="tipo_alerta"
                  value={formData.tipo_alerta}
                  onChange={handleChange}
                >
                  {tipos.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  multiline
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Nivel de Alerta"
                  name="nivel_alerta"
                  value={formData.nivel_alerta}
                  onChange={handleChange}
                >
                  {niveles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/alerts')}
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

export default AlertForm;
