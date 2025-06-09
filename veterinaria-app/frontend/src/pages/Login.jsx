import { useState } from 'react';
import { login } from '../services/auth';
import { Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ usuario: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Bienvenido ' + res.data.user.nombres);
      window.location.href = '/mascotas';
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                name="usuario"
                placeholder="Usuario"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-primary w-100">Iniciar sesión</button>
          </form>
          <p className="text-center mt-3">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-decoration-none">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}