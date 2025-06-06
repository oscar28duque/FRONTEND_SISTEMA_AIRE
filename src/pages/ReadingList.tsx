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
import readingService from '../services/readingService';
import sensorService from '../services/sensorService';

interface Reading {
  id: number;
  sensor: number;
  valor: number;
  fecha_hora: string;
  calidad_dato: string;
  created_at: string;
  updated_at: string;
}

interface Sensor {
  id: number;
  tipo_sensor: string;
  modelo: string;
  unidad_medida: string | null;
}

const ReadingList: React.FC = () => {
  const navigate = useNavigate();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);

  const fetchData = async () => {
    try {
      const [readingsResponse, sensorsResponse] = await Promise.all([
        readingService.getAllReadings({}),
        sensorService.getAllSensors(),
      ]);
      setReadings(readingsResponse);
      setSensors(sensorsResponse);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (reading: Reading) => {
    navigate(`/readings/${reading.id}`);
  };

  const handleDelete = (reading: Reading) => {
    setSelectedReading(reading);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedReading) {
      try {
        await readingService.deleteReading(selectedReading.id);
        await fetchData();
        setError(null);
      } catch (err) {
        setError('Error al eliminar la lectura');
      }
    }
    setDeleteDialogOpen(false);
    setSelectedReading(null);
  };

  const handleNewReading = () => {
    navigate('/readings/new');
  };

  const getSensorInfo = (sensorId: number) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? `${sensor.tipo_sensor} - ${sensor.modelo}` : 'N/A';
  };

  const getSensorUnit = (sensorId: number) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor?.unidad_medida || '';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Lecturas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewReading}
          >
            Nueva Lectura
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
                <TableCell>Sensor</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Calidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>{reading.id}</TableCell>
                  <TableCell>{getSensorInfo(reading.sensor)}</TableCell>
                  <TableCell>
                    {reading.valor} {getSensorUnit(reading.sensor)}
                  </TableCell>
                  <TableCell>
                    {new Date(reading.fecha_hora).toLocaleString()}
                  </TableCell>
                  <TableCell>{reading.calidad_dato}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(reading)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(reading)}
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
          ¿Está seguro que desea eliminar la lectura del sensor {selectedReading && getSensorInfo(selectedReading.sensor)}?
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

export default ReadingList; 