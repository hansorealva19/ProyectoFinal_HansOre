import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Vacunas() {
  const [catalogo, setCatalogo] = useState([]);
  const [form, setForm] = useState({ nombre: '', especie_destino: '', precio: '', fabricante: '', descripcion: '' });
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para controlar la visibilidad del formulario

  // Cargar catálogo de vacunas
  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const res = await api.get('/vacunas/catalogo');
        setCatalogo(res.data);
      } catch {
        alert('Error al cargar catálogo de vacunas');
      }
    };
    fetchCatalogo();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await api.post('/vacunas/catalogo', form);
      alert('Vacuna registrada correctamente');
      setForm({ nombre: '', especie_destino: '', precio: '', fabricante: '', descripcion: '' });
      setMostrarFormulario(false); // Ocultar el formulario después de registrar
      const res = await api.get('/vacunas/catalogo');
      setCatalogo(res.data);
    } catch {
      alert('Error al registrar vacuna');
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Catálogo de Vacunas</h3>

      {/* Botón para mostrar/ocultar el formulario */}
      <button
        className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-primary'} mb-4`}
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? 'Cancelar' : 'Agregar Nueva Vacuna'}
      </button>

      {/* Formulario para registrar nueva vacuna */}
      {mostrarFormulario && (
        <form onSubmit={handleAdd} className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              name="nombre"
              placeholder="Nombre de la vacuna"
              className="form-control"
              onChange={handleChange}
              value={form.nombre}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Especie Destino</label>
            <input
              name="especie_destino"
              placeholder="Ej: Canina, Felina"
              className="form-control"
              onChange={handleChange}
              value={form.especie_destino}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="precio"
              placeholder="Precio en S/"
              className="form-control"
              onChange={handleChange}
              value={form.precio}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fabricante</label>
            <input
              name="fabricante"
              placeholder="Fabricante de la vacuna"
              className="form-control"
              onChange={handleChange}
              value={form.fabricante}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción de la vacuna"
              className="form-control"
              rows={3}
              onChange={handleChange}
              value={form.descripcion}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-success w-100">Registrar Vacuna</button>
          </div>
        </form>
      )}

      {/* Catálogo de vacunas */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Vacuna</th>
            <th>Especie</th>
            <th>Precio</th>
            <th>Fabricante</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {catalogo.map(v => (
            <tr key={v.id}>
              <td>{v.nombre}</td>
              <td>{v.especie_destino}</td>
              <td>S/ {v.precio}</td>
              <td>{v.fabricante}</td>
              <td>{v.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}