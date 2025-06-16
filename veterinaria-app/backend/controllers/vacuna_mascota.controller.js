const pool = require('../db');

// Listar catálogo de vacunas
exports.getCatalogo = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vacuna_catalogo');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar vacuna aplicada a mascota
exports.addVacunaMascota = async (req, res) => {
  try {
    const { mascota_id, vacuna_id, fecha_aplicacion, fecha_vencimiento } = req.body;
    const veterinario_id = req.user.id;
    await pool.query(
      `INSERT INTO vacuna_mascota (mascota_id, vacuna_id, fecha_aplicacion, fecha_vencimiento, veterinario_id)
       VALUES (?, ?, ?, ?, ?)`,
      [mascota_id, vacuna_id, fecha_aplicacion, fecha_vencimiento, veterinario_id]
    );
    res.status(201).json({ message: 'Vacuna registrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar vacunas aplicadas a una mascota
exports.getVacunasByMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params;
    const [rows] = await pool.query(
      `SELECT vm.*, vc.nombre AS nombre_vacuna, vc.descripcion, vc.fabricante, vm.fecha_vencimiento
       FROM vacuna_mascota vm
       JOIN vacuna_catalogo vc ON vm.vacuna_id = vc.id
       WHERE vm.mascota_id = ?
       ORDER BY vm.fecha_aplicacion DESC`,
      [mascotaId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};