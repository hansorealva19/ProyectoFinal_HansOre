// backend/routes/vacuna.routes.js
const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth.js');  // O como sea que llames al middleware de autenticación
const { addVacuna, getVacunasByMascota } = require('../controllers/vacuna.controller.js');

router.post('/', authMiddleware, addVacuna);
router.get('/:mascotaId', authMiddleware, getVacunasByMascota);

module.exports = router;
