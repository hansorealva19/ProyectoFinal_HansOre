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
    <div>
      <h3>Registrar Vacunación</h3>
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

      {/* Paso 3: Formulario de vacunación */}
      {selectedMascotaId && (
        <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
          <select
            name="vacuna_id"
            value={form.vacuna_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione vacuna</option>
            {catalogo.map(v => (
              <option key={v.id} value={v.id}>
                {v.nombre} ({v.especie_destino}) - S/ {v.precio}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="fecha_aplicacion"
            onChange={handleChange}
            value={form.fecha_aplicacion}
            required
          />
          <input
            type="date"
            name="fecha_vencimiento"
            onChange={handleChange}
            value={form.fecha_vencimiento}
          />
          <button>Registrar Vacuna</button>
        </form>
      )}

      {/* Paso 4: Historial de vacunas aplicadas */}
      {selectedMascotaId && (
        <div>
          <h4>Vacunas Aplicadas</h4>
          <ul>
            {vacunasAplicadas.map(v => (
              <li key={v.id}>
                {v.nombre_vacuna} - Aplicada: {v.fecha_aplicacion?.slice(0,10)} - Vence: {v.fecha_vencimiento?.slice(0,10)}
                {v.fabricante && (
                  <span style={{ marginLeft: 10, color: '#555', fontSize: '0.95em' }}>
                    ({v.fabricante})
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