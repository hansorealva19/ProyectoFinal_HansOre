import { useState } from 'react';
import { register } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    correo: '',
    celular: '',
    dni: '',
    usuario: '',
    password: '',
    rol: 'dueño',
  });

  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{8}$/.test(form.dni)) {
      alert('El DNI debe tener 8 dígitos numéricos');
      return;
    }
    try {
      await register(form);
      alert('Usuario registrado');
      navigate('/login'); // Redirige al login tras registro exitoso
    } catch (err) {
      alert('Error: ' + err.response.data.error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="nombres">Nombres</label>
              <input
                id="nombres"
                name="nombres"
                placeholder="Nombres"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos"
                name="apellidos"
                placeholder="Apellidos"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="Correo"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="celular">Celular</label>
              <input
                id="celular"
                name="celular"
                placeholder="Celular"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="dni">DNI</label>
              <input
                id="dni"
                name="dni"
                placeholder="DNI"
                className="form-control"
                onChange={handleChange}
                required
                maxLength={8}
                minLength={8}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                name="usuario"
                placeholder="Usuario"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="rol">Rol</label>
              <select
                id="rol"
                name="rol"
                className="form-select"
                onChange={handleChange}
                value={form.rol}
              >
                <option value="dueño">Dueño</option>
                <option value="veterinario">Veterinario</option>
              </select>
            </div>
            <button className="btn btn-success w-100">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}