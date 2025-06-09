import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Mascotas({ setSelectedMascotaId }) {
  // Obtener el rol del usuario desde localStorage
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
  const [selectedId, setSelectedId] = useState(null);
  const [filtroDni, setFiltroDni] = useState('');
  const [mascotasFiltradas, setMascotasFiltradas] = useState([]);

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
    setSelectedId(id);
    if (setSelectedMascotaId) {
      setSelectedMascotaId(id);
    }
  };

  return (
    <div>
      <h2>
        {userRole === 'veterinario' ? 'Todas las Mascotas' : 'Mis Mascotas'}
      </h2>

      <p>
        {userRole === 'veterinario'
          ? 'Aquí se muestran todas las mascotas registradas en el sistema. Puedes filtrar por DNI del dueño para encontrar mascotas específicas.'
          : 'Aquí se muestran tus mascotas.'}
      </p>

      {/* Filtro por DNI solo para veterinario */}
      {userRole === 'veterinario' && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Filtrar por DNI del dueño"
            value={filtroDni}
            onChange={e => setFiltroDni(e.target.value)}
            style={{ padding: '6px', width: '220px', marginRight: '10px' }}
          />
          <button
            onClick={() => setFiltroDni('')}
            style={{ padding: '6px 12px' }}
            disabled={filtroDni === ''}
          >
            Limpiar filtro
          </button>
        </div>
      )}

      {/* Formulario para agregar mascota solo para veterinario */}
      {userRole === 'veterinario' && (
        <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            value={form.nombre}
            required
          />
          <input
            type="date"
            name="fecha_nacimiento"
            onChange={handleChange}
            value={form.fecha_nacimiento}
            required
          />
          <input
            name="raza"
            placeholder="Raza"
            onChange={handleChange}
            value={form.raza}
            required
          />
          <input
            name="especie"
            placeholder="Especie"
            onChange={handleChange}
            value={form.especie}
            required
          />
          <input
            name="dueno_dni"
            placeholder="DNI del Dueño"
            onChange={handleChange}
            value={form.dueno_dni}
            required
          />
          <button type="submit">Agregar</button>
        </form>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {mascotasFiltradas.map(m => (
          <li
            key={m.id}
            onClick={() => handleSelect(m.id)}
            style={{
              cursor: 'pointer',
              padding: '8px',
              border: m.id === selectedId ? '2px solid blue' : '1px solid #ccc',
              marginBottom: '6px',
              borderRadius: '4px',
              backgroundColor: m.id === selectedId ? '#eef4ff' : 'white'
            }}
          >
            {m.nombre} - {m.raza} - {m.especie}
            {userRole === 'veterinario' && (
              <span style={{ marginLeft: 10, color: '#555', fontSize: '0.95em' }}>
                Dueño: {m.nombre_dueño} (DNI: {m.dni})
              </span>
            )}
          </li>
        ))}
      </ul>

      {selectedId && (
        <p>
          Mascota seleccionada:{' '}
          <strong>{mascotasFiltradas.find(m => m.id === selectedId)?.nombre}</strong>
        </p>
      )}
    </div>
  );
}