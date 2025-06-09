import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // <-- Borra el usuario guardado
    navigate('/login');
  };

  return (
    <>
      <header style={{ padding: '1rem', backgroundColor: '#eee' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/mascotas">Mascotas</Link>
          <Link to="/consultas">Consultas</Link>
          <Link to="/vacunas">Vacunas</Link>
          <Link to="/suscripciones">Suscripciones</Link>
          <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
            Logout
          </button>
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>

      <footer style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#eee', marginTop: '2rem' }}>
        Veterinaria App &copy; 2025
      </footer>
    </>
  );
}