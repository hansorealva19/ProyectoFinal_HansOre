const pool = require('../db');
const bcrypt = require('bcryptjs');

// Obtener perfil del usuario autenticado
exports.getPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      `SELECT id, nombres, apellidos, fecha_nacimiento, correo, celular, dni, usuario, rol, foto_url
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
    let { nombres, apellidos, fecha_nacimiento, correo, celular, dni, password, foto_url } = req.body;

    // Validar campos requeridos
    if (!nombres || !apellidos || !correo || !dni) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar y formatear fecha_nacimiento
    if (!fecha_nacimiento) {
      return res.status(400).json({ error: 'La fecha de nacimiento es obligatoria' });
    }
    if (fecha_nacimiento.length > 10) {
      fecha_nacimiento = fecha_nacimiento.slice(0, 10);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
      return res.status(400).json({ error: 'Formato de fecha de nacimiento inválido' });
    }

    // Si no se envía foto_url, mantenemos la anterior
    if (typeof foto_url === 'undefined') {
      const [rows] = await pool.query('SELECT foto_url FROM usuario WHERE id = ?', [userId]);
      foto_url = rows.length > 0 ? rows[0].foto_url : null;
    }

    let updateQuery = `
      UPDATE usuario SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, correo = ?, celular = ?, dni = ?, foto_url = ?
    `;
    const params = [nombres, apellidos, fecha_nacimiento, correo, celular, dni, foto_url];

    if (password && password.trim() !== '') {
      const hash = await bcrypt.hash(password, 10);
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