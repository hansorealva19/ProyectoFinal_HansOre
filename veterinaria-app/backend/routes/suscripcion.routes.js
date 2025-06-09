// backend/routes/suscripcion.routes.js
const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');  // Importa authMiddleware
const { addSuscripcion, getSuscripcionesByMascota } = require('../controllers/suscripcion.controller');

router.post('/', authMiddleware, addSuscripcion);
router.get('/:mascotaId', authMiddleware, getSuscripcionesByMascota);

module.exports = router;
