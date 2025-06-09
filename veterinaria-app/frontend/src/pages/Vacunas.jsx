import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Vacunas({ mascotaId }) {
  const [vacunas, setVacunas] = useState([]);
  const [form, setForm] = useState({ nombre: '', fecha_aplicacion: '', proxima_dosis: '' });

  useEffect(() => {
    const fetchVacunas = async () => {
      if (!mascotaId) return; // Solo cargar si hay mascota seleccionada
      try {
        const res = await api.get(`/vacunas/${mascotaId}`);
        setVacunas(res.data);
      } catch {
        alert('Error al cargar vacunas');
      }
    };

    fetchVacunas();
  }, [mascotaId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    if (!mascotaId) {
      alert('Seleccione una mascota primero');
      return;
    }
    try {
      await api.post('/vacunas', { ...form, mascota_id: mascotaId });
      setForm({ nombre: '', fecha_aplicacion: '', proxima_dosis: '' });
      // Refrescar la lista después de agregar
      const res = await api.get(`/vacunas/${mascotaId}`);
      setVacunas(res.data);
    } catch {
      alert('Error al agregar vacuna');
    }
  };

  return (
    <div>
      <h3>Vacunas</h3>
      <form onSubmit={handleAdd}>
        <input name="nombre" placeholder="Nombre Vacuna" onChange={handleChange} value={form.nombre} required />
        <input type="date" name="fecha_aplicacion" onChange={handleChange} value={form.fecha_aplicacion} required />
        <input type="date" name="proxima_dosis" onChange={handleChange} value={form.proxima_dosis} required />
        <button>Agregar Vacuna</button>
      </form>

      <ul>
        {vacunas.map(v => (
          <li key={v.id}>
            {v.nombre} - Aplicada: {v.fecha_aplicacion} - Próxima dosis: {v.proxima_dosis}
          </li>
        ))}
      </ul>
    </div>
  );
}