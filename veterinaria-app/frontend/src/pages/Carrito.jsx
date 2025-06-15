import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCarrito } from '../context/CarritoContext';

export default function Carrito() {
  const [dni, setDni] = useState('');
  const [dniConfirmado, setDniConfirmado] = useState('');
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascotaId, setSelectedMascotaId] = useState(null);
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  // Catálogos
  const [vacunas, setVacunas] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);

  // Modales y datos temporales
  const [showVacunaModal, setShowVacunaModal] = useState(false);
  const [vacunaSeleccionada, setVacunaSeleccionada] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  const [showSuscripcionModal, setShowSuscripcionModal] = useState(false);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState(null);
  const [aniosSuscripcion, setAniosSuscripcion] = useState(1);

  const { setCarritoCount } = useCarrito();

  // Cada vez que cambian los items, actualiza el contador:
  useEffect(() => {
    // Nuevo cálculo: vacunas suman cantidad, suscripciones suman 1 por ítem
    const count = items.reduce((sum, i) => {
      if (i.tipo === 'vacuna') {
        return sum + Number(i.cantidad);
      } else if (i.tipo === 'suscripcion') {
        return sum + 1;
      }
      return sum;
    }, 0);
    setCarritoCount(count);
  }, [items, setCarritoCount]);

  // Confirmar el DNI y cargar el carrito, mascotas y catálogos
  const confirmarDni = async () => {
    setLoading(true);
    setMensaje('');
    try {
      // Cargar carrito
      const res = await api.get(`/carrito/mi-carrito?dueno_dni=${dni}`);
      setItems(res.data.items);
      setDniConfirmado(dni);

      // Cargar mascotas del dueño
      const resMascotas = await api.get('/mascotas');
      const mascotasDueño = resMascotas.data.filter(m => m.dni === dni);
      setMascotas(mascotasDueño);
      setSelectedMascotaId(null);

      // Cargar catálogo de vacunas
      const resVacunas = await api.get('/vacuna-mascota/catalogo');
      setVacunas(resVacunas.data);

      // Cargar catálogo de suscripciones (solo tipos, no las activas)
      const resSuscripciones = await api.get('/tipo-suscripcion');
      setSuscripciones(resSuscripciones.data);

      if (res.data.items.length === 0) {
        setMensaje('El carrito está vacío.');
      }
    } catch (e) {
      setItems([]);
      setDniConfirmado('');
      setVacunas([]);
      setSuscripciones([]);
      setMascotas([]);
      setSelectedMascotaId(null);
      setMensaje(
        e.response?.data?.error ||
          'No se pudo cargar el carrito. Verifique el DNI del dueño.'
      );
    }
    setLoading(false);
  };

  // Vaciar carrito
  const vaciarCarrito = async () => {
    if (!window.confirm('¿Vaciar todo el carrito?')) return;
    await api.delete('/carrito/vaciar', { data: { dueno_dni: dniConfirmado } });
    confirmarDni();
  };

  // Eliminar ítem
  const eliminarItem = async (id) => {
    if (!window.confirm('¿Eliminar este ítem del carrito?')) return;
    await api.delete(`/carrito/item/${id}`, { data: { dueno_dni: dniConfirmado } });
    confirmarDni();
  };

  // Simular pago
  const pagar = async () => {
    if (!window.confirm('¿Confirmar pago?')) return;
    try {
      const res = await api.post('/carrito/pagar', { dueno_dni: dniConfirmado, metodo: 'simulado' });
      setMensaje('Pago exitoso. Monto: S/ ' + res.data.monto_total);
      confirmarDni();
    } catch (e) {
      setMensaje('Error al pagar: ' + (e.response?.data?.error || e.message));
    }
  };

  // Agregar vacuna al carrito (desde modal)
  const agregarVacuna = async (vacunaId, fechaVencimiento) => {
    if (!selectedMascotaId) {
      setMensaje('Debe seleccionar una mascota antes de agregar una vacuna.');
      return;
    }
    if (!fechaVencimiento) {
      setMensaje('Debe ingresar la fecha de vencimiento de la vacuna.');
      return;
    }
    try {
      await api.post('/carrito/agregar', {
      dueno_dni: dniConfirmado,
      tipo: 'vacuna',
      vacuna_catalogo_id: vacunaSeleccionada.id,
      mascota_id: selectedMascotaId, // <-- ¡Esto es clave!
      fecha_vencimiento: fechaVencimiento,
      cantidad: 1
    });
      setMensaje('Vacuna agregada al carrito');
      setShowVacunaModal(false);
      confirmarDni();
    } catch (e) {
      setMensaje('Error al agregar vacuna: ' + (e.response?.data?.error || e.message));
    }
  };

  // Agregar suscripción al carrito (desde modal)
  const agregarSuscripcion = async (tipoSuscripcionId, anios) => {
    if (!selectedMascotaId) {
      setMensaje('Debe seleccionar una mascota antes de agregar una suscripción.');
      return;
    }
    if (!anios || isNaN(anios) || anios < 1) {
      setMensaje('Debe ingresar la cantidad de años.');
      return;
    }
    try {
      await api.post('/carrito/agregar', {
        dueno_dni: dniConfirmado,
        tipo: 'suscripcion',
        tipo_suscripcion_id: suscripcionSeleccionada.id,
        mascota_id: selectedMascotaId, // <-- ¡Esto es clave!
        cantidad: aniosSuscripcion
      });
      setMensaje('Suscripción agregada al carrito');
      setShowSuscripcionModal(false);
      confirmarDni();
    } catch (e) {
      setMensaje('Error al agregar suscripción: ' + (e.response?.data?.error || e.message));
    }
  };

  // Total
  const total = items.reduce((sum, i) => sum + Number(i.total), 0);

  return (
    <div className="container">
      <h2 className="mb-4">Carrito de Compras (Veterinario)</h2>
      {/* Paso 1: Ingresar y confirmar DNI */}
      <div className="mb-3 d-flex align-items-center">
        <input
          type="text"
          placeholder="DNI del dueño"
          value={dni}
          onChange={e => setDni(e.target.value)}
          className="form-control me-2"
          style={{ maxWidth: 220 }}
          disabled={!!dniConfirmado}
        />
        <button
          className="btn btn-primary"
          onClick={confirmarDni}
          disabled={!dni || !!dniConfirmado}
        >
          Confirmar DNI
        </button>
        {dniConfirmado && (
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => {
              setDni('');
              setDniConfirmado('');
              setItems([]);
              setVacunas([]);
              setSuscripciones([]);
              setMascotas([]);
              setSelectedMascotaId(null);
              setMensaje('');
            }}
          >
            Cambiar DNI
          </button>
        )}
      </div>
      {dniConfirmado && (
        <div className="mb-2">
          <span className="badge bg-success">DNI confirmado: {dniConfirmado}</span>
        </div>
      )}
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          {/* Paso 2: Seleccionar mascota */}
          {dniConfirmado && (
            <div className="mb-3">
              <h5>Seleccione una mascota del dueño:</h5>
              {mascotas.length === 0 && (
                <div className="alert alert-warning">Este dueño no tiene mascotas registradas.</div>
              )}
              <ul className="list-group">
                {mascotas.map(m => (
                  <li
                    key={m.id}
                    className={`list-group-item list-group-item-action${selectedMascotaId === m.id ? ' active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedMascotaId(m.id)}
                  >
                    {m.nombre} - {m.raza} - {m.especie}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Paso 3: Mostrar carrito */}
          {dniConfirmado && (
            <>
              <h4 className="mt-4">Carrito Actual</h4>
              {(!items || items.length === 0) ? (
                <div className="alert alert-warning">El carrito está vacío.</div>
              ) : (
                <>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Nombre</th>
                        <th>Mascota</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(i => (
                        <tr key={i.id}>
                          <td>{i.tipo}</td>
                          <td>
                            {i.tipo === 'vacuna'
                              ? i.vacuna_nombre
                              : i.suscripcion_nombre || 'Suscripción'}
                          </td>
                          <td>{i.mascota_nombre || '-'}</td>
                          <td>{i.cantidad}</td>
                          <td>S/ {i.precio_unitario}</td>
                          <td>S/ {i.total}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminarItem(i.id)}>
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} className="text-end"><b>Total:</b></td>
                        <td colSpan={2}><b>S/ {total}</b></td>
                      </tr>
                    </tfoot>
                  </table>
                  <div className="d-flex gap-2 mb-4">
                    <button className="btn btn-warning" onClick={vaciarCarrito}>Vaciar Carrito</button>
                    <button className="btn btn-success" onClick={pagar}>Pagar</button>
                  </div>
                </>
              )}

              {/* Paso 4: Agregar productos */}
              <div className="row">
                <div className="col-md-6">
                  <h5>Vacunas disponibles</h5>
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Vacuna</th>
                        <th>Especie</th>
                        <th>Precio</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {vacunas.map(v => (
                        <tr key={v.id}>
                          <td>{v.nombre}</td>
                          <td>{v.especie_destino}</td>
                          <td>S/ {v.precio}</td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              disabled={!selectedMascotaId}
                              onClick={() => {
                                setVacunaSeleccionada(v);
                                setFechaVencimiento('');
                                setShowVacunaModal(true);
                              }}
                            >
                              Agregar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-md-6">
                  <h5>Suscripciones disponibles</h5>
                  <table className="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {suscripciones.map(s => (
                        <tr key={s.id}>
                          <td>{s.nombre}</td>
                          <td>S/ {s.precio}</td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              disabled={!selectedMascotaId}
                              onClick={() => {
                                setSuscripcionSeleccionada(s);
                                setAniosSuscripcion(1);
                                setShowSuscripcionModal(true);
                              }}
                            >
                              Agregar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Modal para vacuna */}
          {showVacunaModal && (
            <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Agregar vacuna al carrito</h5>
                    <button type="button" className="btn-close" onClick={() => setShowVacunaModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p><b>Vacuna:</b> {vacunaSeleccionada?.nombre}</p>
                    <div className="mb-3">
                      <label className="form-label">Fecha de vencimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        value={fechaVencimiento}
                        onChange={e => setFechaVencimiento(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowVacunaModal(false)}>Cancelar</button>
                    <button
                      className="btn btn-primary"
                      disabled={!fechaVencimiento}
                      onClick={async () => {
                        await agregarVacuna(vacunaSeleccionada.id, fechaVencimiento);
                      }}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal para suscripción */}
          {showSuscripcionModal && (
            <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Agregar suscripción al carrito</h5>
                    <button type="button" className="btn-close" onClick={() => setShowSuscripcionModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p><b>Suscripción:</b> {suscripcionSeleccionada?.nombre}</p>
                    <div className="mb-3">
                      <label className="form-label">Años de suscripción</label>
                      <input
                        type="number"
                        min={1}
                        className="form-control"
                        value={aniosSuscripcion}
                        onChange={e => setAniosSuscripcion(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowSuscripcionModal(false)}>Cancelar</button>
                    <button
                      className="btn btn-primary"
                      disabled={!aniosSuscripcion || aniosSuscripcion < 1}
                      onClick={async () => {
                        await agregarSuscripcion(suscripcionSeleccionada.id, aniosSuscripcion);
                      }}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}