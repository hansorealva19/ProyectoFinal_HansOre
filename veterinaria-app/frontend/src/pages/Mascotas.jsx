import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Mascotas({ setSelectedMascotaId }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.rol;

  const [mascotas, setMascotas] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    fecha_nacimiento: '',
    raza: '',
    especie: '',
    dueno_dni: ''
  });

  const [filtroDni, setFiltroDni] = useState('');
  const [mascotasFiltradas, setMascotasFiltradas] = useState([]);
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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await api.post('/mascotas', form);
      setForm({ nombre: '', fecha_nacimiento: '', raza: '', especie: '', dueno_dni: '' });
      fetchMascotas();
    } catch (err) {
      alert('Error al agregar mascota: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSelect = (id) => {
    navigate(`/mascotas/${id}/historia`);
    if (setSelectedMascotaId) setSelectedMascotaId(id);
  };

  return (
    <div className="container">
      <h2 className="mb-3">
        {userRole === 'veterinario' ? 'Todas las Mascotas' : 'Mis Mascotas'}
      </h2>
      <p className="mb-4">
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

      {/* Formulario para agregar mascota solo para veterinario */}
      {userRole === 'veterinario' && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Agregar Mascota</h5>
            <form onSubmit={handleAdd} className="row g-2 align-items-center">
              <div className="col-md-2">
                <input
                  name="nombre"
                  placeholder="Nombre"
                  className="form-control"
                  onChange={handleChange}
                  value={form.nombre}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="date"
                  name="fecha_nacimiento"
                  className="form-control"
                  onChange={handleChange}
                  value={form.fecha_nacimiento}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  name="raza"
                  placeholder="Raza"
                  className="form-control"
                  onChange={handleChange}
                  value={form.raza}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  name="especie"
                  placeholder="Especie"
                  className="form-control"
                  onChange={handleChange}
                  value={form.especie}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  name="dueno_dni"
                  placeholder="DNI del Dueño"
                  className="form-control"
                  onChange={handleChange}
                  value={form.dueno_dni}
                  required
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-success w-100">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de mascotas */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-light">
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