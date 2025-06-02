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
import readingService from '../services/readingService';
import sensorService from '../services/sensorService';
import { Reading, ReadingQuality } from '../types';

const calidades: ReadingQuality[] = ['bueno', 'regular', 'malo'];

interface Sensor {
  id: number;
  tipo_sensor: string;
  modelo: string;
}

const ReadingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [formData, setFormData] = useState({
    sensor: '',
    valor: '',
    fecha_hora: '',
    calidad_dato: 'bueno' as ReadingQuality,
  });

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await sensorService.getAllSensors();
        setSensors(response);
      } catch (err) {
        setError('Error al cargar los sensores');
      }
    };

    fetchSensors();

    if (id) {
      const fetchReading = async () => {
        try {
          const reading = await readingService.getReadingById(parseInt(id));
          setFormData({
            sensor: reading.sensor.toString(),
            valor: reading.valor.toString(),
            fecha_hora: reading.fecha_hora,
            calidad_dato: reading.calidad_dato as ReadingQuality,
          });
        } catch (err) {
          setError('Error al cargar los datos de la lectura');
        }
      };
      fetchReading();
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
      const readingData = {
        ...formData,
        sensor: parseInt(formData.sensor),
        valor: parseFloat(formData.valor),
      };

      if (id) {
        await readingService.updateReading(parseInt(id), readingData);
      } else {
        await readingService.createReading(readingData);
      }

      navigate('/readings');
    } catch (err) {
      setError('Error al guardar la lectura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Lectura' : 'Nueva Lectura'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sensor</InputLabel>
            <Select
              name="sensor"
              value={formData.sensor}
              onChange={handleChange}
              required
            >
              {sensors.map((sensor) => (
                <MenuItem key={sensor.id} value={sensor.id}>
                  {sensor.tipo_sensor} - {sensor.modelo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Valor"
            name="valor"
            type="number"
            value={formData.valor}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Fecha y Hora"
            name="fecha_hora"
            type="datetime-local"
            value={formData.fecha_hora}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth>
            <InputLabel>Calidad del Dato</InputLabel>
            <Select
              name="calidad_dato"
              value={formData.calidad_dato}
              onChange={handleChange}
              required
            >
              {calidades.map((calidad) => (
                <MenuItem key={calidad} value={calidad}>
                  {calidad}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/readings')}
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

export default ReadingForm; 