import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    correo: '',
    celular: '',
    dni: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/perfil');
        setPerfil(res.data);
        setForm({ ...res.data, password: '' });
      } catch (e) {
        setMensaje('Error al cargar perfil' + e.message);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Formatea la fecha antes de enviar
      const data = {
        ...form,
        fecha_nacimiento: form.fecha_nacimiento
          ? form.fecha_nacimiento.slice(0, 10)
          : ''
      };
      await api.put('/perfil', data);
      setMensaje('Perfil actualizado correctamente');
      setEditando(false);

      // Refresca el perfil desde el backend
      const res = await api.get('/perfil');
      setPerfil(res.data);
      setForm({ ...res.data, password: '' });
    } catch (e) {
      setMensaje('Error al actualizar perfil: ' + (e.response?.data?.error || e.message));
    }
  };

  if (!perfil) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Mi Perfil</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {!editando ? (
        <>
          <div className="mb-3"><b>Nombres:</b> {perfil.nombres}</div>
          <div className="mb-3"><b>Apellidos:</b> {perfil.apellidos}</div>
          <div className="mb-3"><b>Fecha de nacimiento:</b> {perfil.fecha_nacimiento?.slice(0,10)}</div>
          <div className="mb-3"><b>Correo:</b> {perfil.correo}</div>
          <div className="mb-3"><b>Celular:</b> {perfil.celular}</div>
          <div className="mb-3"><b>DNI:</b> {perfil.dni}</div>
          <div className="mb-3"><b>Usuario:</b> {perfil.usuario}</div>
          <div className="mb-3"><b>Rol:</b> {perfil.rol}</div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setEditando(true)}
          >
            Editar Perfil
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombres</label>
            <input
              name="nombres"
              className="form-control"
              value={form.nombres}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              name="apellidos"
              className="form-control"
              value={form.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              className="form-control"
              value={form.fecha_nacimiento?.slice(0,10) || ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Celular</label>
            <input
              name="celular"
              className="form-control"
              value={form.celular || ''}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              name="dni"
              className="form-control"
              value={form.dni}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              name="usuario"
              className="form-control"
              value={perfil.usuario}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <input
              name="rol"
              className="form-control"
              value={perfil.rol}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nueva contraseña (opcional)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success" type="submit">Guardar Cambios</button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setEditando(false); setForm({ ...perfil, password: '' }); }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}