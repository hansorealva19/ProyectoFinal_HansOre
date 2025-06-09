import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function HistoriaClinica() {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Info de la mascota
        const resMascota = await api.get(`/mascotas/${id}`);
        setMascota(resMascota.data);

        // Consultas
        const resConsultas = await api.get(`/consultas/${id}`);
        setConsultas(resConsultas.data);

        // Vacunas
        const resVacunas = await api.get(`/vacuna-mascota/${id}`);
        setVacunas(resVacunas.data);

        // Suscripciones
        const resSuscripciones = await api.get(`/suscripciones/${id}`);
        setSuscripciones(resSuscripciones.data);
      } catch (err) {
        alert('Error al cargar historia clínica' + err.message);
      }
    };
    fetchAll();
  }, [id]);

  if (!mascota) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <Link to="/mascotas" className="btn btn-link mb-3">&larr; Volver a Mascotas</Link>
      <h2>Historia Clínica de {mascota.nombre}</h2>
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
          <table className="table table-bordered">
            <thead>
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
        )}
      </div>

      <div className="mb-4">
        <h4>Vacunas Aplicadas</h4>
        {vacunas.length === 0 ? (
          <div className="text-muted">Sin vacunas registradas.</div>
        ) : (
          <table className="table table-bordered">
            <thead>
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
                  <td>{v.fecha_aplicacion?.slice(0,10)}</td>
                  <td>{v.fecha_vencimiento?.slice(0,10)}</td>
                  <td>{v.fabricante}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mb-4">
        <h4>Suscripciones</h4>
        {suscripciones.length === 0 ? (
          <div className="text-muted">Sin suscripciones registradas.</div>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {suscripciones.map(s => (
                <tr key={s.id}>
                  <td>{s.tipo_nombre || s.tipo_id}</td>
                  <td>{s.fecha_inicio?.slice(0,10)}</td>
                  <td>{s.fecha_fin?.slice(0,10)}</td>
                  <td>{s.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}