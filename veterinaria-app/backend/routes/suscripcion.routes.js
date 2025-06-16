const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const { getAllSuscripciones, getSuscripcionById } = require('../controllers/suscripcion.controller');

// Obtener todas las suscripciones
router.get('/', authMiddleware, getAllSuscripciones);

// Obtener una suscripción por ID
router.get('/:id', authMiddleware, getSuscripcionById);

module.exports = router;