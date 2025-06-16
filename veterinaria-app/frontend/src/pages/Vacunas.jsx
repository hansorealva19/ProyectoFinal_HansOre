import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Vacunas() {
  const [catalogo, setCatalogo] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    especie_destino: '',
    precio: '',
    fabricante: '',
    descripcion: '',
    stock: 0
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await api.post('/vacunas/catalogo', form);
      alert('Vacuna registrada correctamente');
      setForm({
        nombre: '',
        especie_destino: '',
        precio: '',
        fabricante: '',
        descripcion: '',
        stock: 0
      });
      setMostrarFormulario(false);
      const res = await api.get('/vacunas/catalogo');
      setCatalogo(res.data);
    } catch {
      alert('Error al registrar vacuna');
    }
  };

  const handleAumentarStock = async (id, cantidad) => {
    try {
      await api.put(`/vacunas/catalogo/${id}/stock`, { cantidad });
      alert('Stock actualizado correctamente');
      const res = await api.get('/vacunas/catalogo');
      setCatalogo(res.data);
    } catch {
      alert('Error al actualizar stock');
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">Catálogo de Vacunas</h3>

      <button
        className={`btn ${mostrarFormulario ? 'btn-secondary' : 'btn-primary'} mb-4`}
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? 'Cancelar' : 'Agregar Nueva Vacuna'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleAdd} className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              name="nombre"
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
              className="form-control"
              onChange={handleChange}
              value={form.precio}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Stock</label>
            <input
              type="number"
              name="stock"
              className="form-control"
              onChange={handleChange}
              value={form.stock}
              required
            />
          </div>
          <div className="col-12">
            <button className="btn btn-success w-100">Registrar Vacuna</button>
          </div>
        </form>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Vacuna</th>
            <th>Especie</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {catalogo.map(v => (
            <tr key={v.id}>
              <td>{v.nombre}</td>
              <td>{v.especie_destino}</td>
              <td>S/ {v.precio}</td>
              <td>{v.stock}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    const cantidad = prompt(
                      'Ingrese la cantidad a agregar al stock:'
                    );
                    if (cantidad && !isNaN(cantidad))
                      handleAumentarStock(v.id, parseInt(cantidad, 10));
                  }}
                >
                  Aumentar Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}