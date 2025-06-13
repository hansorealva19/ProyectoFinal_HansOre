// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173' // o el puerto donde corre tu React (Vite)
}));
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/mascotas', require('./routes/mascota.routes'));
app.use('/api/consultas', require('./routes/consulta.routes'));
app.use('/api/vacunas', require('./routes/vacuna.routes'));
app.use('/api/suscripciones', require('./routes/suscripcion.routes'));
app.use('/api/vacuna-mascota', require('./routes/vacuna_mascota.routes'));
app.use('/api/tipo-suscripcion', require('./routes/tipo_suscripcion.routes'));
app.use('/api/carrito', require('./routes/carrito.routes'));
app.use('/api/perfil', require('./routes/perfil.routes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
