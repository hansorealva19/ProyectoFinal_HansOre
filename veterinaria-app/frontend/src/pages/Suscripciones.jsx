import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Suscripciones() {
  const [todasSuscripciones, setTodasSuscripciones] = useState([]);
  const [suscripcionesFiltradas, setSuscripcionesFiltradas] = useState([]);
  const [filtroDni, setFiltroDni] = useState('');
  const [mostrarVencidas, setMostrarVencidas] = useState(false);
  const [mostrarPorVencer, setMostrarPorVencer] = useState(false);

  // Cargar todas las suscripciones al montar el componente
  useEffect(() => {
    const fetchSuscripciones = async () => {
      try {
        const res = await api.get('/suscripciones');
        setTodasSuscripciones(res.data);
        setSuscripcionesFiltradas(res.data.filter(s => s.estado === 'activa'));
      } catch (err) {
        alert('Error al cargar suscripciones: ' + (err.response?.data?.error || err.message));
      }
    };
    fetchSuscripciones();
  }, []);

  // Filtrar suscripciones por DNI, vencidas y por vencer
  useEffect(() => {
    let filtradas = todasSuscripciones;

    if (filtroDni.trim() !== '') {
      filtradas = filtradas.filter(s => s.dni_dueno.includes(filtroDni.trim()));
    }

    if (mostrarVencidas) {
      filtradas = filtradas.filter(s => s.estado === 'vencida');
    } else if (mostrarPorVencer) {
      const hoy = new Date();
      const fechaLimite = new Date();
      fechaLimite.setDate(hoy.getDate() + 30);

      filtradas = filtradas.filter(s => {
        const fechaFin = new Date(s.fecha_fin);
        return fechaFin >= hoy && fechaFin <= fechaLimite && s.estado === 'activa';
      });
    } else {
      filtradas = filtradas.filter(s => s.estado === 'activa');
    }

    setSuscripcionesFiltradas(filtradas);
  }, [filtroDni, mostrarVencidas, mostrarPorVencer, todasSuscripciones]);

  // Datos para el gráfico de barras (activas vs vencidas)
  const activas = todasSuscripciones.filter(s => s.estado === 'activa').length;
  const vencidas = todasSuscripciones.filter(s => s.estado === 'vencida').length;

  const barData = {
    labels: ['Activas', 'Vencidas'],
    datasets: [
      {
        label: 'Cantidad de Suscripciones',
        data: [activas, vencidas],
        backgroundColor: ['#4caf50', '#f44336'], // Colores para activas y vencidas
      },
    ],
  };

  // Datos para el gráfico de líneas (por vencer en diferentes períodos)
  const pieData = {
    labels: ['Por vencer en 1 mes', 'Por vencer en 2 meses', 'Por vencer en 3 meses'],
    datasets: [
      {
        label: 'Suscripciones por vencer',
        data: [
          todasSuscripciones.filter(s => {
            const fechaFin = new Date(s.fecha_fin);
            const hoy = new Date();
            const limite = new Date();
            limite.setDate(hoy.getDate() + 30);
            return fechaFin >= hoy && fechaFin <= limite && s.estado === 'activa';
          }).length,
          todasSuscripciones.filter(s => {
            const fechaFin = new Date(s.fecha_fin);
            const hoy = new Date();
            const limite = new Date();
            limite.setDate(hoy.getDate() + 60);
            return fechaFin > new Date(hoy.setDate(hoy.getDate() + 30)) && fechaFin <= limite && s.estado === 'activa';
          }).length,
          todasSuscripciones.filter(s => {
            const fechaFin = new Date(s.fecha_fin);
            const hoy = new Date();
            const limite = new Date();
            limite.setDate(hoy.getDate() + 90);
            return fechaFin > new Date(hoy.setDate(hoy.getDate() + 60)) && fechaFin <= limite && s.estado === 'activa';
          }).length,
        ],
        backgroundColor: ['#ff9800', '#2196f3', '#9c27b0'], // Colores para los períodos
      },
    ],
  };

  return (
    <div className="container">
      <h3 className="mb-4 text-primary">Gestión de Suscripciones</h3>

      {/* Filtros */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title text-secondary">Filtros</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Filtrar por DNI del dueño</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese DNI"
                value={filtroDni}
                onChange={e => setFiltroDni(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check me-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="mostrarVencidas"
                  checked={mostrarVencidas}
                  onChange={e => {
                    setMostrarVencidas(e.target.checked);
                    if (e.target.checked) setMostrarPorVencer(false);
                  }}
                />
                <label className="form-check-label" htmlFor="mostrarVencidas">
                  Mostrar vencidas
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="mostrarPorVencer"
                  checked={mostrarPorVencer}
                  onChange={e => {
                    setMostrarPorVencer(e.target.checked);
                    if (e.target.checked) setMostrarVencidas(false);
                  }}
                />
                <label className="form-check-label" htmlFor="mostrarPorVencer">
                  Mostrar por vencer
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de suscripciones */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-secondary">Lista de Suscripciones</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Mascota</th>
                  <th>Dueño</th>
                  <th>DNI</th>
                  <th>Tipo</th>
                  <th>Precio</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {suscripcionesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No hay suscripciones para mostrar.
                    </td>
                  </tr>
                ) : (
                  suscripcionesFiltradas.map(s => (
                    <tr key={s.id}>
                      <td>{s.nombre_mascota}</td>
                      <td>{s.nombre_dueno}</td>
                      <td>{s.dni_dueno}</td>
                      <td>{s.tipo_nombre}</td>
                      <td>S/ {s.precio}</td>
                      <td>{s.fecha_inicio?.slice(0, 10)}</td>
                      <td>{s.fecha_fin?.slice(0, 10)}</td>
                      <td>
                        <span
                          className={`badge ${
                            s.estado === 'activa' ? 'bg-success' : 'bg-danger'
                          }`}
                        >
                          {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-secondary">Activas vs Vencidas</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-secondary">Por vencer en períodos</h5>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>          

    </div>
  );
}