CREATE DATABASE IF NOT EXISTS innova_siget;
USE innova_siget;

-- 1. Tabla de Usuarios (Soporta Alumnos, Docentes, Técnicos y Administrativos)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ALUMNO', 'DOCENTE', 'TECNICO', 'PERSONAL') NOT NULL, -- "PERSONAL" para administrativos
    carrera VARCHAR(100) -- Agregado para filtrar grupos en el login
);

-- 2. Clases Activas (Sincronizado con docente.ejs)
CREATE TABLE clases_activas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_docente INT,
    carrera VARCHAR(100), -- Necesario para el filtro de alumnos
    laboratorio VARCHAR(50), 
    grupo VARCHAR(20), 
    hora_inicio TIME,      -- Campo nuevo (requerido por docente.ejs)
    hora_fin TIME,         -- Campo nuevo (requerido por docente.ejs)
    fecha_apertura DATE DEFAULT (CURRENT_DATE),
    estatus ENUM('ABIERTA', 'CERRADA') DEFAULT 'ABIERTA',
    FOREIGN KEY (id_docente) REFERENCES usuarios(id)
);

-- 3. Bitácoras (Sincronizado con alumno.ejs)
CREATE TABLE bitacoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_clase INT,
    id_alumno INT,
    equipo_numero INT NOT NULL,
    observaciones_iniciales TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_clase) REFERENCES clases_activas(id),
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id)
);

-- 4. Soporte Técnico (Sincronizado con personal.ejs y mantenimiento.ejs)
CREATE TABLE tickets_soporte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    folio VARCHAR(20) UNIQUE,
    id_solicitante INT,
    area_especifica VARCHAR(100), -- Ej: "Recursos Humanos", "Sistemas"
    descripcion_falla TEXT,
    tipo_incidencia VARCHAR(50),  -- Campo nuevo (Hardware, Software, Red)
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA') DEFAULT 'MEDIA',
    tipo_atencion ENUM('Presencial', 'Remoto'), -- Campo nuevo (requerido por personal.ejs)
    fecha_cita DATE,               -- Campo nuevo (requerido por personal.ejs)
    turno ENUM('Matutino', 'Vespertino'), -- Campo nuevo (requerido por personal.ejs)
    estado ENUM('PENDIENTE', 'EN PROCESO', 'RESUELTO') DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_solicitante) REFERENCES usuarios(id)
);