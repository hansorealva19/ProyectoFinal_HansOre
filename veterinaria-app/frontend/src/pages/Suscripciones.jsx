import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Suscripciones({ mascotaId }) {
  const [suscripciones, setSuscripciones] = useState([]);
  const [form, setForm] = useState({ tipo: '', fecha_inicio: '', fecha_fin: '' });


    useEffect(() => {
    const fetchSuscripciones = async () => {
        try {
        const res = await api.get(`/suscripciones/${mascotaId}`);
        setSuscripciones(res.data);
        } catch {
        alert('Error al cargar suscripciones');
        }
    };

    if (mascotaId) fetchSuscripciones();
    }, [mascotaId]);


  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await api.post('/suscripciones', { ...form, mascota_id: mascotaId });
      setForm({ tipo: '', fecha_inicio: '', fecha_fin: '' });

    } catch {
      alert('Error al agregar suscripción');
    }
  };

  return (
    <div>
      <h3>Suscripciones</h3>
      <form onSubmit={handleAdd}>
        <input name="tipo" placeholder="Tipo" onChange={handleChange} value={form.tipo} required />
        <input type="date" name="fecha_inicio" onChange={handleChange} value={form.fecha_inicio} required />
        <input type="date" name="fecha_fin" onChange={handleChange} value={form.fecha_fin} required />
        <button>Agregar Suscripción</button>
      </form>

      <ul>
        {suscripciones.map(s => (
          <li key={s.id}>
            {s.tipo} - Desde: {s.fecha_inicio} Hasta: {s.fecha_fin}
          </li>
        ))}
      </ul>
    </div>
  );
}
