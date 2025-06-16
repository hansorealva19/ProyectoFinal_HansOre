const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { getCatalogo, addVacunaCatalogo, aumentarStock } = require('../controllers/vacuna.controller');

// Listar catálogo de vacunas
router.get('/catalogo', authMiddleware, getCatalogo);

// Registrar nueva vacuna en el catálogo
router.post('/catalogo', authMiddleware, authorizeRoles('veterinario'), addVacunaCatalogo);

// Aumentar stock de un producto
router.put('/catalogo/:id/stock', authMiddleware, authorizeRoles('veterinario'), aumentarStock);

module.exports = router;