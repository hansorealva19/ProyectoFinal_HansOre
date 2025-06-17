const pool = require('../db');

// Obtener el carrito activo del usuario (o crear uno si no existe)
exports.getCarritoActual = async (req, res) => {
  try {
    const dueno_dni = req.query.dueno_dni || req.body.dueno_dni;
    let usuario_id = req.user.id;

    if (dueno_dni) {
      const [users] = await pool.query(
        'SELECT id FROM usuario WHERE dni = ?',
        [dueno_dni]
      );
      if (users.length === 0) {
        return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
      }
      usuario_id = users[0].id;
    }

    let [carritos] = await pool.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND estado = 'activo' LIMIT 1`,
      [usuario_id]
    );
    if (carritos.length === 0) {
      const [result] = await pool.query(
        'INSERT INTO carrito (usuario_id) VALUES (?)',
        [usuario_id]
      );
      [carritos] = await pool.query(
        'SELECT * FROM carrito WHERE id = ?',
        [result.insertId]
      );
    }
    const carrito = carritos[0];

    const [items] = await pool.query(
      `SELECT 
         ci.*,
         vc.nombre  AS vacuna_nombre,
         ts.nombre  AS suscripcion_nombre,
         m.nombre   AS mascota_nombre
       FROM carrito_item ci
       LEFT JOIN vacuna_catalogo vc ON ci.vacuna_catalogo_id    = vc.id
       LEFT JOIN tipo_suscripcion ts ON ci.tipo_suscripcion_id = ts.id
       LEFT JOIN mascota m           ON ci.mascota_id          = m.id
       WHERE ci.carrito_id = ?`,
      [carrito.id]
    );

    res.json({ carrito, items });
  } catch (error) {
    console.error('getCarritoActual error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Agregar ítem al carrito (vacuna o suscripción)
exports.agregarItem = async (req, res) => {
  try {
    const {
      dueno_dni,
      tipo,
      vacuna_catalogo_id,
      tipo_suscripcion_id,
      cantidad = 1,
      mascota_id,
      fecha_vencimiento
    } = req.body;

    // Verificar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // 1) Obtener usuario_id por DNI
    const [users] = await pool.query(
      'SELECT id FROM usuario WHERE dni = ?',
      [dueno_dni]
    );
    if (users.length === 0) {
      return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    }
    const usuario_id = users[0].id;

    // 2) Obtener o crear carrito activo
    let [carritos] = await pool.query(
      `SELECT * FROM carrito WHERE usuario_id = ? AND estado = 'activo' LIMIT 1`,
      [usuario_id]
    );
    if (carritos.length === 0) {
      const [r] = await pool.query(
        'INSERT INTO carrito (usuario_id) VALUES (?)',
        [usuario_id]
      );
      [carritos] = await pool.query(
        'SELECT * FROM carrito WHERE id = ?',
        [r.insertId]
      );
    }
    const carrito = carritos[0];

    // 3) Calcular precio_unitario y actualizar stock si es vacuna
    let precio_unitario = 0;
    if (tipo === 'vacuna') {
      const [[vacuna]] = await pool.query(
        'SELECT stock, precio FROM vacuna_catalogo WHERE id = ?',
        [vacuna_catalogo_id]
      );
      if (!vacuna) {
        return res.status(404).json({ error: 'Vacuna no encontrada' });
      }
      if (vacuna.stock < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
      await pool.query(
        'UPDATE vacuna_catalogo SET stock = stock - ? WHERE id = ?',
        [cantidad, vacuna_catalogo_id]
      );
      precio_unitario = vacuna.precio;
    } else if (tipo === 'suscripcion') {
      const [[ts]] = await pool.query(
        'SELECT precio FROM tipo_suscripcion WHERE id = ?',
        [tipo_suscripcion_id]
      );
      if (!ts) {
        return res.status(404).json({ error: 'Tipo de suscripción no encontrado' });
      }
      precio_unitario = ts.precio;
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    // 4) Insertar ítem
    const cant = cantidad;
    const total = precio_unitario * cant;
    await pool.query(
      `INSERT INTO carrito_item
         (carrito_id, tipo, vacuna_catalogo_id, tipo_suscripcion_id,
          mascota_id, cantidad, precio_unitario, total, fecha_vencimiento, veterinario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        carrito.id,
        tipo,
        tipo === 'vacuna' ? vacuna_catalogo_id : null,
        tipo === 'suscripcion' ? tipo_suscripcion_id : null,
        mascota_id || null,
        cant,
        precio_unitario,
        total,
        fecha_vencimiento || null,
        req.user.id // Aquí se asume que el veterinario está autenticado
      ]
    );

    res.json({ message: 'Ítem agregado al carrito' });
  } catch (error) {
    console.error('agregarItem error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar ítem del carrito
exports.eliminarItem = async (req, res) => {
  try {
    const dueno_dni = req.body.dueno_dni || req.query.dueno_dni;
    const { itemId } = req.params;
    if (!dueno_dni) {
      return res.status(400).json({ error: 'Debe enviar el DNI del dueño' });
    }

    // 1) Verificar dueño y carrito
    const [users] = await pool.query(
      'SELECT id FROM usuario WHERE dni = ?',
      [dueno_dni]
    );
    if (users.length === 0) {
      return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    }
    const usuario_id = users[0].id;

    const [items] = await pool.query(
      `SELECT ci.* FROM carrito_item ci
       JOIN carrito c ON ci.carrito_id = c.id
       WHERE ci.id = ? AND c.usuario_id = ? AND c.estado = 'activo'`,
      [itemId, usuario_id]
    );
    if (items.length === 0) {
      return res.status(404).json({ error: 'Ítem no encontrado' });
    }
    const item = items[0];

    // 2) Si es vacuna, restaurar stock
    if (item.tipo === 'vacuna' && item.vacuna_catalogo_id) {
      await pool.query(
        'UPDATE vacuna_catalogo SET stock = stock + ? WHERE id = ?',
        [item.cantidad, item.vacuna_catalogo_id]
      );
    }

    // 3) Eliminar el ítem
    await pool.query(
      'DELETE FROM carrito_item WHERE id = ?',
      [itemId]
    );

    res.json({ message: 'Ítem eliminado y stock restaurado si aplicaba' });
  } catch (error) {
    console.error('eliminarItem error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Vaciar carrito
exports.vaciarCarrito = async (req, res) => {
  try {
    const { dueno_dni } = req.body;
    if (!dueno_dni) {
      return res.status(400).json({ error: 'Debe enviar el DNI del dueño' });
    }

    // 1) Obtener usuario_id
    const [users] = await pool.query(
      'SELECT id FROM usuario WHERE dni = ?',
      [dueno_dni]
    );
    if (users.length === 0) {
      return res.status(400).json({ error: 'Dueño no encontrado con ese DNI' });
    }
    const usuario_id = users[0].id;

    // 2) Obtener carrito activo
    const [carritos] = await pool.query(
      'SELECT id FROM carrito WHERE usuario_id = ? AND estado = "activo" LIMIT 1',
      [usuario_id]
    );
    if (carritos.length === 0) {
      return res.json({ message: 'Carrito ya vacío' });
    }
    const carrito_id = carritos[0].id;

    // 3) Obtener todos los ítems del carrito
    const [items] = await pool.query(
      'SELECT tipo, vacuna_catalogo_id, cantidad FROM carrito_item WHERE carrito_id = ?',
      [carrito_id]
    );

    // 4) Restaurar stock de cada vacuna
    for (const item of items) {
      if (item.tipo === 'vacuna' && item.vacuna_catalogo_id) {
        await pool.query(
          'UPDATE vacuna_catalogo SET stock = stock + ? WHERE id = ?',
          [item.cantidad, item.vacuna_catalogo_id]
        );
      }
    }

    // 5) Borrar todos los ítems
    await pool.query(
      'DELETE FROM carrito_item WHERE carrito_id = ?',
      [carrito_id]
    );

    res.json({ message: 'Carrito vaciado y stock restaurado' });
  } catch (error) {
    console.error('vaciarCarrito error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Simular pago del carrito, registrar pago, vacunas y suscripciones
exports.pagarCarrito = async (req, res) => {
  try {
    const { dueno_dni, metodo } = req.body;

    const [users] = await pool.query(
      'SELECT id FROM usuario WHERE dni = ?',
      [dueno_dni]
    );
    if (users.length === 0) {
      return res.status(400).json({ error: 'Dueño no encontrado' });
    }
    const usuario_id = users[0].id;

    const [carritos] = await pool.query(
      'SELECT id FROM carrito WHERE usuario_id = ? AND estado = "activo" LIMIT 1',
      [usuario_id]
    );
    if (carritos.length === 0) {
      return res.status(400).json({ error: 'Carrito no encontrado' });
    }
    const carrito_id = carritos[0].id;

    const [[{ monto_total }]] = await pool.query(
      'SELECT SUM(total) AS monto_total FROM carrito_item WHERE carrito_id = ?',
      [carrito_id]
    );

    await pool.query(
      'UPDATE carrito SET estado = "comprado" WHERE id = ?',
      [carrito_id]
    );

    await pool.query(
      `INSERT INTO pago (carrito_id, usuario_id, monto_total, metodo)
       VALUES (?, ?, ?, ?)`,
      [carrito_id, usuario_id, monto_total, metodo]
    );

    const [items] = await pool.query(
      'SELECT * FROM carrito_item WHERE carrito_id = ?',
      [carrito_id]
    );
    for (const item of items) {
      if (item.tipo === 'vacuna' && item.vacuna_catalogo_id && item.mascota_id) {
        await pool.query(
          `INSERT INTO vacuna_mascota
             (mascota_id, vacuna_id, fecha_aplicacion, fecha_vencimiento, veterinario_id)
           VALUES (?, ?, NOW(), ?, ?)`,
          [item.mascota_id, item.vacuna_catalogo_id, item.fecha_vencimiento, req.user.id]
        );
      }
      if (item.tipo === 'suscripcion' && item.mascota_id && item.tipo_suscripcion_id) {
        await pool.query(
          `UPDATE suscripcion
             SET estado = 'inactiva'
           WHERE mascota_id = ? AND estado = 'activa'`,
          [item.mascota_id]
        );
        const fecha_inicio = new Date();
        const fecha_fin = new Date(fecha_inicio);
        fecha_fin.setFullYear(fecha_inicio.getFullYear() + (item.cantidad || 1));
        await pool.query(
          `INSERT INTO suscripcion
             (mascota_id, tipo_id, fecha_inicio, fecha_fin, estado)
           VALUES (?, ?, ?, ?, 'activa')`,
          [item.mascota_id, item.tipo_suscripcion_id, fecha_inicio, fecha_fin]
        );
      }
    }

    res.json({ monto_total });
  } catch (error) {
    console.error('pagarCarrito error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener ventas diarias
exports.getVentasDiarias = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE(p.fecha_pago) AS fecha, -- Fecha de la venta
        ci.tipo, -- Tipo de venta (vacuna o suscripción)
        u.nombres AS veterinario, -- Nombre del veterinario que realizó la venta
        COUNT(ci.id) AS cantidad, -- Cantidad de ventas realizadas
        SUM(ci.total) AS total -- Total de las ventas
      FROM pago p
      JOIN carrito_item ci ON p.carrito_id = ci.carrito_id
      JOIN usuario u ON ci.veterinario_id = u.id -- Relación con el veterinario que realizó la venta
      WHERE ci.tipo IN ('vacuna', 'suscripcion')
      GROUP BY fecha, ci.tipo, veterinario
      ORDER BY fecha DESC;
    `);

    // Estructurar los datos para facilitar su uso en el frontend
    const ventasPorVeterinario = rows.reduce((acc, row) => {
      if (!acc[row.veterinario]) {
        acc[row.veterinario] = [];
      }
      acc[row.veterinario].push({
        fecha: row.fecha,
        tipo: row.tipo,
        cantidad: row.cantidad,
        total: row.total,
      });
      return acc;
    }, {});

    res.json(ventasPorVeterinario);
  } catch (error) {
    console.error('Error en getVentasDiarias:', error.message);
    res.status(500).json({ error: error.message });
  }
};