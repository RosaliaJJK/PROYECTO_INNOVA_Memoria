const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path');
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'teschi_key_2025',
    resave: false,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'innova_siget'
});

// --- API PARA TIEMPO REAL (DOCENTE) ---
// Esta ruta es la que busca tu JS cada 30 segundos
app.get('/api/alumnos-activos', (req, res) => {
    const query = `
        SELECT u.nombre as alumno, r.num_maquina as maquina, r.observaciones as observacion, r.fecha as estado 
        FROM registros_bitacora r
        JOIN usuarios u ON r.id_usuario = u.id
        WHERE DATE(r.fecha) = CURDATE()
        ORDER BY r.fecha DESC`;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// --- LÓGICA DE REGISTRO (INDEX.EJS) ---
app.post('/auth/register', (req, res) => {
    const { nombre, email, rol, password } = req.body;
    const query = 'INSERT INTO usuarios (nombre, email, rol, password) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, email, rol, password], (err) => {
        if (err) return res.send("Error al registrar: " + err);
        res.send("<script>alert('Cuenta creada. Inicia sesión.'); window.location='/';</script>");
    });
});

// --- LÓGICA DE LOGIN ---
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (results && results.length > 0) {
            req.session.user = results[0];
            const rol = results[0].rol;
            if (rol === 'ALUMNO') return res.redirect('/alumno');
            if (rol === 'DOCENTE') return res.redirect('/docente');
            if (rol === 'TECNICO') return res.redirect('/mantenimiento');
            res.redirect('/personal');
        } else {
            res.send("<script>alert('Usuario o contraseña incorrectos'); window.location='/';</script>");
        }
    });
});

// --- RUTA GENERAL DE VISTAS ---
app.get('/', (req, res) => res.render('index'));

app.get('/alumno', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    db.query('SELECT c.*, u.nombre as docente FROM clases_activas c JOIN usuarios u ON c.id_docente = u.id WHERE c.estatus = "ABIERTA"', (err, clases) => {
        res.render('alumno', { user: req.session.user, clasesActive: clases });
    });
});

app.get('/docente', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    db.query('SELECT * FROM registros_bitacora WHERE DATE(fecha) = CURDATE()', (err, results) => {
        res.render('docente', { user: req.session.user, alumnos: results || [] });
    });
});

app.get('/personal', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.render('personal', { user: req.session.user });
});

app.get('/mantenimiento', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    db.query('SELECT * FROM tickets_soporte', (err, results) => {
        res.render('mantenimiento', { tickets: results || [], user: req.session.user });
    });
});

// --- LOGOUT ---
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => console.log('Servidor INNOVA SIGET listo en http://localhost:3000'));