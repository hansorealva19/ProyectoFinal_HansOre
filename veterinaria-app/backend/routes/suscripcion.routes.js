const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const { addSuscripcion, getSuscripcionesByMascota, getAllSuscripciones } = require('../controllers/suscripcion.controller');

router.post('/', authMiddleware, addSuscripcion);
router.get('/:mascotaId', authMiddleware, getSuscripcionesByMascota);
router.get('/', authMiddleware, getAllSuscripciones);

module.exports = router;