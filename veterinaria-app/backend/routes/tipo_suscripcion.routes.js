// backend/routes/tipo_suscripcion.routes.js
const router = require('express').Router();
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipo_suscripcion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;