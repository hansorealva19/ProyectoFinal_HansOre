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