const pool = require('../db');

// Obtener todas las suscripciones
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