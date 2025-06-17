import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Consultas() {
  const [dni, setDni] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [form, setForm] = useState({ sintomas: '', diagnostico: '', tratamiento: '', fecha: '' });
  const [editando, setEditando] = useState(false);
  const [consultaId, setConsultaId] = useState(null);
  // Filtra las mascotas asociadas al dueño con el DNI proporcionado.
  const buscarMascotas = async () => {
    try {
      const res = await api.get('/mascotas');
      const mascotasFiltradas = res.data.filter(m => m.dni === dni);
      setMascotas(mascotasFiltradas);
      setSelectedMascotaId(null);
      setConsultas([]);
    } catch {
      alert('Error al buscar mascotas');
    }
  };
  // Carga las consultas asociadas a la mascota seleccionada.
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const res = await api.get(`/consultas/${selectedMascotaId}`);
        setConsultas(res.data);
      } catch {
        alert('Error al cargar consultas');
      }
    };
    if (selectedMascotaId) fetchConsultas();
  }, [selectedMascotaId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  // Registra una nueva consulta o actualiza una existente.
  const handleAdd = async e => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/consultas/${consultaId}`, { ...form, mascota_id: selectedMascotaId });
        alert('Consulta actualizada correctamente');
      } else {
        await api.post('/consultas', { ...form, mascota_id: selectedMascotaId });
        alert('Consulta registrada correctamente');
      }
      setForm({ sintomas: '', diagnostico: '', tratamiento: '', fecha: '' });
      setEditando(false);
      setConsultaId(null);
      const res = await api.get(`/consultas/${selectedMascotaId}`);
      setConsultas(res.data);
    } catch {
      alert('Error al guardar la consulta');
    }
  };
  // Carga los datos de una consulta en el formulario para editarla.
  // Cambia el estado editando a true y almacena el ID de la consulta.
  const handleEdit = (consulta) => {
    setForm({
      sintomas: consulta.sintomas,
      diagnostico: consulta.diagnostico,
      tratamiento: consulta.tratamiento,
      fecha: consulta.fecha?.slice(0, 10),
    });
    setEditando(true);
    setConsultaId(consulta.id);
  };
  
  const handleCancelEdit = () => {
    setForm({ sintomas: '', diagnostico: '', tratamiento: '', fecha: '' });
    setEditando(false);
    setConsultaId(null);
  };

  return (
    <div className="container">
      <h3 className="mb-4">Registrar Consulta</h3>
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

      {selectedMascotaId && (
        <form onSubmit={handleAdd} className="mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Fecha</label>
              <input
                name="fecha"
                type="date"
                className="form-control"
                onChange={handleChange}
                value={form.fecha}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Síntomas</label>
              <input
                name="sintomas"
                placeholder="Síntomas"
                className="form-control"
                onChange={handleChange}
                value={form.sintomas}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Diagnóstico</label>
              <input
                name="diagnostico"
                placeholder="Diagnóstico"
                className="form-control"
                onChange={handleChange}
                value={form.diagnostico}
                required
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label">Tratamiento</label>
            <textarea
              name="tratamiento"
              placeholder="Describa el tratamiento"
              className="form-control"
              rows={4}
              onChange={handleChange}
              value={form.tratamiento}
              required
            />
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-success">{editando ? 'Actualizar Consulta' : 'Registrar Consulta'}</button>
            {editando && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      {selectedMascotaId && (
        <div>
          <h4>Historia Clínica</h4>
          {consultas.length === 0 ? (
            <div className="text-muted">Sin consultas registradas.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Síntomas</th>
                    <th>Diagnóstico</th>
                    <th>Tratamiento</th>
                    <th>Veterinario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map(c => (
                    <tr key={c.id}>
                      <td>{c.fecha?.slice(0, 10)}</td>
                      <td>{c.sintomas}</td>
                      <td>{c.diagnostico}</td>
                      <td>{c.tratamiento}</td>
                      <td>{c.nombre_veterinario}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          onClick={() => handleEdit(c)}
                        >
                          <i className="bi bi-pencil-square"></i>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}