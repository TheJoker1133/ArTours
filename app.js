// app.js
const express = require('express');
const mysql = require('mysql');
const myconnection = require('express-myconnection');
const morgan = require('morgan');

const app = express();
app.set('port', process.env.PORT || 8085);

// Necesario para leer JSON del body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs (opcional)
app.use(morgan('dev'));

// Conexión a MySQL (ajusta puerto si usas 3307)
app.use(myconnection(mysql, {
  host: '127.0.0.1',
  user: 'ArTours',
  password: 'Alejandro2025@',
  database: 'ArToursDB',
  port: 3306
}, 'single'));

// Rutas
app.get('/', (req, res) => res.send('ArTours API funcionando'));

// Monta CRUD de usuarios
const usersRouter = require('./src/routes/users');
app.use('/api/usuarios', usersRouter);

// Arranque
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
