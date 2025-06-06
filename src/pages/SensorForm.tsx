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
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import sensorService from '../services/sensorService';

const estados = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'calibracion', label: 'Calibración' },
];

const SensorForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tipo_sensor: '',
    modelo: '',
    unidad_medida: '',
    fecha_instalacion: null as Date | null,
    fecha_ultima_calibracion: null as Date | null,
    estado: 'activo',
    estacion: '',
    rango_minimo: '',
    rango_maximo: '',
    is_active: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        tipo_sensor: formData.tipo_sensor,
        modelo: formData.modelo,
        unidad_medida: formData.unidad_medida || null,
        fecha_instalacion: formData.fecha_instalacion ? formData.fecha_instalacion.toISOString().split('T')[0] : null,
        fecha_ultima_calibracion: formData.fecha_ultima_calibracion ? formData.fecha_ultima_calibracion.toISOString().split('T')[0] : null,
        estado: formData.estado,
        estacion: parseInt(formData.estacion),
        rango_minimo: formData.rango_minimo ? parseFloat(formData.rango_minimo) : null,
        rango_maximo: formData.rango_maximo ? parseFloat(formData.rango_maximo) : null,
        is_active: true
      };

      console.log('Datos a enviar:', dataToSend);
      const response = await sensorService.createSensor(dataToSend);
      console.log('Respuesta del servidor:', response);
      navigate('/sensors');
    } catch (err: any) {
      console.error('Error al crear el sensor:', err);
      console.error('Datos de error:', err.response?.data);
      const errorMessage = err.response?.data || 'Error al crear el sensor. Por favor, verifique los datos e intente nuevamente.';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage, null, 2) : errorMessage);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nuevo Sensor
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
                  label="Tipo de Sensor"
                  name="tipo_sensor"
                  value={formData.tipo_sensor}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Modelo"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Unidad de Medida"
                  name="unidad_medida"
                  value={formData.unidad_medida}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  {estados.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ID de Estación"
                  name="estacion"
                  type="number"
                  value={formData.estacion}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rango Mínimo"
                  name="rango_minimo"
                  type="number"
                  value={formData.rango_minimo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Rango Máximo"
                  name="rango_maximo"
                  type="number"
                  value={formData.rango_maximo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Fecha de Instalación"
                    value={formData.fecha_instalacion}
                    onChange={handleDateChange('fecha_instalacion')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Fecha de Última Calibración"
                    value={formData.fecha_ultima_calibracion}
                    onChange={handleDateChange('fecha_ultima_calibracion')}
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/sensors')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                  >
                    Guardar
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

export default SensorForm; 