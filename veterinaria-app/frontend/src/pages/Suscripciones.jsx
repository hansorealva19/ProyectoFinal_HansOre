import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Suscripciones() {
  const [dni, setDni] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ tipo_id: '', fecha_inicio: '', fecha_fin: '' });
  const [suscripciones, setSuscripciones] = useState([]);

  // Buscar mascotas por DNI
  const buscarMascotas = async () => {
    try {
      const res = await api.get('/mascotas');
      const mascotasFiltradas = res.data.filter(m => m.dni === dni);
      setMascotas(mascotasFiltradas);
      setSelectedMascotaId(null);
      setSuscripciones([]);
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
        setSuscripciones(res.data);
      } catch {
        alert('Error al cargar suscripciones');
      }
    };
    fetchSuscripciones();
  }, [selectedMascotaId]);

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
      setSuscripciones(res.data);
    } catch {
      alert('Error al agregar suscripción');
    }
  };

  return (
    <div>
      <h3>Asignar Suscripción</h3>
      {/* Paso 1: Buscar dueño por DNI */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="DNI del dueño"
          value={dni}
          onChange={e => setDni(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={buscarMascotas} disabled={!dni}>Buscar Mascotas</button>
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

      {/* Paso 3: Formulario de suscripción */}
      {selectedMascotaId && (
        <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
          <select
            name="tipo_id"
            value={form.tipo_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione tipo de suscripción</option>
            {tipos.map(t => (
              <option key={t.id} value={t.id}>
                {t.nombre} - S/ {t.precio}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="fecha_inicio"
            onChange={handleChange}
            value={form.fecha_inicio}
            required
          />
          <input
            type="date"
            name="fecha_fin"
            onChange={handleChange}
            value={form.fecha_fin}
            required
          />
          <button>Agregar Suscripción</button>
        </form>
      )}

      {/* Paso 4: Historial de suscripciones */}
      {selectedMascotaId && (
        <div>
          <h4>Suscripciones</h4>
          <ul>
            {suscripciones.map(s => (
              <li key={s.id}>
                {tipos.find(t => t.id === s.tipo_id)?.nombre || s.tipo_id} - Desde: {s.fecha_inicio?.slice(0,10)} Hasta: {s.fecha_fin?.slice(0,10)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}