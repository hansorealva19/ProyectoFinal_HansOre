const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { getCatalogo, addVacunaMascota, getVacunasByMascota } = require('../controllers/vacuna_mascota.controller');

router.get('/catalogo', authMiddleware, getCatalogo);
router.post('/', authMiddleware, authorizeRoles('veterinario'), addVacunaMascota);
router.get('/:mascotaId', authMiddleware, getVacunasByMascota);

module.exports = router;