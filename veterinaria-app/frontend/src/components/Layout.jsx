import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/mascotas">Veterinaria App</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item"><Link className="nav-link" to="/mascotas">Mascotas</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/consultas">Consultas</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/vacunas">Vacunas</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/suscripciones">Suscripciones</Link></li>
              </ul>
              <button onClick={handleLogout} className="btn btn-light">Logout</button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container my-4">
        <Outlet />
      </main>

      <footer className="bg-light text-center py-3 mt-5 border-top">
        Veterinaria App &copy; 2025
      </footer>
    </>
  );
}