
CREATE DATABASE IF NOT EXISTS ArToursDB
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'ArTours'@'localhost' IDENTIFIED BY 'Alejandro2025@';

GRANT ALL PRIVILEGES ON ArToursDB.* TO 'ArTours'@'localhost';
FLUSH PRIVILEGES;

USE ArToursDB;


CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER USER 'ArTours'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Alejandro2025@';
FLUSH PRIVILEGES;

SELECT user, host, plugin FROM mysql.user WHERE user = 'ArTours';

SELECT * FROM categorias;
