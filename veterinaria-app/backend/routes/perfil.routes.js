const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const perfilCtrl = require('../controllers/perfil.controller');

// Obtener perfil propio
router.get('/', authMiddleware, perfilCtrl.getPerfil);

// Actualizar perfil propio
router.put('/', authMiddleware, perfilCtrl.updatePerfil);

module.exports = router;