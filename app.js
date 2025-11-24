const express = require('express');
const mysql = require('mysql');
const myconnection = require('express-myconnection');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuración básica
app.set('port', process.env.PORT || 8085);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Sesiones
app.use(session({
  secret: 'artours-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Conexión a MySQL
app.use(myconnection(mysql, {
  host: '127.0.0.1',
  user: 'ArTours',
  password: 'Alejandro2025@',
  database: 'ArToursDB',
  port: 3306 // cambia a 3307 si tu MySQL corre ahí
}, 'single'));

// Servir archivos estáticos (para auth.html)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta base
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


// Rutas de usuarios
const usersRouter = require('./src/routes/users');
app.use('/api/usuarios', usersRouter);

// Rutas de autenticación
const authRouter = require('./src/routes/auth');
app.use('/auth', authRouter);

// Exportar app para server.js
module.exports = app;
