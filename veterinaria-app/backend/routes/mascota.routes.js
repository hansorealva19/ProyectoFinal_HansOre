const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { addMascota, getHistoriaClinica, getMascotas, getMascotaById, actualizarFoto } = require('../controllers/mascota.controller');

// Listar mascotas (dueños solo ven las suyas)
router.get('/', authMiddleware, getMascotas);

// Obtener una mascota por ID (dueños solo pueden ver las suyas)
router.get('/:id', authMiddleware, getMascotaById);

// Obtener historia clínica de una mascota (dueños solo pueden ver las suyas)
router.get('/:id/historia', authMiddleware, getHistoriaClinica);

// Agregar una nueva mascota (solo veterinarios)
router.post('/', authMiddleware, authorizeRoles('veterinario'), addMascota);

// Actualizar foto de mascota (dueños solo pueden actualizar las suyas)
router.put('/:id/foto', authMiddleware, actualizarFoto);

module.exports = router;