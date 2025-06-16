const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { getCatalogo, addVacunaCatalogo } = require('../controllers/vacuna.controller');

// Listar catálogo de vacunas
router.get('/catalogo', authMiddleware, getCatalogo);

// Registrar nueva vacuna en el catálogo
router.post('/catalogo', authMiddleware, authorizeRoles('veterinario'), addVacunaCatalogo);

module.exports = router;