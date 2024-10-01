// ************ Require's ************
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE
const mysql = require('mysql');
const cors = require('cors');

// ************ express() ************
const app = express();

// ************ Middlewares - (don't touch) ************
app.use(express.static(path.join(__dirname, '../public')));  // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride('_method')); // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE




// Conexion 

// Cambiar parametros de configuración !!!!!!!!!!!
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
