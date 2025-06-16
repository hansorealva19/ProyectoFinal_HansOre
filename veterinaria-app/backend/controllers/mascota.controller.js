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

exports.getHistoriaClinica = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la mascota existe
    const [mascotaRows] = await pool.query('SELECT * FROM mascota WHERE id = ?', [id]);
    if (mascotaRows.length === 0) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    const mascota = mascotaRows[0];

    // Obtener consultas veterinarias
    const [consultas] = await pool.query(
      `SELECT c.*, u.nombres AS nombre_veterinario
       FROM consulta_veterinaria c
       JOIN usuario u ON c.veterinario_id = u.id
       WHERE c.mascota_id = ?
       ORDER BY c.fecha DESC`,
      [id]
    );

    // Obtener vacunas aplicadas
    const [vacunas] = await pool.query(
      `SELECT 
         vm.id,
         vm.mascota_id,
         vm.vacuna_id,
         DATE_FORMAT(vm.fecha_aplicacion, '%Y-%m-%d') AS fecha_aplicacion,
         DATE_FORMAT(vm.fecha_vencimiento, '%Y-%m-%d') AS fecha_vencimiento,
         vm.veterinario_id,
         vc.nombre      AS nombre_vacuna,
         vc.fabricante  AS fabricante
       FROM vacuna_mascota vm
       JOIN vacuna_catalogo vc 
         ON vm.vacuna_id = vc.id
       WHERE vm.mascota_id = ?
       ORDER BY vm.fecha_aplicacion DESC`,
      [id]
    );

    // Obtener suscripciones
    const [suscripciones] = await pool.query(
      `SELECT s.*, ts.nombre AS tipo_nombre
         FROM suscripcion s
         JOIN tipo_suscripcion ts ON s.tipo_id = ts.id
        WHERE s.mascota_id = ?
        ORDER BY s.fecha_inicio DESC`,
      [id]
    );

    res.json({ 
      mascota:    mascotaRows[0],
      consultas, 
      vacunas, 
      suscripciones 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};