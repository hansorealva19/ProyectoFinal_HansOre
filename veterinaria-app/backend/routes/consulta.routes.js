const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const consultaCtrl = require('../controllers/consulta.controller'); // Importar el controlador

// Registrar una nueva consulta
router.post('/', authMiddleware, authorizeRoles('veterinario'), consultaCtrl.addConsulta);

// Obtener consultas por mascota
router.get('/:mascotaId', authMiddleware, consultaCtrl.getConsultasByMascota);

// Actualizar una consulta existente
router.put('/:id', authMiddleware, authorizeRoles('veterinario'), consultaCtrl.updateConsulta);

module.exports = router;