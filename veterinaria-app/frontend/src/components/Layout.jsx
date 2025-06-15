import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const isVeterinario = user?.rol === 'veterinario';
  const { carritoCount } = useCarrito();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Helper para resaltar el enlace activo
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav className="bg-primary text-white flex-shrink-0 p-3" style={{ width: 220, minHeight: '100vh' }}>
        <Link className="navbar-brand text-white mb-4 d-block fs-4 fw-bold" to="/mascotas">
          <i className="bi bi-heart-pulse me-2"></i>Veterinaria
        </Link>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link className={`nav-link${isActive('/mascotas') ? ' active bg-light text-primary fw-bold' : ' text-white'}`} to="/mascotas">
              <i className="bi bi-house-door me-2"></i>Mascotas
            </Link>
          </li>
          <li>
            <Link className={`nav-link${isActive('/consultas') ? ' active bg-light text-primary fw-bold' : ' text-white'}`} to="/consultas">
              <i className="bi bi-clipboard2-pulse me-2"></i>Consultas
            </Link>
          </li>
          <li>
            <Link className={`nav-link${isActive('/vacunas') ? ' active bg-light text-primary fw-bold' : ' text-white'}`} to="/vacunas">
              <i className="bi bi-capsule-pill me-2"></i>Vacunas
            </Link>
          </li>
          <li>
            <Link className={`nav-link${isActive('/suscripciones') ? ' active bg-light text-primary fw-bold' : ' text-white'}`} to="/suscripciones">
              <i className="bi bi-card-checklist me-2"></i>Suscripciones
            </Link>
          </li>
          <li>
            <Link className={`nav-link${isActive('/perfil') ? ' active bg-light text-primary fw-bold' : ' text-white'}`} to="/perfil">
              <i className="bi bi-person-circle me-2"></i>Perfil
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-light mt-4 w-100">Logout</button>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Topbar */}
        <header className="bg-white border-bottom d-flex justify-content-end align-items-center px-4" style={{ height: 60 }}>
          {isVeterinario && (
            <Link to="/carrito" className="position-relative me-3 text-decoration-none">
              <i className="bi bi-cart" style={{ fontSize: 28, color: '#0d6efd' }}></i>
              {carritoCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {carritoCount}
                </span>
              )}
            </Link>
          )}
        </header>
        {/* Main */}
        <main className="container my-4 flex-grow-1">
          <Outlet />
        </main>
        <footer className="bg-light text-center py-3 border-top">
          Veterinaria App &copy;
        </footer>
      </div>
    </div>
  );
}