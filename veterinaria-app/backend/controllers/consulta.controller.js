const pool = require('../db');

exports.addConsulta = async (req, res) => {
  try {
    const { mascota_id, sintomas, diagnostico, tratamiento, fecha } = req.body;
    const veterinario_id = req.user.id; // El veterinario autenticado

    await pool.query(
      `INSERT INTO consulta_veterinaria (mascota_id, veterinario_id, fecha, sintomas, diagnostico, tratamiento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [mascota_id, veterinario_id, fecha, sintomas, diagnostico, tratamiento]
    );

    res.status(201).json({ message: 'Consulta agregada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConsultasByMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const [rows] = await pool.query(
      `SELECT c.*, u.nombres AS nombre_veterinario
       FROM consulta_veterinaria c
       JOIN usuario u ON c.veterinario_id = u.id
       WHERE c.mascota_id = ?
       ORDER BY c.fecha DESC`,
      [mascotaId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { sintomas, diagnostico, tratamiento, fecha } = req.body;

    await pool.query(
      `UPDATE consulta_veterinaria
       SET sintomas = ?, diagnostico = ?, tratamiento = ?, fecha = ?
       WHERE id = ?`,
      [sintomas, diagnostico, tratamiento, fecha, id]
    );

    res.json({ message: 'Consulta actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};