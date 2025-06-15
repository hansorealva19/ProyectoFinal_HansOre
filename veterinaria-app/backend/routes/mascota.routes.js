const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { addMascota, getMascotas, getMascotaById, actualizarFoto } = require('../controllers/mascota.controller');

router.get('/', authMiddleware, getMascotas);
router.get('/:id', authMiddleware, getMascotaById);
router.post('/', authMiddleware, authorizeRoles('veterinario'), addMascota);

// Nueva ruta para actualizar la foto de la mascota
router.put('/:id/foto', authMiddleware, actualizarFoto);

module.exports = router;