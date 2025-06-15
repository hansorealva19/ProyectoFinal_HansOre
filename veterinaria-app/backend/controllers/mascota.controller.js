const pool = require('../db');

// Agregar una mascota nueva
exports.addMascota = async (req, res) => {
  try {
    if (req.user.rol !== 'veterinario') {
      return res.status(403).json({ error: 'No autorizado para agregar mascotas' });
    }

    const { nombre, especie, raza, fecha_nacimiento, dueno_dni } = req.body;

    // Buscar dueño por DNI
    const [users] = await pool.query('SELECT id FROM usuario WHERE dni = ?', [dueno_dni]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    }
    const duenio_id = users[0].id;

    // Insertar mascota con duenio_id correcto
    await pool.query(
      `INSERT INTO mascota (nombre, fecha_nacimiento, especie, raza, duenio_id) VALUES (?, ?, ?, ?, ?)`,
      [nombre, fecha_nacimiento, especie, raza, duenio_id]
    );

    res.status(201).json({ message: 'Mascota agregada correctamente' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las mascotas según rol del usuario
exports.getMascotas = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRol = req.user.rol;

    let query = '';
    let params = [];

    if (userRol === 'veterinario') {
      query = `
        SELECT m.*, u.nombres AS nombre_dueño, u.dni 
        FROM mascota m 
        JOIN usuario u ON m.duenio_id = u.id
      `;
    } else if (userRol === 'dueño') {
      query = 'SELECT * FROM mascota WHERE duenio_id = ?';
      params = [userId];
    } else {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener mascota por ID, con validación de rol y dueño
exports.getMascotaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.rol === 'veterinario') {
      const [rows] = await pool.query('SELECT * FROM mascota WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Mascota no encontrada' });
      res.json(rows[0]);
    } else if (req.user.rol === 'dueño') {
      const duenio_id = req.user.id;
      const [rows] = await pool.query('SELECT * FROM mascota WHERE id = ? AND duenio_id = ?', [id, duenio_id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Mascota no encontrada' });
      res.json(rows[0]);
    } else {
      return res.status(403).json({ error: 'No autorizado' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar foto de perfil de la mascota
exports.actualizarFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { foto_url } = req.body;
    if (!foto_url) return res.status(400).json({ error: 'Debe enviar la URL de la foto' });

    // Opcional: validar que el usuario tenga permiso sobre la mascota

    await pool.query('UPDATE mascota SET foto_url = ? WHERE id = ?', [foto_url, id]);
    res.json({ message: 'Foto de mascota actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};