# Proyecto ArTours

## Descripción General
Este proyecto forma parte del desarrollo de la aplicación **ArTours**, una aplicación realizada con **Node.js**, **Express** y **MySQL**.  
El sistema permite establecer una conexión con una base de datos MySQL para la gestión de información relacionada con la aplicación.

---

## Estructura del Proyecto

```bash
Proyecto/
├── app.js
├── db/
│   └── ArToursDB.sql
├── package.json
└── Readme.md
```


---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (gestor de paquetes de Node.js)
- **MySQL Server**
- **MySQL Workbench** (opcional, para gestionar la base de datos)

---

## Instalación de Dependencias

Dentro del directorio del proyecto, ejecuta en la terminal:

```bash
npm install
```
Este comando instalará todas las dependencias listadas en el archivo package.json.

## Para inicial el servidor

```bash
node app.js
```
## Creación de la Base de Datos

Abre MySQL Workbench o la consola de MySQL.

Dirígete al archivo SQL que se encuentra en db/ArToursDB.sql.

Ejecuta el script con el siguiente comando:
```bash
SOURCE db/ArToursDB.sql;
```
O copia y pega el contenido del archivo dentro de tu cliente MySQL.

Esto creará automáticamente:

La base de datos ArToursDB

El usuario ArTours con contraseña Alejandro2025@

Los permisos necesarios sobre la base de datos

La tabla inicial categorias

## Ejecución del proyecto
Después de instalar las dependencias y crear la base de datos, inicia el servidor con:
``` bash
node app.js
```

Si todo esta configurado correctamente la aplicación se ejecutará de manera local y se conectará a la base de datos configurada en tu archivo app.js.

## Link del repositorio
https://github.com/TheJoker1133/ArTours

## Créditos

Autor: Alejandro Serrano Guzmán

Proyecto: ArTours

Fecha: Octubre 2025

Materia: E-Business / Desarrollo de Aplicaciones Web

Institución: Instituto Tecnológico de Tuxtla Gutiérrez