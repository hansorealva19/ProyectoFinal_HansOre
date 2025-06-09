// backend/controllers/suscripcion.controller.js
const pool = require('../db');

exports.addSuscripcion = async (req, res) => {
  try {
    const { mascota_id, tipo_id, fecha_inicio, fecha_fin } = req.body;

    await pool.query(
      `INSERT INTO suscripcion (mascota_id, tipo_id, fecha_inicio, fecha_fin)
       VALUES (?, ?, ?, ?)`,
      [mascota_id, tipo_id, fecha_inicio, fecha_fin]
    );

    res.status(201).json({ message: 'Suscripción agregada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSuscripcionesByMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM suscripcion WHERE mascota_id = ? ORDER BY fecha_inicio DESC`,
      [mascotaId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSuscripciones = async (req, res) => {
  try {
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