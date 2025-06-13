import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Vacunas() {
  const [dni, setDni] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);
  const [catalogo, setCatalogo] = useState([]);
  const [form, setForm] = useState({ vacuna_id: '', fecha_aplicacion: '', fecha_vencimiento: '' });
  const [vacunasAplicadas, setVacunasAplicadas] = useState([]);

  // Buscar mascotas por DNI
  const buscarMascotas = async () => {
    try {
      const res = await api.get('/mascotas');
      const mascotasFiltradas = res.data.filter(m => m.dni === dni);
      setMascotas(mascotasFiltradas);
      setSelectedMascotaId(null);
      setVacunasAplicadas([]);
    } catch {
      alert('Error al buscar mascotas');
    }
  };

  // Cargar catálogo de vacunas
  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const res = await api.get('/vacuna-mascota/catalogo');
        setCatalogo(res.data);
      } catch {
        alert('Error al cargar catálogo de vacunas');
      }
    };
    fetchCatalogo();
  }, []);

  // Cargar vacunas aplicadas a la mascota seleccionada
  useEffect(() => {
    const fetchVacunas = async () => {
      if (!selectedMascotaId) return;
      try {
        const res = await api.get(`/vacuna-mascota/${selectedMascotaId}`);
        setVacunasAplicadas(res.data);
      } catch {
        alert('Error al cargar vacunas aplicadas');
      }
    };
    fetchVacunas();
  }, [selectedMascotaId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    if (!selectedMascotaId || !form.vacuna_id) {
      alert('Seleccione mascota y vacuna');
      return;
    }
    try {
      await api.post('/vacuna-mascota', {
        ...form,
        mascota_id: selectedMascotaId
      });
      setForm({ vacuna_id: '', fecha_aplicacion: '', fecha_vencimiento: '' });
      const res = await api.get(`/vacuna-mascota/${selectedMascotaId}`);
      setVacunasAplicadas(res.data);
    } catch {
      alert('Error al registrar vacuna');
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Registrar Vacunación</h3>
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

      {/* Paso 3: Formulario de vacunación */}
      {selectedMascotaId && (
        <form onSubmit={handleAdd} className="row g-2 align-items-center mb-4">
          <div className="col-md-4">
            <select
              name="vacuna_id"
              value={form.vacuna_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Seleccione vacuna</option>
              {catalogo.map(v => (
                <option key={v.id} value={v.id}>
                  {v.nombre} ({v.especie_destino}) - S/ {v.precio}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="date"
              name="fecha_aplicacion"
              className="form-control"
              onChange={handleChange}
              value={form.fecha_aplicacion}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              name="fecha_vencimiento"
              className="form-control"
              onChange={handleChange}
              value={form.fecha_vencimiento}
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100">Registrar Vacuna</button>
          </div>
        </form>
      )}

      {/* Catálogo de vacunas solo informativo */}
      <h4>Catálogo de Vacunas</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Vacuna</th>
            <th>Especie</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {catalogo.map(v => (
            <tr key={v.id}>
              <td>{v.nombre}</td>
              <td>{v.especie_destino}</td>
              <td>S/ {v.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paso 4: Historial de vacunas aplicadas */}
      {selectedMascotaId && (
        <div>
          <h4>Vacunas Aplicadas</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Vacuna</th>
                <th>Aplicada</th>
                <th>Vence</th>
                <th>Fabricante</th>
              </tr>
            </thead>
            <tbody>
              {vacunasAplicadas.map(v => (
                <tr key={v.id}>
                  <td>{v.nombre_vacuna}</td>
                  <td>{v.fecha_aplicacion?.slice(0,10)}</td>
                  <td>{v.fecha_vencimiento?.slice(0,10)}</td>
                  <td>{v.fabricante}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}