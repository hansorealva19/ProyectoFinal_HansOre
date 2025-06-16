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
    const { nombre, especie_destino, precio, fabricante, descripcion, stock } = req.body;

    if (!nombre || !especie_destino || !precio || stock === undefined) {
      return res.status(400).json({ error: 'Nombre, especie destino, precio y stock son obligatorios' });
    }

    await pool.query(
      `INSERT INTO vacuna_catalogo (nombre, especie_destino, precio, fabricante, descripcion, stock)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, especie_destino, precio, fabricante, descripcion, stock]
    );

    res.status(201).json({ message: 'Vacuna registrada en el catálogo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aumentar stock de un producto
exports.aumentarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    await pool.query(
      `UPDATE vacuna_catalogo SET stock = stock + ? WHERE id = ?`,
      [cantidad, id]
    );

    res.json({ message: 'Stock actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};