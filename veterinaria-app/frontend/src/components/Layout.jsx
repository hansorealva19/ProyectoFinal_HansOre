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
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link className="navbar-brand" to="/mascotas">Veterinaria App</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className={`nav-link${isActive('/mascotas') ? ' active fw-bold' : ''}`} to="/mascotas">
                    Mascotas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${isActive('/consultas') ? ' active fw-bold' : ''}`} to="/consultas">
                    Consultas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${isActive('/vacunas') ? ' active fw-bold' : ''}`} to="/vacunas">
                    Vacunas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${isActive('/suscripciones') ? ' active fw-bold' : ''}`} to="/suscripciones">
                    Suscripciones
                  </Link>
                </li>
                {isVeterinario && (
                  <li className="nav-item position-relative">
                    <Link className={`nav-link${isActive('/carrito') ? ' active fw-bold' : ''}`} to="/carrito">
                      <i className="bi bi-cart" style={{ fontSize: 22, verticalAlign: 'middle' }}></i>
                      {carritoCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {carritoCount}
                        </span>
                      )}
                      <span className="ms-2">Carrito</span>
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className={`nav-link${isActive('/perfil') ? ' active fw-bold' : ''}`} to="/perfil">
                    Perfil
                  </Link>
                </li>
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