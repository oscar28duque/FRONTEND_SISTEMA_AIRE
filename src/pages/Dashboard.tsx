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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import alertService from '../services/alertService';
import sensorService from '../services/sensorService';
import readingService from '../services/readingService';
import reportService from '../services/reportService';

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
  const [selectedSensor, setSelectedSensor] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsData, sensorsData, readingsData] = await Promise.all([
          alertService.getAllAlerts({ atendida: false }),
          sensorService.getAllSensors(),
          readingService.getAllReadings({ limit: 50 }),
        ]);

        setAlerts(alertsData);
        setSensors(sensorsData);
        setReadings(readingsData);
        if (sensorsData.length > 0) {
          setSelectedSensor(sensorsData[0].id);
        }
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

  const handleSensorChange = (event: SelectChangeEvent<number>) => {
    setSelectedSensor(event.target.value as number);
  };

  const handleOpenReportDialog = () => {
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
    setStartDate(null);
    setEndDate(null);
    setReportError(null);
  };

  const handleDownloadReport = async () => {
    if (!selectedSensor || !startDate || !endDate) {
      setReportError('Por favor seleccione un sensor y un rango de fechas');
      return;
    }

    try {
      await reportService.downloadReport(
        selectedSensor,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      handleCloseReportDialog();
    } catch (error) {
      setReportError('Error al descargar el reporte');
      console.error('Error:', error);
    }
  };

  const getSensorReadings = () => {
    if (!selectedSensor) return [];
    return readings
      .filter(reading => reading.sensor === selectedSensor)
      .map(reading => ({
        fecha_hora: new Date(reading.fecha_hora).toLocaleString(),
        valor: reading.valor,
        calidad: reading.calidad_dato
      }))
      .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime());
  };

  const getSensorInfo = (sensorId: number) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? `${sensor.tipo_sensor} - ${sensor.modelo}` : 'N/A';
  };

  const getSensorUnit = (sensorId: number | '') => {
    if (!sensorId) return '';
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor?.unidad_medida || '';
  };

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
      <Grid container spacing={3}>
        {/* Panel de Alertas */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
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
            <Button sx={{ mt: 2 }} variant="outlined" fullWidth onClick={() => navigate('/alerts')}>
              Ver todas
            </Button>
          </Paper>
        </Grid>

        {/* Panel de Sensores */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
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
            <Button sx={{ mt: 2 }} variant="outlined" fullWidth onClick={() => navigate('/sensors')}>
              Ver todos
            </Button>
          </Paper>
        </Grid>

        {/* Panel de Lecturas */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Lecturas Recientes</Typography>
            {readings.length === 0 ? (
              <Typography variant="body2">No hay lecturas recientes.</Typography>
            ) : (
              <ul style={{ paddingLeft: 16 }}>
                {readings.slice(0, 5).map(reading => (
                  <li key={reading.id}>
                    <Typography>
                      Sensor #{reading.sensor}: {reading.valor} ({reading.calidad_dato})
                    </Typography>
                    <Typography variant="caption">{reading.fecha_hora}</Typography>
                  </li>
                ))}
              </ul>
            )}
            <Button sx={{ mt: 2 }} variant="outlined" fullWidth onClick={() => navigate('/readings')}>
              Ver todas
            </Button>
          </Paper>
        </Grid>

        {/* Gráfico de Lecturas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Gráfico de Lecturas</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenReportDialog}
                disabled={!selectedSensor}
              >
                Descargar Reporte
              </Button>
            </Box>
            <FormControl sx={{ minWidth: 200, mb: 2 }}>
              <InputLabel>Seleccionar Sensor</InputLabel>
              <Select
                value={selectedSensor}
                label="Seleccionar Sensor"
                onChange={handleSensorChange}
              >
                {sensors.map(sensor => (
                  <MenuItem key={sensor.id} value={sensor.id}>
                    {sensor.tipo_sensor} - {sensor.modelo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getSensorReadings()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha_hora" />
                  <YAxis label={{ value: getSensorUnit(selectedSensor), angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#8884d8"
                    name={`Valor (${getSensorUnit(selectedSensor)})`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo para descargar reporte */}
      <Dialog open={openReportDialog} onClose={handleCloseReportDialog}>
        <DialogTitle>Descargar Reporte de Lecturas</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DatePicker
                label="Fecha Inicial"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="Fecha Final"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
              {reportError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {reportError}
                </Alert>
              )}
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportDialog}>Cancelar</Button>
          <Button onClick={handleDownloadReport} variant="contained" color="primary">
            Descargar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 