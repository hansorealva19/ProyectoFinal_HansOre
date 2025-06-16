import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { register } from '../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

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
      usuario: '',
      password: '',
      rol: 'dueño',
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
        .matches(/^\d{9}$/, 'El celular debe tener 9 dígitos')
        .required('El celular es obligatorio'),
      dni: Yup.string()
        .matches(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos')
        .required('El DNI es obligatorio'),
      usuario: Yup.string()
        .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'El usuario no puede empezar con números y solo puede contener letras, números y guiones bajos')
        .min(4, 'El usuario debe tener al menos 4 caracteres')
        .required('El usuario es obligatorio'),
      password: Yup.string()
        .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .matches(/\d/, 'Debe contener al menos un número')
        .matches(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@$!%*?&)')
        .min(8, 'Debe tener al menos 8 caracteres') // Mínimo 8 caracteres
        .required('La contraseña es obligatoria'),
      rol: Yup.string()
        .oneOf(['dueño', 'veterinario'], 'Rol inválido')
        .required('El rol es obligatorio'),
    }),
    onSubmit: async (values) => {
      try {
        await register(values);
        alert('Usuario registrado');
        navigate('/login'); // Redirige al login tras registro exitoso
      } catch (err) {
        alert('Error: ' + err.response?.data?.error || 'Error al registrar usuario');
      }
    },
  });

  // Actualizar la fuerza de la contraseña y los checks
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    formik.handleChange(e);
    setPasswordStrength(calculatePasswordStrength(password));
  };

  // Función para cancelar el registro
  const handleCancel = () => {
    formik.resetForm(); // Restablece el formulario
    navigate('/'); // Redirige a la página de inicio o cualquier otra página
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Registro</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="nombres">Nombres</label>
              <input
                id="nombres"
                name="nombres"
                placeholder="Nombres"
                className={`form-control ${formik.touched.nombres && formik.errors.nombres ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombres}
              />
              {formik.touched.nombres && formik.errors.nombres && (
                <div className="invalid-feedback">{formik.errors.nombres}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos"
                name="apellidos"
                placeholder="Apellidos"
                className={`form-control ${formik.touched.apellidos && formik.errors.apellidos ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellidos}
              />
              {formik.touched.apellidos && formik.errors.apellidos && (
                <div className="invalid-feedback">{formik.errors.apellidos}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                className={`form-control ${formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fecha_nacimiento}
              />
              {formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento && (
                <div className="invalid-feedback">{formik.errors.fecha_nacimiento}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                placeholder="Correo"
                className={`form-control ${formik.touched.correo && formik.errors.correo ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.correo}
              />
              {formik.touched.correo && formik.errors.correo && (
                <div className="invalid-feedback">{formik.errors.correo}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="celular">Celular</label>
              <input
                id="celular"
                name="celular"
                placeholder="Celular"
                className={`form-control ${formik.touched.celular && formik.errors.celular ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.celular}
              />
              {formik.touched.celular && formik.errors.celular && (
                <div className="invalid-feedback">{formik.errors.celular}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="dni">DNI</label>
              <input
                id="dni"
                name="dni"
                placeholder="DNI"
                className={`form-control ${formik.touched.dni && formik.errors.dni ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dni}
              />
              {formik.touched.dni && formik.errors.dni && (
                <div className="invalid-feedback">{formik.errors.dni}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                name="usuario"
                placeholder="Usuario"
                className={`form-control ${formik.touched.usuario && formik.errors.usuario ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.usuario}
              />
              {formik.touched.usuario && formik.errors.usuario && (
                <div className="invalid-feedback">{formik.errors.usuario}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                onChange={handlePasswordChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
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
            <div className="mb-3">
              <label className="form-label" htmlFor="rol">Rol</label>
              <select
                id="rol"
                name="rol"
                className={`form-select ${formik.touched.rol && formik.errors.rol ? 'is-invalid' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.rol}
              >
                <option value="dueño">Dueño</option>
                <option value="veterinario">Veterinario</option>
              </select>
              {formik.touched.rol && formik.errors.rol && (
                <div className="invalid-feedback">{formik.errors.rol}</div>
              )}
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success">Registrar</button>
              <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}