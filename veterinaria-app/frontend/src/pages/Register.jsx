import { useState } from 'react';
import { register } from '../services/auth';

export default function Register() {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    correo: '',
    celular: '',
    usuario: '',
    password: '',
    rol: 'dueño',
  });

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Usuario registrado');
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
              <input name="nombres" placeholder="Nombres" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <input name="apellidos" placeholder="Apellidos" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <input type="date" name="fecha_nacimiento" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <input type="email" name="correo" placeholder="Correo" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <input name="celular" placeholder="Celular" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <input name="usuario" placeholder="Usuario" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <input type="password" name="password" placeholder="Contraseña" className="form-control" onChange={handleChange} required/>
            </div>
            <div className="mb-3">
              <select name="rol" className="form-select" onChange={handleChange} value={form.rol}>
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