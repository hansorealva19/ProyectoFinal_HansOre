const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const { getAllSuscripciones } = require('../controllers/suscripcion.controller');

// Obtener todas las suscripciones
router.get('/', authMiddleware, getAllSuscripciones);

module.exports = router;