import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import sensorService from '../services/sensorService';
import { Sensor, SensorState } from '../types';

const tiposSensor = [
  'Temperatura',
  'Humedad',
  'Presión',
  'Calidad del Aire',
  'Ruido',
  'Radiación UV',
];

const estados: SensorState[] = ['activo', 'inactivo', 'mantenimiento', 'calibracion'];

const SensorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tipo_sensor: '',
    modelo: '',
    estado: 'activo' as SensorState,
    estacion: '',
    rango_minimo: '',
    rango_maximo: '',
    unidad_medida: '',
    fecha_instalacion: '',
    fecha_ultima_calibracion: '',
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      const fetchSensor = async () => {
        try {
          const sensor = await sensorService.getSensorById(parseInt(id));
          setFormData({
            tipo_sensor: sensor.tipo_sensor,
            modelo: sensor.modelo,
            estado: sensor.estado as SensorState,
            estacion: sensor.estacion.toString(),
            rango_minimo: sensor.rango_minimo?.toString() || '',
            rango_maximo: sensor.rango_maximo?.toString() || '',
            unidad_medida: sensor.unidad_medida || '',
            fecha_instalacion: sensor.fecha_instalacion || '',
            fecha_ultima_calibracion: sensor.fecha_ultima_calibracion || '',
            is_active: sensor.is_active,
          });
        } catch (err) {
          setError('Error al cargar los datos del sensor');
        }
      };
      fetchSensor();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sensorData = {
        ...formData,
        estacion: parseInt(formData.estacion),
        rango_minimo: formData.rango_minimo ? parseFloat(formData.rango_minimo) : null,
        rango_maximo: formData.rango_maximo ? parseFloat(formData.rango_maximo) : null,
      };

      if (id) {
        await sensorService.updateSensor(parseInt(id), sensorData);
      } else {
        await sensorService.createSensor(sensorData);
      }

      navigate('/sensors');
    } catch (err) {
      setError('Error al guardar el sensor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Sensor' : 'Nuevo Sensor'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Sensor</InputLabel>
            <Select
              name="tipo_sensor"
              value={formData.tipo_sensor}
              onChange={handleChange}
              required
            >
              {tiposSensor.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              {estados.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Estación"
            name="estacion"
            type="number"
            value={formData.estacion}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Rango Mínimo"
            name="rango_minimo"
            type="number"
            value={formData.rango_minimo}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Rango Máximo"
            name="rango_maximo"
            type="number"
            value={formData.rango_maximo}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Unidad de Medida"
            name="unidad_medida"
            value={formData.unidad_medida}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Fecha de Instalación"
            name="fecha_instalacion"
            type="date"
            value={formData.fecha_instalacion}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Fecha de Última Calibración"
            name="fecha_ultima_calibracion"
            type="date"
            value={formData.fecha_ultima_calibracion}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/sensors')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SensorForm; 