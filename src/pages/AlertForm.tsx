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
import alertService from '../services/alertService';
import { Alert as AlertType, AlertLevel } from '../types';

const niveles: AlertLevel[] = ['info', 'warning', 'error', 'critical'];

const AlertForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tipo_alerta: '',
    descripcion: '',
    nivel_alerta: 'info' as AlertLevel,
    fecha_hora: '',
    atendida: false,
    atendida_por: '',
    fecha_atencion: '',
  });

  useEffect(() => {
    if (id) {
      const fetchAlert = async () => {
        try {
          const alert = await alertService.getAlertById(parseInt(id));
          setFormData({
            tipo_alerta: alert.tipo_alerta,
            descripcion: alert.descripcion,
            nivel_alerta: alert.nivel_alerta as AlertLevel,
            fecha_hora: alert.fecha_hora,
            atendida: alert.atendida,
            atendida_por: alert.atendida_por?.toString() || '',
            fecha_atencion: alert.fecha_atencion || '',
          });
        } catch (err) {
          setError('Error al cargar los datos de la alerta');
        }
      };
      fetchAlert();
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
      const alertData = {
        ...formData,
        atendida_por: formData.atendida_por ? parseInt(formData.atendida_por) : null,
      };

      if (id) {
        await alertService.updateAlert(parseInt(id), alertData);
      } else {
        await alertService.createAlert(alertData);
      }

      navigate('/alerts');
    } catch (err) {
      setError('Error al guardar la alerta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {id ? 'Editar Alerta' : 'Nueva Alerta'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Tipo de Alerta"
            name="tipo_alerta"
            value={formData.tipo_alerta}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel>Nivel de Alerta</InputLabel>
            <Select
              name="nivel_alerta"
              value={formData.nivel_alerta}
              onChange={handleChange}
              required
            >
              {niveles.map((nivel) => (
                <MenuItem key={nivel} value={nivel}>
                  {nivel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            multiline
            rows={4}
            value={formData.descripcion}
            onChange={handleChange}
            required
            sx={{ gridColumn: '1 / -1' }}
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

          <TextField
            fullWidth
            label="Atendida por (ID)"
            name="atendida_por"
            type="number"
            value={formData.atendida_por}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Fecha de Atención"
            name="fecha_atencion"
            type="datetime-local"
            value={formData.fecha_atencion}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/alerts')}
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

export default AlertForm; 