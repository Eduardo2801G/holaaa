const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');  // 👈 necesario para rutas

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'b9aemgr4gugmm5diqxka-mysql.services.clever-cloud.com',
  user: 'uc1t4mlqpxcrw7sc',
  password: 'HJvamKimfwACxemIF4ju',
  database: 'b9aemgr4gugmm5diqxka',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para insertar mensaje
app.post('/mensaje', (req, res) => {
  const { nombre, mensaje } = req.body;
  if (!nombre || !mensaje) {
    return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });
  }

  const sql = 'INSERT INTO mensajes (nombre, mensaje) VALUES (?, ?)';
  db.query(sql, [nombre, mensaje], (err, result) => {
    if (err) {
      console.error('Error al insertar mensaje:', err);
      return res.status(500).json({ error: 'Error al guardar el mensaje' });
    }
    res.json({ id: result.insertId, nombre, mensaje });
  });
});

// Ruta para obtener mensajes
app.get('/mensajes', (req, res) => {
  const sql = 'SELECT * FROM mensajes ORDER BY id DESC';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error al cargar mensajes:', err);
      return res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
    res.json(result);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
