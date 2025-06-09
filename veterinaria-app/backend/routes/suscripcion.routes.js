const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const { addSuscripcion, getSuscripcionesByMascota, getAllSuscripciones, activarSuscripcion } = require('../controllers/suscripcion.controller');

router.post('/', authMiddleware, addSuscripcion);
router.get('/:mascotaId', authMiddleware, getSuscripcionesByMascota);
router.get('/', authMiddleware, getAllSuscripciones);
router.patch('/:id/activar', authMiddleware, activarSuscripcion);

module.exports = router;