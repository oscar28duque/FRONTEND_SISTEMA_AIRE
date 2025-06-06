import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Alert,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface Estacion {
  id: number;
  nombre_estacion: string;
  ubicacion: string;
  latitud: number | null;
  longitud: number | null;
  zona: number;
  zona_nombre: string;
  is_active: boolean;
}

const EstacionList: React.FC = () => {
  const navigate = useNavigate();
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEstaciones();
  }, []);

  const fetchEstaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/estaciones/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEstaciones(response.data);
    } catch (err) {
      console.error('Error al cargar las estaciones:', err);
      setError('Error al cargar las estaciones. Por favor, intente nuevamente.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta estación?')) {
      try {
        await axios.delete(`${API_URL}/estaciones/${id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchEstaciones();
      } catch (err) {
        console.error('Error al eliminar la estación:', err);
        setError('Error al eliminar la estación. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Estaciones
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/estaciones/new')}
          >
            Nueva Estación
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
                <TableCell>Nombre</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Zona</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estaciones.map((estacion) => (
                <TableRow key={estacion.id}>
                  <TableCell>{estacion.id}</TableCell>
                  <TableCell>{estacion.nombre_estacion}</TableCell>
                  <TableCell>{estacion.ubicacion}</TableCell>
                  <TableCell>{estacion.zona_nombre}</TableCell>
                  <TableCell>
                    <Chip
                      label={estacion.is_active ? 'Activa' : 'Inactiva'}
                      color={estacion.is_active ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/estaciones/${estacion.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(estacion.id)}
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
    </Container>
  );
};

export default EstacionList; 