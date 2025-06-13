const pool = require('../db');
const bcrypt = require('bcryptjs');

// Obtener perfil del usuario autenticado
exports.getPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, nombres, apellidos, fecha_nacimiento, correo, celular, dni, usuario, rol
       FROM usuario WHERE id = ?`, [userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar perfil del usuario autenticado
exports.updatePerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    let { nombres, apellidos, fecha_nacimiento, correo, celular, dni, password } = req.body;

    // Validar campos requeridos
    if (!nombres || !apellidos || !correo || !dni) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar y formatear fecha_nacimiento
    if (!fecha_nacimiento) {
      return res.status(400).json({ error: 'La fecha de nacimiento es obligatoria' });
    }
    // Si viene en formato ISO, recorta a YYYY-MM-DD
    if (fecha_nacimiento.length > 10) {
      fecha_nacimiento = fecha_nacimiento.slice(0, 10);
    }
    // Validar formato final
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
      return res.status(400).json({ error: 'Formato de fecha de nacimiento inválido' });
    }

    // Si se envía password, hashearla
    let updateQuery = `
      UPDATE usuario SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, correo = ?, celular = ?, dni = ?
    `;
    const params = [nombres, apellidos, fecha_nacimiento, correo, celular, dni];

    if (password && password.trim() !== '') {
      const hash = await require('bcryptjs').hash(password, 10);
      updateQuery += `, password = ?`;
      params.push(hash);
    }

    updateQuery += ` WHERE id = ?`;
    params.push(userId);

    await pool.query(updateQuery, params);

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};