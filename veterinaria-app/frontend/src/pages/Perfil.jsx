import { useEffect, useState } from 'react';
import api from '../services/api';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqixr8zcs/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'sin_firma'; // Ej: 'sin_firma'

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    correo: '',
    celular: '',
    dni: '',
    password: '',
    foto_url: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/perfil');
        setPerfil(res.data);
        setForm({ ...res.data, password: '' });
      } catch (e) {
        setMensaje('Error al cargar perfil: ' + e.message);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Subir imagen a imgbb
  const handleFileChange = async e => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    setMensaje('La imagen es demasiado grande (máx 2 MB)');
    return;
  }
  if (!file.type.startsWith('image/')) {
    setMensaje('Solo se permiten archivos de imagen');
    return;
  }
  setSubiendo(true);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  try {
    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) {
      setForm(f => ({ ...f, foto_url: data.secure_url }));
      setMensaje('Foto subida correctamente');
    } else {
      setMensaje('Error al subir imagen: ' + (data.error?.message || JSON.stringify(data)));
    }
  } catch {
    setMensaje('Error al subir imagen');
  }
  setSubiendo(false);
};

  const handleSubmit = async e => {
    e.preventDefault();
    try {
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

      {/* Mostrar foto de perfil */}
      {(form.foto_url || perfil.foto_url) && (
        <div className="mb-3 text-center">
          <img
            src={form.foto_url || perfil.foto_url}
            alt="Foto de perfil"
            style={{ maxWidth: 120, borderRadius: '50%', border: '2px solid #ccc' }}
          />
        </div>
      )}

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
          <div className="mb-3 text-center">
            <label className="form-label">Foto de perfil</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
              disabled={subiendo}
            />
            {subiendo && <div className="text-info mt-2">Subiendo imagen...</div>}
            {form.foto_url && (
              <img
                src={form.foto_url}
                alt="Previsualización"
                style={{ maxWidth: 120, borderRadius: '50%', marginTop: 10, border: '2px solid #ccc' }}
              />
            )}
          </div>
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