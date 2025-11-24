-- ===========================================
-- ArToursDB - Esquema completo
-- Usuarios + Catálogo + Ventas/Reservas
-- ===========================================

-- 1) Base de datos y usuario del proyecto
CREATE DATABASE IF NOT EXISTS ArToursDB
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'ArTours'@'localhost' IDENTIFIED BY 'Alejandro2025@';
GRANT ALL PRIVILEGES ON ArToursDB.* TO 'ArTours'@'localhost';
FLUSH PRIVILEGES;

USE ArToursDB;

-- ===========================================
-- 2) USUARIOS
-- ===========================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN','USER') NOT NULL DEFAULT 'USER',
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ===========================================
-- 3) CATEGORÍAS DE PRODUCTOS/SERVICIOS
-- ===========================================
CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_categorias_nombre UNIQUE (nombre)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_categorias_estado
  ON categorias (estado);

-- ===========================================
-- 4) PRODUCTOS / SERVICIOS (TOURS AR)
-- ===========================================
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  slug VARCHAR(180) DEFAULT NULL,               -- opcional, para URLs amigables
  descripcion_corta VARCHAR(255),
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  duracion_min INT DEFAULT NULL,                -- duración estimada en minutos
  ubicacion VARCHAR(200) DEFAULT NULL,          -- ej: 'Tuxtla Gutiérrez, Chiapas'
  ubicacion_lat DECIMAL(10,7) DEFAULT NULL,     -- coordenadas opcionales
  ubicacion_lng DECIMAL(10,7) DEFAULT NULL,
  capacidad INT DEFAULT NULL,                   -- aforo máximo opcional
  estado ENUM('borrador','activo','inactivo') NOT NULL DEFAULT 'activo',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_productos_estado
  ON productos (estado);

CREATE INDEX idx_productos_nombre
  ON productos (nombre);

-- ===========================================
-- 5) RELACIÓN N:M PRODUCTO <-> CATEGORÍA
-- ===========================================
CREATE TABLE IF NOT EXISTS producto_categorias (
  producto_id INT NOT NULL,
  categoria_id INT NOT NULL,
  PRIMARY KEY (producto_id, categoria_id),
  CONSTRAINT fk_pc_producto
    FOREIGN KEY (producto_id)
    REFERENCES productos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_pc_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES categorias(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ===========================================
-- 6) IMÁGENES POR PRODUCTO
-- ===========================================
CREATE TABLE IF NOT EXISTS producto_imagenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  url VARCHAR(400) NOT NULL,
  alt_text VARCHAR(200) DEFAULT NULL,
  orden INT NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_img_producto
    FOREIGN KEY (producto_id)
    REFERENCES productos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_img_producto
  ON producto_imagenes (producto_id, orden);

-- ===========================================
-- 7) ÓRDENES (VENTAS / RESERVACIONES DE TOURS)
-- ===========================================
CREATE TABLE IF NOT EXISTS ordenes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,                           -- cliente (de tabla usuarios)
  tipo ENUM('reserva','venta') NOT NULL DEFAULT 'reserva',
  estado ENUM('pendiente','confirmada','pagada','cancelada')
    NOT NULL DEFAULT 'pendiente',
  total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  fecha_tour DATE NOT NULL,                          -- día en que se realiza el tour
  hora_tour TIME DEFAULT NULL,                       -- hora opcional
  num_personas INT NOT NULL DEFAULT 1,
  metodo_pago VARCHAR(60) DEFAULT NULL,              -- ej: 'efectivo', 'tarjeta'
  notas TEXT,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ord_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_ordenes_usuario
  ON ordenes (usuario_id, estado);

CREATE INDEX idx_ordenes_fecha
  ON ordenes (fecha_tour);

-- ===========================================
-- 8) ÍTEMS DE LA ORDEN (DETALLE DE TOURS)
--    Guarda snapshot de nombre y precio
-- ===========================================
CREATE TABLE IF NOT EXISTS orden_items (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  orden_id BIGINT NOT NULL,
  producto_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,                     -- copia del nombre del tour
  precio_unitario DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  subtotal DECIMAL(12,2) AS (precio_unitario * cantidad) STORED,
  CONSTRAINT fk_itm_orden
    FOREIGN KEY (orden_id)
    REFERENCES ordenes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_itm_producto
    FOREIGN KEY (producto_id)
    REFERENCES productos(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_items_orden
  ON orden_items (orden_id);

-- ===========================================
-- 9) Compatibilidad con mysql_native_password
--    (necesario para algunos conectores Node.js)
-- ===========================================
ALTER USER 'ArTours'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'Alejandro2025@';
FLUSH PRIVILEGES;
