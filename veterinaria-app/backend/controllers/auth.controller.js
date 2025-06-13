const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, correo, celular, dni, usuario, password, rol } = req.body;

    // Validación de campos obligatorios
    if (!nombres || !apellidos || !fecha_nacimiento || !correo || !celular || !dni || !usuario || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    // Validar formato de DNI (ejemplo: 8 dígitos)
    if (!/^\d{8}$/.test(dni)) {
      return res.status(400).json({ error: 'El DNI debe tener 8 dígitos numéricos' });
    }

    const [exists] = await pool.query('SELECT * FROM usuario WHERE usuario = ?', [usuario]);
    if (exists.length > 0) return res.status(400).json({ error: 'Usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO usuario (nombres, apellidos, fecha_nacimiento, correo, celular, dni, usuario, password, rol) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombres, apellidos, fecha_nacimiento, correo, celular, dni, usuario, hash, rol]
    );

    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM usuario WHERE usuario = ?', [usuario]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no existe' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, nombres: user.nombres, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};