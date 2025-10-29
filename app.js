const express = require('express');
const mysql = require('mysql');
const myconnection = require('express-myconnection');

const app = express();

app.use (myconnection(mysql, {
  host: 'localhost',
  user: 'ArTours',
  password: 'Alejandro2025@',
  port: 3306,
  database: 'ArToursDB'
}, 'single'));  
