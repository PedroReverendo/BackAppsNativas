// ************ Require's ************
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override'); // Para poder usar los métodos PUT y DELETE
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs'); // Para leer archivos

// Configuración de Multer para manejar la subida de imágenes
const storage = multer.memoryStorage(); // Guardar en memoria para leer el archivo directamente
const upload = multer({ storage: storage });

// ************ express() ************
const app = express();

// ************ Middlewares - (don't touch) ************
app.use(express.static(path.join(__dirname, '../public')));  // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride('_method')); // Para poder pisar el method="POST" en el formulario por PUT y DELETE

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'mysql-grupo7apps.alwaysdata.net',
  user: '373797_grupo7',
  password: 'GRUPOAPPS2',
  database: 'grupo7apps_apps'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});


// rutas y consultas !!!!!!!!!!!!!!!!!
app.get("/test", (req, res) => {
  res.send('API is working!');
});

// CLIENTE GET AND POST
app.get("/cliente", (req, res) => {
  connection.query('SELECT * FROM Cliente', (err, rows) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error executing query');
      }
      res.json(rows);
  });
});

app.post("/cliente", (req, res) => {
  const { Nombre, Apellido, Email, Direccion, Telefono } = req.body;
  connection.query(
    'INSERT INTO Cliente (Nombre, Apellido, Email, Direccion, Telefono) VALUES (?, ?, ?, ?, ?)',
    [Nombre, Apellido, Email, Direccion, Telefono],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error executing query');
      }
      res.status(201).json({ message: 'Cliente created', id: result.insertId });
    }
  );
});


// EQUIPO GET AND POST
app.get("/equipo", (req, res) => {
  connection.query('SELECT * FROM Equipo', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error executing query');
    }
    res.json(rows);
  });
});

app.post("/equipo", (req, res) => {
  const { Nombre_Equipo, Pais, Tipo } = req.body;
  connection.query(
    'INSERT INTO Equipo (Nombre_Equipo, Pais, Tipo) VALUES (?, ?, ?)',
    [Nombre_Equipo, Pais, Tipo],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error executing query');
      }
      res.status(201).json({ message: 'Equipo created', id: result.insertId });
    }
  );
});


// PRODUCTO GET AND POST
app.get("/producto", (req, res) => {
  connection.query('SELECT * FROM Producto', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error executing query');
    }
    res.json(rows);
  });
});

// Modificación para soportar imágenes BLOB
app.post("/producto", upload.single('imagen'), (req, res) => {
  const { ID_Equipo, Nombre, Descripcion, Precio, Talle, Stock, Temporada } = req.body;
  
  // Verificar si hay un archivo subido
  if (!req.file) {
    return res.status(400).send('Imagen es requerida');
  }
  
  // El archivo de imagen viene en req.file.buffer al usar memoryStorage
  const imageData = req.file.buffer;

  connection.query(
    'INSERT INTO Producto (ID_Equipo, Nombre, Descripcion, Precio, Talle, Foto, Stock, Temporada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [ID_Equipo, Nombre, Descripcion, Precio, Talle, imageData, Stock, Temporada],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error executing query');
      }

      res.status(201).json({ message: 'Producto creado con imagen', id: result.insertId });
    }
  );
});

// VENTA GET AND POST
app.get("/venta", (req, res) => {
  connection.query('SELECT * FROM Venta', (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error executing query');
    }
    res.json(rows);
  });
});

app.post("/venta", (req, res) => {
  const { ID_Cliente, ID_Producto, Fecha_Pedido, Estado_Pedido, Cantidad, Monto_Unitario, Numero_Pedido } = req.body;
  connection.query(
    'INSERT INTO Venta (ID_Cliente, ID_Producto, Fecha_Pedido, Estado_Pedido, Cantidad, Monto_Unitario, Numero_Pedido) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [ID_Cliente, ID_Producto, Fecha_Pedido, Estado_Pedido, Cantidad, Monto_Unitario, Numero_Pedido],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error executing query');
      }
      res.status(201).json({ message: 'Venta created', id: result.insertId });
    }
  );
});









// ************ Route System require and use() ************

// ************ DON'T TOUCH FROM HERE ************
// ************ catch 404 and forward to error handler ************
app.use((req, res, next) => next(createError(404)));

// ************ error handler ************
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.path = req.path;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

// ************ exports app ************
module.exports = app;
