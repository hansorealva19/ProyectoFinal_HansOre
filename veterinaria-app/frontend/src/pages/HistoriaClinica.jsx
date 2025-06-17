import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqixr8zcs/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'sin_firma';


export default function HistoriaClinica() {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  // Carga la historia clínica completa de la mascota 
  // (datos, consultas, vacunas y suscripciones) desde el backend.
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get(`/mascotas/${id}/historia`);
        setMascota(res.data.mascota || {});
        setConsultas(res.data.consultas || []);
        setVacunas(res.data.vacunas || []);
        setSuscripciones(res.data.suscripciones || []);
      } catch (err) {
        console.error('Error al cargar la historia clínica:', err.message);
      }
    };
    fetchAll();
  }, [id]);
  
  // Subir imagen a Cloudinary
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
        // Actualiza la foto en el backend
        await api.put(`/mascotas/${id}/foto`, { foto_url: data.secure_url });
        setMascota(m => ({ ...m, foto_url: data.secure_url }));
        setMensaje('Foto de mascota actualizada');
      } else {
        setMensaje('Error al subir imagen: ' + (data.error?.message || JSON.stringify(data)));
      }
    } catch {
      setMensaje('Error al subir imagen');
    }
    setSubiendo(false);
  };


  if (!mascota) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <Link to="/mascotas" className="btn btn-link mb-3">&larr; Volver a Mascotas</Link>
      <h2 className="mb-4">Historia Clínica de {mascota.nombre}</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      {/* Foto de perfil de la mascota */}
      <div className="mb-4 text-center">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={mascota.foto_url || 'https://cdn-icons-png.flaticon.com/512/616/616408.png'}
            alt="Foto de mascota"
            style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%', border: '3px solid #ccc' }}
          />
          <label
            htmlFor="foto-mascota"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: '#007bff',
              color: '#fff',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid #fff',
              fontSize: 20,
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
            title="Cambiar foto"
          >
            <span role="img" aria-label="cámara">📷</span>
            <input
              id="foto-mascota"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={subiendo}
            />
          </label>
        </div>
        <div className="mt-2 text-muted" style={{ fontSize: 13 }}>
          {subiendo ? 'Subiendo imagen...' : 'Haz clic en el ícono para subir/cambiar foto'}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Datos de la Mascota</h5>
          <ul className="mb-0">
            <li><b>Nombre:</b> {mascota.nombre}</li>
            <li><b>Raza:</b> {mascota.raza}</li>
            <li><b>Especie:</b> {mascota.especie}</li>
            <li><b>Fecha de nacimiento:</b> {mascota.fecha_nacimiento?.slice(0,10)}</li>
            {mascota.nombre_dueño && <li><b>Dueño:</b> {mascota.nombre_dueño}</li>}
            {mascota.dni && <li><b>DNI Dueño:</b> {mascota.dni}</li>}
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <h4>Consultas Veterinarias</h4>
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
                </tr>
              </thead>
              <tbody>
                {consultas.map(c => (
                  <tr key={c.id}>
                    <td>{c.fecha?.slice(0,10)}</td>
                    <td>{c.sintomas}</td>
                    <td>{c.diagnostico}</td>
                    <td>{c.tratamiento}</td>
                    <td>{c.nombre_veterinario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4>Vacunas Aplicadas</h4>
        {vacunas.length === 0 ? (
          <div className="text-muted">Sin vacunas registradas.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Vacuna</th>
                  <th>Aplicada</th>
                  <th>Vence</th>
                  <th>Fabricante</th>
                </tr>
              </thead>
              <tbody>
                {vacunas.map(v => (
                  <tr key={v.id}>
                    <td>{v.nombre_vacuna}</td>
                    <td>{v.fecha_aplicacion?.slice(0, 10)}</td>
                    <td>{v.fecha_vencimiento ? v.fecha_vencimiento.slice(0, 10) : 'No especificada'}</td>
                    <td>{v.fabricante}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4>Suscripciones</h4>
        {Array.isArray(suscripciones) && suscripciones.length === 0 ? (
          <div className="text-muted">Sin suscripciones registradas.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Tipo</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(suscripciones) &&
                  suscripciones.map(s => (
                    <tr key={s.id}>
                      <td>{s.tipo_nombre || s.tipo_id}</td>
                      <td>{s.fecha_inicio?.slice(0, 10)}</td>
                      <td>{s.fecha_fin?.slice(0, 10)}</td>
                      <td>{s.estado}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}