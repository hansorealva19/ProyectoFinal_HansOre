const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const { addConsulta, getConsultasByMascota } = require('../controllers/consulta.controller');

router.post('/', authMiddleware, authorizeRoles('veterinario'), addConsulta);
router.get('/:mascotaId', authMiddleware, getConsultasByMascota);

module.exports = router;