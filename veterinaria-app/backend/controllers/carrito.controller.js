const pool = require('../db');

// Obtener el carrito activo del usuario (o crear uno si no existe)
exports.getCarritoActual = async (req, res) => {
  try {
    // NUEVO: Permitir buscar por DNI de dueño
    const dueno_dni = req.query.dueno_dni || req.body.dueno_dni;
    let usuario_id = req.user.id;

    if (dueno_dni) {
      const [users] = await pool.query('SELECT id FROM usuario WHERE dni = ?', [dueno_dni]);
      if (users.length === 0) return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
      usuario_id = users[0].id;
    }

    let [carritos] = await pool.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND estado = 'activo' LIMIT 1`, [usuario_id]
    );
    let carrito;
    if (carritos.length === 0) {
      const [result] = await pool.query(
        `INSERT INTO carrito (usuario_id) VALUES (?)`, [usuario_id]
      );
      [carritos] = await pool.query(`SELECT * FROM carrito WHERE id = ?`, [result.insertId]);
    }
    carrito = carritos[0];
    // Traer ítems
    const [items] = await pool.query(
      `SELECT ci.*, vc.nombre AS vacuna_nombre, s.id AS suscripcion_id, ts.nombre AS suscripcion_nombre
       FROM carrito_item ci
       LEFT JOIN vacuna_catalogo vc ON ci.vacuna_catalogo_id = vc.id
       LEFT JOIN suscripcion s ON ci.suscripcion_id = s.id
       LEFT JOIN tipo_suscripcion ts ON s.tipo_id = ts.id
       WHERE ci.carrito_id = ?`, [carrito.id]
    );
    res.json({ carrito, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar ítem al carrito
exports.agregarItem = async (req, res) => {
  try {
    const { dueno_dni, tipo, vacuna_catalogo_id, tipo_suscripcion_id, cantidad, mascota_id, fecha_vencimiento } = req.body;

    // Buscar usuario_id por DNI
    const [users] = await pool.query('SELECT id FROM usuario WHERE dni = ?', [dueno_dni]);
    if (users.length === 0) return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    const usuario_id = users[0].id;

    // Obtener o crear carrito activo para ese usuario_id
    let [carritos] = await pool.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND estado = 'activo' LIMIT 1`, [usuario_id]
    );
    let carrito;
    if (carritos.length === 0) {
      const [result] = await pool.query(
        `INSERT INTO carrito (usuario_id) VALUES (?)`, [usuario_id]
      );
      [carritos] = await pool.query(`SELECT * FROM carrito WHERE id = ?`, [result.insertId]);
    }
    carrito = carritos[0];

    let precio_unitario = 0;

    if (tipo === 'vacuna') {
      const [vacunas] = await pool.query(`SELECT precio FROM vacuna_catalogo WHERE id = ?`, [vacuna_catalogo_id]);
      if (vacunas.length === 0) return res.status(400).json({ error: 'Vacuna no encontrada' });
      precio_unitario = vacunas[0].precio;
    } else if (tipo === 'suscripcion') {
      const [tipos] = await pool.query(
        `SELECT precio FROM tipo_suscripcion WHERE id = ?`, [tipo_suscripcion_id]
      );
      if (tipos.length === 0) return res.status(400).json({ error: 'Tipo de suscripción no encontrado' });
      precio_unitario = tipos[0].precio;
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const cant = cantidad || 1;
    const total = precio_unitario * cant;

    await pool.query(
      `INSERT INTO carrito_item (carrito_id, tipo, vacuna_catalogo_id, cantidad, precio_unitario, total, mascota_id, fecha_vencimiento, tipo_suscripcion_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        carrito.id,
        tipo,
        vacuna_catalogo_id || null,
        cant,
        precio_unitario,
        total,
        mascota_id || null,
        fecha_vencimiento || null,
        tipo_suscripcion_id || null
      ]
    );
    res.json({ message: 'Ítem agregado al carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar ítem del carrito
exports.eliminarItem = async (req, res) => {
  try {
    const dueno_dni = req.body.dueno_dni || req.query.dueno_dni;
    const { itemId } = req.params;
    if (!dueno_dni) return res.status(400).json({ error: 'Debe enviar el DNI del dueño' });

    // Busca el usuario dueño
    const [users] = await pool.query('SELECT id FROM usuario WHERE dni = ?', [dueno_dni]);
    if (users.length === 0) return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    const usuario_id = users[0].id;

    // Verifica que el ítem pertenezca a un carrito activo del dueño
    const [items] = await pool.query(
      `SELECT ci.* FROM carrito_item ci
       JOIN carrito c ON ci.carrito_id = c.id
       WHERE ci.id = ? AND c.usuario_id = ? AND c.estado = 'activo'`,
      [itemId, usuario_id]
    );
    if (items.length === 0) return res.status(404).json({ error: 'Ítem no encontrado' });
    await pool.query(`DELETE FROM carrito_item WHERE id = ?`, [itemId]);
    res.json({ message: 'Ítem eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.vaciarCarrito = async (req, res) => {
  try {
    const dueno_dni = req.body.dueno_dni || req.query.dueno_dni;
    if (!dueno_dni) return res.status(400).json({ error: 'Debe enviar el DNI del dueño' });

    // Busca el usuario dueño
    const [users] = await pool.query('SELECT id FROM usuario WHERE dni = ?', [dueno_dni]);
    if (users.length === 0) return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    const usuario_id = users[0].id;

    // Busca el carrito activo
    const [carritos] = await pool.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND estado = 'activo' LIMIT 1`, [usuario_id]
    );
    if (carritos.length === 0) return res.json({ message: 'Carrito ya vacío' });
    const carrito = carritos[0];
    await pool.query(`DELETE FROM carrito_item WHERE carrito_id = ?`, [carrito.id]);
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Simular pago del carrito
exports.pagarCarrito = async (req, res) => {
  try {
    const dueno_dni = req.body.dueno_dni || req.query.dueno_dni;
    const { metodo = 'simulado' } = req.body;

    // Busca el usuario dueño
    const [users] = await pool.query('SELECT id FROM usuario WHERE dni = ?', [dueno_dni]);
    if (users.length === 0) return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    const usuario_id = users[0].id;

    // Busca el carrito activo
    const [carritos] = await pool.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND estado = 'activo' LIMIT 1`, [usuario_id]
    );
    if (carritos.length === 0) return res.status(400).json({ error: 'No hay carrito activo' });
    const carrito = carritos[0];

    // Suma total
    const [itemsTotal] = await pool.query(
      `SELECT SUM(total) AS total FROM carrito_item WHERE carrito_id = ?`, [carrito.id]
    );
    const monto_total = itemsTotal[0].total || 0;
    if (monto_total === 0) return res.status(400).json({ error: 'El carrito está vacío' });

    // Simula pago exitoso
    await pool.query(
      `INSERT INTO pago (carrito_id, usuario_id, monto_total, metodo, estado)
       VALUES (?, ?, ?, ?, 'exitoso')`,
      [carrito.id, usuario_id, monto_total, metodo]
    );
    // Cambia estado del carrito a comprado
    await pool.query(
      `UPDATE carrito SET estado = 'comprado' WHERE id = ?`, [carrito.id]
    );

    // REGISTRAR VACUNAS Y SUSCRIPCIONES EN LA MASCOTA
    const [items] = await pool.query(
      `SELECT * FROM carrito_item WHERE carrito_id = ?`, [carrito.id]
    );
    for (const item of items) {
      // VACUNA
      if (item.tipo === 'vacuna' && item.vacuna_catalogo_id && item.mascota_id) {
        await pool.query(
          `INSERT INTO vacuna_mascota (mascota_id, vacuna_id, fecha_aplicacion, fecha_vencimiento, veterinario_id)
           VALUES (?, ?, NOW(), ?, ?)`,
          [item.mascota_id, item.vacuna_catalogo_id, item.fecha_vencimiento, req.user.id]
        );
      }
      // SUSCRIPCIÓN
      if (item.tipo === 'suscripcion' && item.mascota_id && item.tipo_suscripcion_id) {
        // Cambia TODAS las suscripciones activas de la mascota a inactiva (sin importar tipo)
        await pool.query(
          `UPDATE suscripcion SET estado = 'inactiva'
           WHERE mascota_id = ? AND estado = 'activa'`,
          [item.mascota_id]
        );

        // La nueva suscripción inicia HOY
        let fecha_inicio = new Date();
        let duracion = item.cantidad || 1; // años
        let fecha_fin = new Date(fecha_inicio);
        fecha_fin.setFullYear(fecha_inicio.getFullYear() + duracion);

        // Inserta la nueva suscripción como activa
        await pool.query(
          `INSERT INTO suscripcion (mascota_id, tipo_id, fecha_inicio, fecha_fin, estado)
           VALUES (?, ?, ?, ?, 'activa')`,
          [item.mascota_id, item.tipo_suscripcion_id, fecha_inicio, fecha_fin]
        );
      }
    }

    res.json({ message: 'Pago registrado exitosamente', monto_total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};