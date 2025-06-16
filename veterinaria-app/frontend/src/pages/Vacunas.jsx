import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Vacunas() {
  const [catalogo, setCatalogo] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarVacunas, setMostrarVacunas] = useState(false);
  const [mostrarGrafico, setMostrarGrafico] = useState(false); // Controla la visibilidad del gráfico
  const [mensaje, setMensaje] = useState('');
  const [umbral, setUmbral] = useState(10); // Umbral de stock para el gráfico

  // Cargar catálogo de vacunas
  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const res = await api.get('/vacunas/catalogo');
        setCatalogo(res.data);
      } catch {
        setMensaje('Error al cargar catálogo de vacunas');
      }
    };
    fetchCatalogo();
  }, []);

  const handleAumentarStock = async (id, cantidad) => {
    try {
      await api.put(`/vacunas/catalogo/${id}/stock`, { cantidad });
      setMensaje('Stock actualizado correctamente');
      const res = await api.get('/vacunas/catalogo');
      setCatalogo(res.data);
    } catch {
      setMensaje('Error al actualizar stock');
    }
  };

  // Calcular datos para el gráfico
  const vacunasPorEncima = catalogo.filter(v => v.stock >= umbral).length;
  const vacunasPorDebajo = catalogo.filter(v => v.stock < umbral).length;
  const vacunasDebajoUmbral = catalogo.filter(v => v.stock < umbral); // Vacunas por debajo del umbral

  const data = {
    labels: ['Por encima del umbral', 'Por debajo del umbral'],
    datasets: [
      {
        data: [vacunasPorEncima, vacunasPorDebajo],
        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} vacunas`;
          }
        }
      }
    }
  };

  // Configuración de Formik y Yup
  const formik = useFormik({
    initialValues: {
      nombre: '',
      especie_destino: '',
      precio: '',
      fabricante: '',
      descripcion: '',
      stock: 0
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .required('El nombre es obligatorio'),
      especie_destino: Yup.string()
        .min(2, 'La especie destino debe tener al menos 2 caracteres')
        .required('La especie destino es obligatoria'),
      precio: Yup.number()
        .min(0, 'El precio debe ser mayor o igual a 0')
        .required('El precio es obligatorio'),
      fabricante: Yup.string()
        .min(2, 'El fabricante debe tener al menos 2 caracteres')
        .required('El fabricante es obligatorio'),
      descripcion: Yup.string()
        .min(5, 'La descripción debe tener al menos 5 caracteres')
        .required('La descripción es obligatoria'),
      stock: Yup.number()
        .min(0, 'El stock debe ser mayor o igual a 0')
        .required('El stock es obligatorio')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await api.post('/vacunas/catalogo', values);
        setMensaje('Vacuna registrada correctamente');
        resetForm();
        setMostrarFormulario(false);
        const res = await api.get('/vacunas/catalogo');
        setCatalogo(res.data);
      } catch {
        setMensaje('Error al registrar vacuna');
      }
    }
  });

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">Catálogo de Vacunas</h2>
        </div>
        <div className="card-body">
          {mensaje && <div className="alert alert-info">{mensaje}</div>}

          {/* Botones principales */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              {mostrarFormulario ? 'Cancelar' : 'Agregar Nueva Vacuna'}
            </button>
            <button
              className={`btn ${mostrarVacunas ? 'btn-secondary' : 'btn-success'}`}
              onClick={() => setMostrarVacunas(!mostrarVacunas)}
            >
              {mostrarVacunas ? 'Ocultar Vacunas' : 'Mostrar Vacunas'}
            </button>
            <button
              className={`btn ${mostrarGrafico ? 'btn-secondary' : 'btn-info'}`}
              onClick={() => setMostrarGrafico(!mostrarGrafico)}
            >
              {mostrarGrafico ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
            </button>
          </div>

          {/* Formulario para agregar vacunas */}
          {mostrarFormulario && (
            <form onSubmit={formik.handleSubmit} className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  name="nombre"
                  className={`form-control ${formik.touched.nombre && formik.errors.nombre ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nombre}
                />
                {formik.touched.nombre && formik.errors.nombre && (
                  <div className="invalid-feedback">{formik.errors.nombre}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">Especie Destino</label>
                <input
                  name="especie_destino"
                  className={`form-control ${formik.touched.especie_destino && formik.errors.especie_destino ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.especie_destino}
                />
                {formik.touched.especie_destino && formik.errors.especie_destino && (
                  <div className="invalid-feedback">{formik.errors.especie_destino}</div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  name="precio"
                  className={`form-control ${formik.touched.precio && formik.errors.precio ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.precio}
                />
                {formik.touched.precio && formik.errors.precio && (
                  <div className="invalid-feedback">{formik.errors.precio}</div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  className={`form-control ${formik.touched.stock && formik.errors.stock ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.stock}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <div className="invalid-feedback">{formik.errors.stock}</div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Fabricante</label>
                <input
                  name="fabricante"
                  className={`form-control ${formik.touched.fabricante && formik.errors.fabricante ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fabricante}
                />
                {formik.touched.fabricante && formik.errors.fabricante && (
                  <div className="invalid-feedback">{formik.errors.fabricante}</div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className={`form-control ${formik.touched.descripcion && formik.errors.descripcion ? 'is-invalid' : ''}`}
                  rows="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.descripcion}
                ></textarea>
                {formik.touched.descripcion && formik.errors.descripcion && (
                  <div className="invalid-feedback">{formik.errors.descripcion}</div>
                )}
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success w-100">Registrar Vacuna</button>
              </div>
            </form>
          )}

          {/* Tabla de vacunas */}
          {mostrarVacunas && (
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Vacuna</th>
                  <th>Especie</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Fabricante</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {catalogo.map(v => (
                  <tr key={v.id}>
                    <td>{v.nombre}</td>
                    <td>{v.especie_destino}</td>
                    <td>S/ {v.precio}</td>
                    <td>{v.stock}</td>
                    <td>{v.fabricante}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          const cantidad = prompt(
                            'Ingrese la cantidad a agregar al stock:'
                          );
                          if (cantidad && !isNaN(cantidad))
                            handleAumentarStock(v.id, parseInt(cantidad, 10));
                        }}
                      >
                        Aumentar Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Gráfico de stock */}
          {mostrarGrafico && (
            <div className="mt-4 d-flex flex-column align-items-center">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <label className="me-3">Umbral de Stock:</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  step="1"
                  value={umbral}
                  onChange={e => setUmbral(Number(e.target.value))}
                  style={{ width: '300px' }}
                />
                <span className="ms-3 fw-bold">{umbral}</span>
              </div>
              <div style={{ width: '400px', height: '400px' }}>
                <Doughnut data={data} options={options} />
              </div>

              {/* Tabla de vacunas por debajo del umbral */}
              <div className="mt-4 w-100">
                <h5 className="text-center text-danger">Vacunas por debajo del umbral</h5>
                <table className="table table-hover">
                  <thead className="table-danger">
                    <tr>
                      <th>Vacuna</th>
                      <th>Especie</th>
                      <th>Stock</th>
                      <th>Fabricante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vacunasDebajoUmbral.map(v => (
                      <tr key={v.id}>
                        <td>{v.nombre}</td>
                        <td>{v.especie_destino}</td>
                        <td>{v.stock}</td>
                        <td>{v.fabricante}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}