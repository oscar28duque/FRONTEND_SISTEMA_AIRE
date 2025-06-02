import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import alertService from '../services/alertService';
import sensorService from '../services/sensorService';
import readingService from '../services/readingService';

interface Alert {
  id: number;
  tipo_alerta: string;
  descripcion: string;
  nivel_alerta: string;
  fecha_hora: string;
  atendida: boolean;
}

interface Sensor {
  id: number;
  tipo_sensor: string;
  modelo: string;
  estado: string;
  estacion: number;
  rango_minimo: number | null;
  rango_maximo: number | null;
  unidad_medida: string | null;
  fecha_instalacion: string | null;
  fecha_ultima_calibracion: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface Reading {
  id: number;
  sensor: number;
  valor: number;
  fecha_hora: string;
  calidad_dato: string;
}

// Función para obtener el color de la alerta según el nivel
const getAlertColor = (nivel: string) => {
  switch (nivel) {
    case 'bajo':
      return 'info';
    case 'medio':
      return 'warning';
    case 'alto':
    case 'critico':
    case 'critical':
      return 'error';
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'default';
  }
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsData, sensorsData, readingsData] = await Promise.all([
          alertService.getAllAlerts({ atendida: false }),
          sensorService.getAllSensors(),
          readingService.getAllReadings({ limit: 5 }),
        ]);

        setAlerts(alertsData);
        setSensors(sensorsData);
        setReadings(readingsData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mt: 4 }}>
        {/* Panel de Alertas */}
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>Alertas Activas</Typography>
          {alerts.length === 0 ? (
            <Typography variant="body2">No hay alertas activas.</Typography>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {alerts.map(alert => (
                <li key={alert.id}>
                  <Typography color={getAlertColor(alert.nivel_alerta)}>
                    {alert.tipo_alerta} - {alert.descripcion}
                  </Typography>
                  <Typography variant="caption">{alert.fecha_hora}</Typography>
                </li>
              ))}
            </ul>
          )}
          <Button sx={{ mt: 2 }} variant="outlined" fullWidth onClick={() => navigate('/alerts')}>Ver todas</Button>
        </Box>

        {/* Panel de Sensores */}
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>Sensores</Typography>
          {sensors.length === 0 ? (
            <Typography variant="body2">No hay sensores registrados.</Typography>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {sensors.slice(0, 5).map(sensor => (
                <li key={sensor.id}>
                  <Typography>{sensor.tipo_sensor} - {sensor.modelo} ({sensor.estado})</Typography>
                </li>
              ))}
            </ul>
          )}
          <Button sx={{ mt: 2 }} variant="outlined" fullWidth onClick={() => navigate('/sensors')}>Ver todos</Button>
        </Box>

        {/* Panel de Lecturas */}
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" gutterBottom>Lecturas Recientes</Typography>
          {readings.length === 0 ? (
            <Typography variant="body2">No hay lecturas recientes.</Typography>
          ) : (
            <ul style={{ paddingLeft: 16 }}>
              {readings.map(reading => (
                <li key={reading.id}>
                  <Typography>
                    Sensor #{reading.sensor}: {reading.valor} ({reading.calidad_dato})
                  </Typography>
                  <Typography variant="caption">{reading.fecha_hora}</Typography>
                </li>
              ))}
            </ul>
          )}
          <Button sx={{ mt: 2 }} variant="outlined" fullWidth onClick={() => navigate('/readings')}>Ver todas</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 