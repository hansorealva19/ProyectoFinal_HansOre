import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

export default function Mascotas({ setSelectedMascotaId }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.rol;

  const [mascotas, setMascotas] = useState([]);
  const [filtroDni, setFiltroDni] = useState('');
  const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Controla la visibilidad del formulario
  const navigate = useNavigate();

  // Cargar mascotas (todas o solo las del dueño)
  const fetchMascotas = async () => {
    try {
      const res = await api.get('/mascotas');
      setMascotas(res.data);
      setMascotasFiltradas(res.data);
    } catch (err) {
      alert('Error al cargar mascotas: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchMascotas();
  }, []);

  // Filtrar mascotas por DNI (solo para veterinario)
  useEffect(() => {
    if (userRole === 'veterinario' && filtroDni.trim() !== '') {
      setMascotasFiltradas(
        mascotas.filter(m => m.dni && m.dni.includes(filtroDni.trim()))
      );
    } else {
      setMascotasFiltradas(mascotas);
    }
  }, [filtroDni, mascotas, userRole]);

  const handleSelect = (id) => {
    navigate(`/mascotas/${id}/historia`);
    if (setSelectedMascotaId) setSelectedMascotaId(id);
  };

  // Configuración de Formik y Yup
  const formik = useFormik({
    initialValues: {
      nombre: '',
      fecha_nacimiento: '',
      raza: '',
      especie: '',
      dueno_dni: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder los 50 caracteres')
        .required('El nombre es obligatorio'),
      fecha_nacimiento: Yup.date()
        .required('La fecha de nacimiento es obligatoria'),
      raza: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'La raza solo puede contener letras')
        .min(2, 'La raza debe tener al menos 2 caracteres')
        .required('La raza es obligatoria'),
      especie: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'La especie solo puede contener letras')
        .min(2, 'La especie debe tener al menos 2 caracteres')
        .required('La especie es obligatoria'),
      dueno_dni: Yup.string()
        .matches(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos')
        .required('El DNI del dueño es obligatorio')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await api.post('/mascotas', values);
        fetchMascotas();
        resetForm();
        setMostrarFormulario(false); // Ocultar formulario después de agregar
      } catch (err) {
        alert('Error al agregar mascota: ' + (err.response?.data?.error || err.message));
      }
    }
  });

  const handleCancel = () => {
    formik.resetForm(); // Restablecer el formulario
    setMostrarFormulario(false); // Ocultar el formulario
  };

  return (
    <div className="container">
      <h2 className="mb-3 text-primary">
        {userRole === 'veterinario' ? 'Todas las Mascotas' : 'Mis Mascotas'}
      </h2>
      <p className="mb-4 text-secondary">
        {userRole === 'veterinario'
          ? 'Aquí se muestran todas las mascotas registradas en el sistema. Puedes filtrar por DNI del dueño para encontrar mascotas específicas.'
          : 'Aquí se muestran tus mascotas.'}
      </p>

      {/* Filtro por DNI solo para veterinario */}
      {userRole === 'veterinario' && (
        <div className="mb-4 d-flex align-items-center">
          <input
            type="text"
            placeholder="Filtrar por DNI del dueño"
            value={filtroDni}
            onChange={e => setFiltroDni(e.target.value)}
            className="form-control me-2"
            style={{ maxWidth: 220 }}
          />
          <button
            onClick={() => setFiltroDni('')}
            className="btn btn-outline-secondary"
            disabled={filtroDni === ''}
          >
            Limpiar filtro
          </button>
        </div>
      )}

      {/* Botón para mostrar/ocultar formulario */}
      {userRole === 'veterinario' && (
        <div className="mb-4">
          <button
            className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? 'Ocultar Formulario' : 'Agregar Mascota'}
          </button>
        </div>
      )}

      {/* Formulario para agregar mascota solo para veterinario */}
      {userRole === 'veterinario' && mostrarFormulario && (
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title mb-3 text-primary">Agregar Mascota</h5>
            <form onSubmit={formik.handleSubmit} className="row g-3">
              <div className="col-md-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  id="nombre"
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
              <div className="col-md-3">
                <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                <input
                  id="fecha_nacimiento"
                  type="date"
                  name="fecha_nacimiento"
                  className={`form-control ${formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fecha_nacimiento}
                />
                {formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento && (
                  <div className="invalid-feedback">{formik.errors.fecha_nacimiento}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="raza" className="form-label">Raza</label>
                <input
                  id="raza"
                  name="raza"
                  className={`form-control ${formik.touched.raza && formik.errors.raza ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.raza}
                />
                {formik.touched.raza && formik.errors.raza && (
                  <div className="invalid-feedback">{formik.errors.raza}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="especie" className="form-label">Especie</label>
                <input
                  id="especie"
                  name="especie"
                  className={`form-control ${formik.touched.especie && formik.errors.especie ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.especie}
                />
                {formik.touched.especie && formik.errors.especie && (
                  <div className="invalid-feedback">{formik.errors.especie}</div>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="dueno_dni" className="form-label">DNI del Dueño</label>
                <input
                  id="dueno_dni"
                  name="dueno_dni"
                  className={`form-control ${formik.touched.dueno_dni && formik.errors.dueno_dni ? 'is-invalid' : ''}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dueno_dni}
                />
                {formik.touched.dueno_dni && formik.errors.dueno_dni && (
                  <div className="invalid-feedback">{formik.errors.dueno_dni}</div>
                )}
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-success w-100 mt-4">Agregar</button>
              </div>
              <div className="col-md-3">
                <button
                  type="button"
                  className="btn btn-danger w-100 mt-4"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de mascotas */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>Raza</th>
              <th>Especie</th>
              <th>Fecha Nacimiento</th>
              {userRole === 'veterinario' && <th>Dueño</th>}
              {userRole === 'veterinario' && <th>DNI</th>}
              <th>Historia Clínica</th>
            </tr>
          </thead>
          <tbody>
            {mascotasFiltradas.length === 0 && (
              <tr>
                <td colSpan={userRole === 'veterinario' ? 7 : 5} className="text-center text-muted">
                  No hay mascotas para mostrar.
                </td>
              </tr>
            )}
            {mascotasFiltradas.map(m => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.raza}</td>
                <td>{m.especie}</td>
                <td>{m.fecha_nacimiento?.slice(0, 10)}</td>
                {userRole === 'veterinario' && <td>{m.nombre_dueño}</td>}
                {userRole === 'veterinario' && <td>{m.dni}</td>}
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={e => { e.stopPropagation(); handleSelect(m.id); }}
                  >
                    Ver Historia Clínica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}