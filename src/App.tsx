import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AlertList from './pages/AlertList';
import AlertForm from './pages/AlertForm';
import SensorList from './pages/SensorList';
import SensorForm from './pages/SensorForm';
import ReadingList from './pages/ReadingList';
import ReadingForm from './pages/ReadingForm';
import ReportList from './pages/ReportList';
import ZonaForm from './pages/ZonaForm';
import EstacionForm from './pages/EstacionForm';
import ZonaList from './pages/ZonaList';
import EstacionList from './pages/EstacionList';
import Navigation from './components/Navigation';
import authService from './services/authService';
import './App.css';

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await authService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    };

    verifyAuth();
  }, [token]);

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navigation />
      <Box sx={{ mt: 2 }}>
        {children}
      </Box>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alerts" 
          element={
            <ProtectedRoute>
              <AlertList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alerts/new" 
          element={
            <ProtectedRoute>
              <AlertForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alerts/:id" 
          element={
            <ProtectedRoute>
              <AlertForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sensors" 
          element={
            <ProtectedRoute>
              <SensorList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sensors/new" 
          element={
            <ProtectedRoute>
              <SensorForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sensors/:id" 
          element={
            <ProtectedRoute>
              <SensorForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/readings" 
          element={
            <ProtectedRoute>
              <ReadingList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/readings/new" 
          element={
            <ProtectedRoute>
              <ReadingForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/readings/:id" 
          element={
            <ProtectedRoute>
              <ReadingForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <ReportList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/zonas" 
          element={
            <ProtectedRoute>
              <ZonaList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/zonas/new" 
          element={
            <ProtectedRoute>
              <ZonaForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/zonas/:id" 
          element={
            <ProtectedRoute>
              <ZonaForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/estaciones" 
          element={
            <ProtectedRoute>
              <EstacionList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/estaciones/new" 
          element={
            <ProtectedRoute>
              <EstacionForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/estaciones/:id" 
          element={
            <ProtectedRoute>
              <EstacionForm />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
