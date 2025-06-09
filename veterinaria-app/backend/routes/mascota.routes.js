const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { addMascota, getMascotas, getMascotaById } = require('../controllers/mascota.controller');

router.get('/', authMiddleware, getMascotas);  // Todos autenticados pueden ver, pero la lógica controla según rol
router.get('/:id', authMiddleware, getMascotaById);

// Solo veterinarios pueden agregar mascotas
router.post('/', authMiddleware, authorizeRoles('veterinario'), addMascota);

module.exports = router;