import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Consultas() {
  const [dni, setDni] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [form, setForm] = useState({ sintomas: '', diagnostico: '', tratamiento: '', fecha: '' });

  // Buscar mascotas por DNI
  const buscarMascotas = async () => {
    try {
      const res = await api.get('/mascotas');
      // Filtrar mascotas por DNI del dueño
      const mascotasFiltradas = res.data.filter(m => m.dni === dni);
      setMascotas(mascotasFiltradas);
      setSelectedMascotaId(null);
      setConsultas([]);
    } catch {
      alert('Error al buscar mascotas');
    }
  };

  // Cargar consultas de la mascota seleccionada
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

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await api.post('/consultas', { ...form, mascota_id: selectedMascotaId });
      setForm({ sintomas: '', diagnostico: '', tratamiento: '', fecha: '' });
      const res = await api.get(`/consultas/${selectedMascotaId}`);
      setConsultas(res.data);
    } catch {
      alert('Error al agregar consulta');
    }
  };

  return (
    <div>
      <h3>Registrar Consulta</h3>
      {/* Paso 1: Buscar dueño por DNI */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="DNI del dueño"
          value={dni}
          onChange={e => setDni(e.target.value)}
          className="form-control d-inline-block"
          style={{ width: 200, marginRight: 8 }}
        />
        <button onClick={buscarMascotas} disabled={!dni} className="btn btn-primary">Buscar Mascotas</button>
      </div>

      {/* Paso 2: Mostrar mascotas del dueño */}
      {mascotas.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <strong>Seleccione una mascota:</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {mascotas.map(m => (
              <li
                key={m.id}
                onClick={() => setSelectedMascotaId(m.id)}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  border: m.id === selectedMascotaId ? '2px solid blue' : '1px solid #ccc',
                  marginBottom: '6px',
                  borderRadius: '4px',
                  backgroundColor: m.id === selectedMascotaId ? '#eef4ff' : 'white'
                }}
              >
                {m.nombre} - {m.raza} - {m.especie}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Paso 3: Formulario de consulta */}
      {selectedMascotaId && (
        <div>
          <form onSubmit={handleAdd} className="row g-2 align-items-center">
            <div className="col">
              <input name="fecha" type="date" className="form-control" onChange={handleChange} value={form.fecha} required />
            </div>
            <div className="col">
              <input name="sintomas" placeholder="Síntomas" className="form-control" onChange={handleChange} value={form.sintomas} required />
            </div>
            <div className="col">
              <input name="diagnostico" placeholder="Diagnóstico" className="form-control" onChange={handleChange} value={form.diagnostico} required />
            </div>
            <div className="col">
              <input name="tratamiento" placeholder="Tratamiento" className="form-control" onChange={handleChange} value={form.tratamiento} required />
            </div>
            <div className="col-auto">
              <button className="btn btn-success">Agregar Consulta</button>
            </div>
          </form>
        </div>
      )}

      {/* Paso 4: Historia clínica */}
      {selectedMascotaId && (
        <div style={{ marginTop: 24 }}>
          <h4>Historia Clínica</h4>
          <ul>
            {consultas.map(c => (
              <li key={c.id}>
                {c.fecha?.slice(0, 10)} - {c.sintomas} - {c.diagnostico} - {c.tratamiento}
                {c.nombre_veterinario && (
                  <span style={{ marginLeft: 10, color: '#555', fontSize: '0.95em' }}>
                    Veterinario: {c.nombre_veterinario}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}