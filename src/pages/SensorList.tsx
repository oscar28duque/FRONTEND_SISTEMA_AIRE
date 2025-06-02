import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import sensorService from '../services/sensorService';

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

const SensorList: React.FC = () => {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const fetchSensors = async () => {
    try {
      const response = await sensorService.getAllSensors();
      setSensors(response);
      setError(null);
    } catch (err) {
      setError('Error al cargar los sensores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleEdit = (sensor: Sensor) => {
    navigate(`/sensors/${sensor.id}`);
  };

  const handleDelete = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSensor) {
      try {
        await sensorService.deleteSensor(selectedSensor.id);
        await fetchSensors();
        setError(null);
      } catch (err) {
        setError('Error al eliminar el sensor');
      }
    }
    setDeleteDialogOpen(false);
    setSelectedSensor(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Sensores
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/sensors/new')}
          >
            Nuevo Sensor
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Estación</TableCell>
                <TableCell>Rango</TableCell>
                <TableCell>Última Calibración</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell>{sensor.id}</TableCell>
                  <TableCell>{sensor.tipo_sensor}</TableCell>
                  <TableCell>{sensor.modelo}</TableCell>
                  <TableCell>{sensor.estado}</TableCell>
                  <TableCell>{sensor.estacion}</TableCell>
                  <TableCell>
                    {sensor.rango_minimo && sensor.rango_maximo
                      ? `${sensor.rango_minimo} - ${sensor.rango_maximo} ${sensor.unidad_medida || ''}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {sensor.fecha_ultima_calibracion
                      ? new Date(sensor.fecha_ultima_calibracion).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(sensor)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(sensor)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          ¿Está seguro que desea eliminar el sensor {selectedSensor?.tipo_sensor} - {selectedSensor?.modelo}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SensorList; 