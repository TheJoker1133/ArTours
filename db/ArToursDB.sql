-- db/ArToursDB.sql
-- Crea BD, usuario y privilegios (ajusta si ya lo hiciste)
CREATE DATABASE IF NOT EXISTS ArToursDB
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'ArTours'@'localhost' IDENTIFIED BY 'Alejandro2025@';
GRANT ALL PRIVILEGES ON ArToursDB.* TO 'ArTours'@'localhost';
FLUSH PRIVILEGES;

USE ArToursDB;

-- Tabla de categorías (la que ya tienes)
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- NUEVO: Tabla de usuarios (CRUD)
-- ===============================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN','USER') DEFAULT 'USER',
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Usuario admin inicial (password = "admin123")
-- IMPORTANTE: cámbiala después.
INSERT INTO usuarios (nombre, email, password_hash, rol)
VALUES (
  'Admin',
  'admin@artours.local',
  '$2a$10$T.z6x8sH9f9bV5gq0kV9QOekr1uH/0rT8e8s4u00oJpE3b9eQG3Jq', -- bcrypt "admin123"
  'ADMIN'
)
ON DUPLICATE KEY UPDATE email = email;

-- Compatibilidad de autenticación (si tu conector la necesita)
ALTER USER 'ArTours'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Alejandro2025@';
FLUSH PRIVILEGES;
