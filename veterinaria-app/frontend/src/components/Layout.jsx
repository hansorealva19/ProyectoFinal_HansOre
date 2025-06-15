import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const isVeterinario = user?.rol === 'veterinario';
  const { carritoCount } = useCarrito();

  const [showResumen, setShowResumen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const dniCarrito = localStorage.getItem('carritoDni');
  const resumenCarrito = JSON.parse(localStorage.getItem('carritoResumen') || '[]');
  const totalCarrito = resumenCarrito.reduce((sum, item) => sum + Number(item.total), 0);

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
            <div
              className="position-relative me-3"
              onMouseEnter={() => setShowResumen(true)}
              onMouseLeave={() => setShowResumen(false)}
              style={{ cursor: 'pointer' }}
            >
              <Link to="/carrito" className="text-decoration-none">
                <i className="bi bi-cart" style={{ fontSize: 28, color: '#0d6efd' }}></i>
                {carritoCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {carritoCount}
                  </span>
                )}
              </Link>
              {/* Popover resumen mejorado, más grande y con mascota */}
              {showResumen && (
                <div
                  className="shadow-lg rounded-4 bg-white p-0"
                  style={{
                    position: 'absolute',
                    top: 40,
                    right: 0,
                    minWidth: 400,
                    zIndex: 1000,
                    border: '1px solid #e3e3e3',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Encabezado */}
                  <div className="d-flex align-items-center gap-2 px-3 py-2" style={{ background: '#f5f8ff', borderBottom: '1px solid #e3e3e3' }}>
                    <i className="bi bi-cart4" style={{ fontSize: 22, color: '#0d6efd' }}></i>
                    <span className="fw-bold text-primary">Resumen del Carrito</span>
                  </div>
                  {/* Dueño */}
                  <div className="px-3 pt-2 pb-1 small text-secondary">
                    <b>Dueño:</b> {dniCarrito || <span className="text-muted">No seleccionado</span>}
                  </div>
                  <hr className="my-1" />
                  {/* Productos */}
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    {resumenCarrito.length === 0 ? (
                      <div className="text-muted px-3 py-2">Carrito vacío</div>
                    ) : (
                      <ul className="list-unstyled mb-0 px-3 py-2">
                        {resumenCarrito.map((item, idx) => (
                          <li key={idx} className="mb-2">
                            <div className="d-flex align-items-center" style={{ gap: 8 }}>
                              <div
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={
                                  item.tipo === 'vacuna'
                                    ? `Vacuna: ${item.vacuna_nombre}`
                                    : `Suscripción: ${item.suscripcion_nombre || 'Suscripción'}`
                                }
                              >
                                <span className="fw-semibold">
                                  {item.tipo === 'vacuna'
                                    ? `Vacuna: ${item.vacuna_nombre}`
                                    : `Suscripción: ${item.suscripcion_nombre || 'Suscripción'}`}
                                </span>
                                <span className="ms-2 badge bg-light text-secondary border">{item.cantidad}</span>
                              </div>
                              <span className="text-success fw-bold ms-3" style={{ minWidth: 70, textAlign: 'right' }}>
                                S/ {item.total}
                              </span>
                            </div>
                            <div className="small text-secondary ms-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 320 }}>
                              <i className="bi bi-paw me-1"></i>
                              Mascota: <b>{item.mascota_nombre || '-'}</b>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <hr className="my-1" />
                  {/* Total */}
                  <div className="d-flex justify-content-between align-items-center px-3 py-2">
                    <span className="fw-bold fs-6">Total:</span>
                    <span className="fw-bold fs-5 text-primary">S/ {totalCarrito}</span>
                  </div>
                </div>
              )}
            </div>
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