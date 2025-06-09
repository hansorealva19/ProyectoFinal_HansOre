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
    <form onSubmit={handleSubmit}>
      <input name="nombres" placeholder="Nombres" onChange={handleChange} required/>
      <input name="apellidos" placeholder="Apellidos" onChange={handleChange} required/>
      <input type="date" name="fecha_nacimiento" onChange={handleChange} required/>
      <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required/>
      <input name="celular" placeholder="Celular" onChange={handleChange} required/>
      <input name="usuario" placeholder="Usuario" onChange={handleChange} required/>
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required/>
      <select name="rol" onChange={handleChange} value={form.rol}>
        <option value="dueño">Dueño</option>
        <option value="veterinario">Veterinario</option>
      </select>
      <button>Registrar</button>
    </form>
  );
}
