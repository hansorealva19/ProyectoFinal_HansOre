import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Suscripciones() {
  const [dni, setDni] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ tipo_id: '', fecha_inicio: '', fecha_fin: '' });
  const [suscripcionesMascota, setSuscripcionesMascota] = useState([]);
  const [todasSuscripciones, setTodasSuscripciones] = useState([]);

  // Buscar mascotas por DNI
  const buscarMascotas = async () => {
    try {
      const res = await api.get('/mascotas');
      const mascotasFiltradas = res.data.filter(m => m.dni === dni);
      setMascotas(mascotasFiltradas);
      setSelectedMascotaId(null);
      setSuscripcionesMascota([]);
    } catch {
      alert('Error al buscar mascotas');
    }
  };

  // Cargar tipos de suscripción
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await api.get('/tipo-suscripcion');
        setTipos(res.data);
      } catch {
        alert('Error al cargar tipos de suscripción');
      }
    };
    fetchTipos();
  }, []);

  // Cargar suscripciones de la mascota seleccionada
  useEffect(() => {
    const fetchSuscripciones = async () => {
      if (!selectedMascotaId) return;
      try {
        const res = await api.get(`/suscripciones/${selectedMascotaId}`);
        setSuscripcionesMascota(res.data);
      } catch {
        alert('Error al cargar suscripciones');
      }
    };
    fetchSuscripciones();
  }, [selectedMascotaId]);

  // Cargar todas las suscripciones
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/suscripciones');
        setTodasSuscripciones(res.data);
      } catch {
        alert('Error al cargar todas las suscripciones');
      }
    };
    fetchAll();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    if (!selectedMascotaId || !form.tipo_id) {
      alert('Seleccione mascota y tipo de suscripción');
      return;
    }
    try {
      await api.post('/suscripciones', {
        ...form,
        mascota_id: selectedMascotaId
      });
      setForm({ tipo_id: '', fecha_inicio: '', fecha_fin: '' });
      const res = await api.get(`/suscripciones/${selectedMascotaId}`);
      setSuscripcionesMascota(res.data);
      // Refresca la tabla general también
      const all = await api.get('/suscripciones');
      setTodasSuscripciones(all.data);
    } catch {
      alert('Error al agregar suscripción');
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Gestión de Suscripciones</h2>

      {/* Sección: Todas las suscripciones */}
      <section className="mb-5">
        <h3>Todas las Suscripciones</h3>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
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
              {todasSuscripciones.map(s => (
                <tr key={s.id}>
                  <td>{s.nombre_mascota}</td>
                  <td>{s.nombre_dueno}</td>
                  <td>{s.dni_dueno}</td>
                  <td>{s.tipo_nombre}</td>
                  <td>S/ {s.precio}</td>
                  <td>{s.fecha_inicio?.slice(0,10)}</td>
                  <td>{s.fecha_fin?.slice(0,10)}</td>
                  <td>{s.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sección: Asignar nueva suscripción */}
      <section>
        <h3>Asignar Nueva Suscripción</h3>
        {/* Paso 1: Buscar dueño por DNI */}
        <div className="mb-3 d-flex align-items-center">
          <input
            type="text"
            placeholder="DNI del dueño"
            value={dni}
            onChange={e => setDni(e.target.value)}
            className="form-control me-2"
            style={{ maxWidth: 220 }}
          />
          <button onClick={buscarMascotas} disabled={!dni} className="btn btn-primary">
            Buscar Mascotas
          </button>
        </div>

        {/* Paso 2: Mostrar mascotas del dueño */}
        {mascotas.length > 0 && (
          <div className="mb-3">
            <strong>Seleccione una mascota:</strong>
            <ul className="list-group mt-2">
              {mascotas.map(m => (
                <li
                  key={m.id}
                  onClick={() => setSelectedMascotaId(m.id)}
                  className={`list-group-item list-group-item-action${m.id === selectedMascotaId ? ' active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {m.nombre} - {m.raza} - {m.especie}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Paso 3: Formulario de suscripción */}
        {selectedMascotaId && (
          <form onSubmit={handleAdd} className="row g-2 align-items-center mb-4">
            <div className="col-md-4">
              <select
                name="tipo_id"
                value={form.tipo_id}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Seleccione tipo de suscripción</option>
                {tipos.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} - S/ {t.precio}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="date"
                name="fecha_inicio"
                className="form-control"
                onChange={handleChange}
                value={form.fecha_inicio}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                name="fecha_fin"
                className="form-control"
                onChange={handleChange}
                value={form.fecha_fin}
                required
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100">Agregar Suscripción</button>
            </div>
          </form>
        )}

        {/* Paso 4: Historial de suscripciones de la mascota */}
        {selectedMascotaId && (
          <div>
            <h4>Suscripciones de la Mascota</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {suscripcionesMascota.map(s => (
                  <tr key={s.id}>
                    <td>{tipos.find(t => t.id === s.tipo_id)?.nombre || s.tipo_id}</td>
                    <td>{s.fecha_inicio?.slice(0,10)}</td>
                    <td>{s.fecha_fin?.slice(0,10)}</td>
                    <td>{s.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}