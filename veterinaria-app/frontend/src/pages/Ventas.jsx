import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import api from '../services/api';
import 'chart.js/auto';

export default function Ventas() {
  const [ventas, setVentas] = useState({});
  const [filtroVeterinario, setFiltroVeterinario] = useState('todos');

    // Carga las ventas diarias desde el backend al montar el componente.
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await api.get('/carrito/ventas-diarias');
        setVentas(res.data);
      } catch (err) {
        console.error('Error al cargar ventas:', err.message);
      }
    };
    fetchVentas();
  }, []);

  // Obtener veterinarios únicos para el filtro
  const veterinariosUnicos = Object.keys(ventas);

  // Filtrar datos según el veterinario seleccionado
  const ventasFiltradas =
    filtroVeterinario === 'todos'
      ? Object.entries(ventas)
      : [[filtroVeterinario, ventas[filtroVeterinario] || []]]; // Asegurarse de que sea un array

  // Formatear las fechas para que sean más legibles
  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  // Agrupar ventas por fecha
  const ventasAgrupadasPorFecha = ventasFiltradas.reduce((acc, [_, ventas]) => {
    ventas.forEach((venta) => {
      const fechaFormateada = formatearFecha(venta.fecha);
      if (!acc[fechaFormateada]) {
        acc[fechaFormateada] = { vacunas: 0, suscripciones: 0 };
      }
      if (venta.tipo === 'vacuna') {
        acc[fechaFormateada].vacunas += Number(venta.total) || 0; // Asegurarse de que sea un número
      } else if (venta.tipo === 'suscripcion') {
        acc[fechaFormateada].suscripciones += Number(venta.total) || 0; // Asegurarse de que sea un número
      }
    });
    return acc;
  }, {});

  // Ordenar las fechas de menor a mayor
  const fechasOrdenadas = Object.keys(ventasAgrupadasPorFecha).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Datos para el gráfico de barras
  const barData = {
    labels: fechasOrdenadas, // Fechas ordenadas
    datasets: [
      {
        label: 'Vacunas',
        data: fechasOrdenadas.map((fecha) => ventasAgrupadasPorFecha[fecha].vacunas),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Suscripciones',
        data: fechasOrdenadas.map((fecha) => ventasAgrupadasPorFecha[fecha].suscripciones),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico lineal (ingresos totales por día)
  const lineData = {
    labels: fechasOrdenadas, // Fechas ordenadas
    datasets: [
      {
        label: 'Ingresos Totales',
        data: fechasOrdenadas.map(
          (fecha) =>
            ventasAgrupadasPorFecha[fecha].vacunas +
            ventasAgrupadasPorFecha[fecha].suscripciones
        ),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.4, // Suavizar las líneas
      },
    ],
  };

  // Datos para el gráfico de torta (proporción de ingresos totales)
  const totalVacunas = fechasOrdenadas.reduce(
    (sum, fecha) => sum + ventasAgrupadasPorFecha[fecha].vacunas,
    0
  );
  const totalSuscripciones = fechasOrdenadas.reduce(
    (sum, fecha) => sum + ventasAgrupadasPorFecha[fecha].suscripciones,
    0
  );

  const pieData = {
    labels: ['Vacunas', 'Suscripciones'],
    datasets: [
      {
        data: [totalVacunas, totalSuscripciones],
        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Dashboard de Ventas Diarias</h2>

      {/* Filtro por veterinario */}
      <div className="row mb-4">
        <div className="col-md-4 offset-md-4">
          <label className="form-label">Filtrar por Veterinario</label>
          <select
            className="form-select"
            value={filtroVeterinario}
            onChange={(e) => setFiltroVeterinario(e.target.value)}
          >
            <option value="todos">Todos</option>
            {veterinariosUnicos.map((veterinario) => (
              <option key={veterinario} value={veterinario}>
                {veterinario}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="text-center">Ventas Diarias (Gráfico de Barras)</h5>
            <Bar data={barData} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="text-center">Ingresos Totales por Día (Gráfico Lineal)</h5>
            <Line data={lineData} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow-sm p-3 mb-4">
            <h5 className="text-center">Proporción de Ingresos (Gráfico de Torta)</h5>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}