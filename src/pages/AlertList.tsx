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
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import alertService from '../services/alertService';

interface Alert {
  id: number;
  tipo_alerta: string;
  descripcion: string;
  nivel_alerta: string;
  fecha_hora: string;
  atendida: boolean;
  atendida_por: string | null;
  fecha_atencion: string | null;
  created_at: string;
  updated_at: string;
}

const AlertList: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const fetchAlerts = async () => {
    try {
      const response = await alertService.getAllAlerts({});
      setAlerts(response);
      setError(null);
    } catch (err) {
      setError('Error al cargar las alertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleEdit = (alert: Alert) => {
    navigate(`/alerts/${alert.id}`);
  };

  const handleDelete = (alert: Alert) => {
    setSelectedAlert(alert);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedAlert) {
      try {
        await alertService.deleteAlert(selectedAlert.id);
        await fetchAlerts();
        setError(null);
      } catch (err) {
        setError('Error al eliminar la alerta');
      }
    }
    setDeleteDialogOpen(false);
    setSelectedAlert(null);
  };

  const getAlertColor = (nivel: string) => {
    switch (nivel) {
      case 'alto':
        return 'error';
      case 'medio':
        return 'warning';
      case 'bajo':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Alertas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/alerts/new')}
          >
            Nueva Alerta
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
                <TableCell>Descripción</TableCell>
                <TableCell>Nivel</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.id}</TableCell>
                  <TableCell>{alert.tipo_alerta}</TableCell>
                  <TableCell>{alert.descripcion}</TableCell>
                  <TableCell>
                    <Chip
                      label={alert.nivel_alerta}
                      color={getAlertColor(alert.nivel_alerta)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(alert.fecha_hora).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={alert.atendida ? 'Atendida' : 'Pendiente'}
                      color={alert.atendida ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(alert)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(alert)}
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
          ¿Está seguro que desea eliminar la alerta {selectedAlert?.tipo_alerta}?
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

export default AlertList; 