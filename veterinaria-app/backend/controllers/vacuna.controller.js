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

// Registrar nueva vacuna en el catálogo
exports.addVacunaCatalogo = async (req, res) => {
  try {
    const { nombre, especie_destino, precio, fabricante, descripcion } = req.body;

    if (!nombre || !especie_destino || !precio) {
      return res.status(400).json({ error: 'Nombre, especie destino y precio son obligatorios' });
    }

    await pool.query(
      `INSERT INTO vacuna_catalogo (nombre, especie_destino, precio, fabricante, descripcion)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, especie_destino, precio, fabricante, descripcion]
    );

    res.status(201).json({ message: 'Vacuna registrada en el catálogo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};