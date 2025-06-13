const pool = require('../db');

exports.addSuscripcion = async (req, res) => {
  try {
    const { mascota_id, tipo_id, fecha_inicio, fecha_fin } = req.body;

    // Cambia TODAS las suscripciones activas de la mascota a inactiva (sin importar tipo)
    await pool.query(
      `UPDATE suscripcion SET estado = 'inactiva'
       WHERE mascota_id = ? AND estado = 'activa'`,
      [mascota_id]
    );

    // Inserta la nueva suscripción como activa
    await pool.query(
      `INSERT INTO suscripcion (mascota_id, tipo_id, fecha_inicio, fecha_fin, estado)
       VALUES (?, ?, ?, ?, 'activa')`,
      [mascota_id, tipo_id, fecha_inicio, fecha_fin]
    );
    res.status(201).json({ message: 'Suscripción agregada y activada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuscripcionesByMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    // Actualiza las vencidas antes de consultar
    await pool.query(
      `UPDATE suscripcion SET estado = 'vencida'
       WHERE fecha_fin < NOW() AND estado = 'activa' AND mascota_id = ?`,
      [mascotaId]
    );
    const [rows] = await pool.query(
      `SELECT s.*, t.nombre AS tipo_nombre
       FROM suscripcion s
       JOIN tipo_suscripcion t ON s.tipo_id = t.id
       WHERE s.mascota_id = ?
       ORDER BY s.fecha_inicio DESC`,
      [mascotaId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSuscripciones = async (req, res) => {
  try {
    // Actualiza las vencidas antes de consultar
    await pool.query(
      `UPDATE suscripcion SET estado = 'vencida'
       WHERE fecha_fin < NOW() AND estado = 'activa'`
    );
    const [rows] = await pool.query(`
      SELECT s.*, 
             m.nombre AS nombre_mascota, 
             u.nombres AS nombre_dueno, 
             u.dni AS dni_dueno,
             t.nombre AS tipo_nombre, 
             t.precio
      FROM suscripcion s
      JOIN mascota m ON s.mascota_id = m.id
      JOIN usuario u ON m.duenio_id = u.id
      JOIN tipo_suscripcion t ON s.tipo_id = t.id
      ORDER BY s.fecha_inicio DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activarSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevaFechaFin, tipo_id, fecha_inicio } = req.body;

    // Consulta el estado actual y fecha_fin
    const [rows] = await pool.query(
      `SELECT estado FROM suscripcion WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }
    const { estado } = rows[0];

    if (estado === 'vencida' || estado === 'inactiva') {
      if (!nuevaFechaFin || !tipo_id || !fecha_inicio) {
        return res.status(400).json({ error: 'Debe ingresar tipo, fecha de inicio y fecha de fin para reactivar.' });
      }
      await pool.query(
        `UPDATE suscripcion SET estado = 'activa', tipo_id = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?`,
        [tipo_id, fecha_inicio, nuevaFechaFin, id]
      );
    } else {
      await pool.query(
        `UPDATE suscripcion SET estado = 'activa' WHERE id = ?`,
        [id]
      );
    }
    res.json({ message: 'Suscripción activada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};