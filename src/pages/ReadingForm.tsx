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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import readingService from '../services/readingService';
import sensorService from '../services/sensorService';

const calidades = [
  { value: 'bueno', label: 'Bueno' },
  { value: 'dudoso', label: 'Dudoso' },
  { value: 'malo', label: 'Malo' },
];

interface Sensor {
  id: number;
  tipo_sensor: string;
  modelo: string;
  unidad_medida: string;
}

const ReadingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [formData, setFormData] = useState({
    sensor: '',
    valor: '',
    fecha_hora: new Date(),
    calidad_dato: 'bueno',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sensorsResponse = await sensorService.getAllSensors();
        setSensors(sensorsResponse);
        
        if (id) {
          const readingResponse = await readingService.getReading(parseInt(id));
          setFormData({
            sensor: readingResponse.sensor.toString(),
            valor: readingResponse.valor.toString(),
            fecha_hora: new Date(readingResponse.fecha_hora),
            calidad_dato: readingResponse.calidad_dato,
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

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        fecha_hora: date
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        sensor: parseInt(formData.sensor),
        valor: parseFloat(formData.valor),
        fecha_hora: formData.fecha_hora.toISOString(),
        calidad_dato: formData.calidad_dato,
      };

      if (id) {
        await readingService.updateReading(parseInt(id), dataToSend);
      } else {
        await readingService.createReading(dataToSend);
      }
      navigate('/readings');
    } catch (err) {
      setError('Error al guardar la lectura');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Editar Lectura' : 'Nueva Lectura'}
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
                      {sensor.tipo_sensor} - {sensor.modelo} ({sensor.unidad_medida})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Valor"
                  name="valor"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  value={formData.valor}
                  onChange={handleChange}
                  helperText="Valor entre -1000 y 1000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Fecha y Hora"
                    value={formData.fecha_hora}
                    onChange={handleDateChange}
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
                <TextField
                  required
                  fullWidth
                  select
                  label="Calidad del Dato"
                  name="calidad_dato"
                  value={formData.calidad_dato}
                  onChange={handleChange}
                >
                  {calidades.map((option) => (
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
                    onClick={() => navigate('/readings')}
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

export default ReadingForm; 