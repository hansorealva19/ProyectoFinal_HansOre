const pool = require('../db'); // <--- AGREGA ESTA LÍNEA

exports.addVacuna = async (req, res) => {
  try {
    const { mascota_id, nombre, fecha_aplicacion, proxima_dosis } = req.body;
    await pool.query(
      `INSERT INTO vacuna (mascota_id, nombre, fecha_aplicacion, proxima_dosis)
       VALUES (?, ?, ?, ?)`,
      [mascota_id, nombre, fecha_aplicacion, proxima_dosis]
    );
    res.status(201).json({ message: 'Vacuna agregada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVacunasByMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM vacuna WHERE mascota_id = ? ORDER BY fecha_aplicacion DESC`,
      [mascotaId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};