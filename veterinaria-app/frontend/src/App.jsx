import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Mascotas from './pages/Mascotas';
import Consultas from './pages/Consultas';
import Vacunas from './pages/Vacunas';
import Suscripciones from './pages/Suscripciones';
import HistoriaClinica from './pages/HistoriaClinica';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import Ventas from './pages/Ventas';

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/mascotas" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="mascotas"
            element={
              <PrivateRoute roles={['dueño', 'veterinario']}>
                <Mascotas />
              </PrivateRoute>
            }
          />
          <Route
            path="mascotas/:id/historia"
            element={
              <PrivateRoute roles={['dueño', 'veterinario']}>
                <HistoriaClinica />
              </PrivateRoute>
            }
          />
          <Route
            path="consultas"
            element={
              <PrivateRoute roles={['veterinario']}>
                <Consultas />
              </PrivateRoute>
            }
          />
          <Route
            path="vacunas"
            element={
              <PrivateRoute roles={['veterinario']}>
                <Vacunas />
              </PrivateRoute>
            }
          />
          <Route
            path="suscripciones"
            element={
              <PrivateRoute roles={['veterinario']}>
                <Suscripciones />
              </PrivateRoute>
            }
          />
          <Route
            path="carrito"
            element={
              <PrivateRoute roles={['veterinario']}>
                <Carrito />
              </PrivateRoute>
            }
          />

          <Route
            path="ventas"
            element={
              <PrivateRoute roles={['veterinario']}>
                <Ventas />
              </PrivateRoute>
            }
          />

          <Route
            path="perfil"
            element={
              <PrivateRoute roles={['dueño', 'veterinario']}>
                <Perfil />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}