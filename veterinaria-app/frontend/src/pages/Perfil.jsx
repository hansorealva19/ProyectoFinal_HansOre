import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqixr8zcs/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'sin_firma';

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/perfil');
        setPerfil(res.data);
        formik.setValues({ ...res.data, password: '' });
      } catch (e) {
        setMensaje('Error al cargar perfil: ' + e.message);
      }
    };
    fetchPerfil();
  }, []);

  // Función para calcular la fuerza de la contraseña y actualizar los checks
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8, // Mínimo 8 caracteres
      uppercase: /[A-Z]/.test(password), // Al menos una mayúscula
      lowercase: /[a-z]/.test(password), // Al menos una minúscula
      number: /\d/.test(password), // Al menos un número
      specialChar: /[@$!%*?&]/.test(password), // Al menos un carácter especial
    };

    // Calcular fuerza basada en los checks cumplidos
    Object.values(checks).forEach((check) => {
      if (check) strength += 20;
    });

    setPasswordChecks(checks);
    return strength;
  };

  // Configuración de Formik y Yup
  const formik = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      correo: '',
      celular: '',
      dni: '',
      password: '',
      foto_url: '',
    },
    validationSchema: Yup.object({
      nombres: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Los nombres solo pueden contener letras')
        .min(2, 'Debe tener al menos 2 caracteres')
        .required('Los nombres son obligatorios'),
      apellidos: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Los apellidos solo pueden contener letras')
        .min(2, 'Debe tener al menos 2 caracteres')
        .required('Los apellidos son obligatorios'),
      fecha_nacimiento: Yup.date()
        .required('La fecha de nacimiento es obligatoria'),
      correo: Yup.string()
        .email('Debe ser un correo válido')
        .required('El correo es obligatorio'),
      celular: Yup.string()
        .matches(/^\d{9}$/, 'El celular debe tener 9 dígitos'),
      dni: Yup.string()
        .matches(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos')
        .required('El DNI es obligatorio'),
      password: Yup.string()
        .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .matches(/\d/, 'Debe contener al menos un número')
        .matches(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@$!%*?&)')
        .min(8, 'Debe tener al menos 8 caracteres')
        .notRequired(), // La contraseña es opcional
    }),
    onSubmit: async (values) => {
      try {
        const data = {
          ...values,
          fecha_nacimiento: values.fecha_nacimiento
            ? values.fecha_nacimiento.slice(0, 10)
            : '',
        };
        await api.put('/perfil', data);
        setMensaje('Perfil actualizado correctamente');
        setEditando(false);

        const res = await api.get('/perfil');
        setPerfil(res.data);
        formik.setValues({ ...res.data, password: '' });
      } catch (e) {
        setMensaje('Error al actualizar perfil: ' + (e.response?.data?.error || e.message));
      }
    },
  });

  // Manejar cambios en la contraseña para calcular la fuerza
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    formik.handleChange(e);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  // Manejar la subida de archivos
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMensaje('La imagen es demasiado grande (máx 2 MB)');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setMensaje('Solo se permiten archivos de imagen');
      return;
    }
    setSubiendo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        formik.setFieldValue('foto_url', data.secure_url);
        setMensaje('Foto subida correctamente');
      } else {
        setMensaje('Error al subir imagen: ' + (data.error?.message || JSON.stringify(data)));
      }
    } catch {
      setMensaje('Error al subir imagen');
    }
    setSubiendo(false);
  };

  if (!perfil) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">Mi Perfil</h2>
        </div>
        <div className="card-body">
          {mensaje && <div className="alert alert-info">{mensaje}</div>}

          {/* Mostrar foto de perfil */}
          <div className="text-center mb-4">
            <img
              src={formik.values.foto_url || perfil.foto_url || 'https://via.placeholder.com/120'}
              alt="Foto de perfil"
              className="rounded-circle shadow"
              style={{ width: 120, height: 120, objectFit: 'cover', border: '3px solid #ccc' }}
            />
          </div>

          {!editando ? (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <b>Nombres:</b> {perfil.nombres}
                </div>
                <div className="col-md-6">
                  <b>Apellidos:</b> {perfil.apellidos}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <b>Fecha de nacimiento:</b> {perfil.fecha_nacimiento?.slice(0, 10)}
                </div>
                <div className="col-md-6">
                  <b>Correo:</b> {perfil.correo}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <b>Celular:</b> {perfil.celular || '-'}
                </div>
                <div className="col-md-6">
                  <b>DNI:</b> {perfil.dni}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <b>Usuario:</b> {perfil.usuario}
                </div>
                <div className="col-md-6">
                  <b>Rol:</b> {perfil.rol}
                </div>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setEditando(true)}
                >
                  Editar Perfil
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3 text-center">
                <label className="form-label">Foto de perfil</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                  disabled={subiendo}
                />
                {subiendo && <div className="text-info mt-2">Subiendo imagen...</div>}
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombres</label>
                  <input
                    name="nombres"
                    className={`form-control ${formik.touched.nombres && formik.errors.nombres ? 'is-invalid' : ''}`}
                    value={formik.values.nombres}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.nombres && formik.errors.nombres && (
                    <div className="invalid-feedback">{formik.errors.nombres}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellidos</label>
                  <input
                    name="apellidos"
                    className={`form-control ${formik.touched.apellidos && formik.errors.apellidos ? 'is-invalid' : ''}`}
                    value={formik.values.apellidos}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.apellidos && formik.errors.apellidos && (
                    <div className="invalid-feedback">{formik.errors.apellidos}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    className={`form-control ${formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento ? 'is-invalid' : ''}`}
                    value={formik.values.fecha_nacimiento?.slice(0, 10) || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento && (
                    <div className="invalid-feedback">{formik.errors.fecha_nacimiento}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    name="correo"
                    className={`form-control ${formik.touched.correo && formik.errors.correo ? 'is-invalid' : ''}`}
                    value={formik.values.correo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.correo && formik.errors.correo && (
                    <div className="invalid-feedback">{formik.errors.correo}</div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Celular</label>
                  <input
                    name="celular"
                    className={`form-control ${formik.touched.celular && formik.errors.celular ? 'is-invalid' : ''}`}
                    value={formik.values.celular || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.celular && formik.errors.celular && (
                    <div className="invalid-feedback">{formik.errors.celular}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">DNI</label>
                  <input
                    name="dni"
                    className={`form-control ${formik.touched.dni && formik.errors.dni ? 'is-invalid' : ''}`}
                    value={formik.values.dni}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.dni && formik.errors.dni && (
                    <div className="invalid-feedback">{formik.errors.dni}</div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Nueva contraseña (opcional)</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                  value={formik.values.password}
                  onChange={(e) => {
                    handlePasswordChange(e);
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Dejar en blanco para no cambiar"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="invalid-feedback">{formik.errors.password}</div>
                )}
                {/* Barra de progreso */}
                <div className="progress mt-2">
                  <div
                    className={`progress-bar ${passwordStrength < 60 ? 'bg-danger' : passwordStrength < 100 ? 'bg-warning' : 'bg-success'}`}
                    role="progressbar"
                    style={{ width: `${passwordStrength}%` }}
                    aria-valuenow={passwordStrength}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {passwordStrength}%
                  </div>
                </div>
                {/* Lista de requisitos */}
                <ul className="mt-3">
                  <li className={passwordChecks.length ? 'text-success' : 'text-danger'}>
                    {passwordChecks.length ? '✔' : '✘'} Al menos 8 caracteres
                  </li>
                  <li className={passwordChecks.uppercase ? 'text-success' : 'text-danger'}>
                    {passwordChecks.uppercase ? '✔' : '✘'} Al menos una letra mayúscula
                  </li>
                  <li className={passwordChecks.lowercase ? 'text-success' : 'text-danger'}>
                    {passwordChecks.lowercase ? '✔' : '✘'} Al menos una letra minúscula
                  </li>
                  <li className={passwordChecks.number ? 'text-success' : 'text-danger'}>
                    {passwordChecks.number ? '✔' : '✘'} Al menos un número
                  </li>
                  <li className={passwordChecks.specialChar ? 'text-success' : 'text-danger'}>
                    {passwordChecks.specialChar ? '✔' : '✘'} Al menos un carácter especial (@$!%*?&)
                  </li>
                </ul>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-success" type="submit">Guardar Cambios</button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditando(false);
                    formik.resetForm();
                    formik.setValues({ ...perfil, password: '' });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}