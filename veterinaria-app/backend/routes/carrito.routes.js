const router = require('express').Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const carritoCtrl = require('../controllers/carrito.controller');

// Ver carrito actual
router.get('/mi-carrito', authMiddleware, authorizeRoles('veterinario'), carritoCtrl.getCarritoActual);

// Agregar ítem (vacuna o suscripción)
router.post('/agregar', authMiddleware, authorizeRoles('veterinario'), carritoCtrl.agregarItem);

// Quitar ítem
router.delete('/item/:itemId', authMiddleware, authorizeRoles('veterinario'), carritoCtrl.eliminarItem);

// Vaciar carrito
router.delete('/vaciar', authMiddleware, authorizeRoles('veterinario'), carritoCtrl.vaciarCarrito);

// Simular pago
router.post('/pagar', authMiddleware, authorizeRoles('veterinario'), carritoCtrl.pagarCarrito);

module.exports = router;