import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Mascotas from './pages/Mascotas';
import Consultas from './pages/Consultas';
import Vacunas from './pages/Vacunas';
import Suscripciones from './pages/Suscripciones';
import HistoriaClinica from './pages/HistoriaClinica';

import { useState } from 'react';

// Componente para rutas protegidas
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/" element={<Layout />}>
          {/* Rutas públicas */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Rutas privadas */}
          <Route
            path="mascotas"
            element={
              <PrivateRoute>
                <Mascotas setSelectedMascotaId={setSelectedMascotaId} />
              </PrivateRoute>
            }
          />

          <Route
            path="mascotas/:id/historia"
            element={
              <PrivateRoute>
                <HistoriaClinica />
              </PrivateRoute>
            }
          />

          <Route
            path="consultas"
            element={
              <PrivateRoute>
                <Consultas mascotaId={selectedMascotaId} />
              </PrivateRoute>
            }
          />

          <Route
            path="vacunas"
            element={
              <PrivateRoute>
                <Vacunas mascotaId={selectedMascotaId} />
              </PrivateRoute>
            }
          />

          <Route
            path="suscripciones"
            element={
              <PrivateRoute>
                <Suscripciones mascotaId={selectedMascotaId} />
              </PrivateRoute>
            }
          />

          {/* Redirigir cualquier ruta desconocida al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;