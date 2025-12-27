const express = require("express");
const router = express.Router();

// Memoria temporal
const alumnos = [];

// Mostrar formulario (ejemplo)
router.get("/", (req, res) => {
  res.render("alumno");
});

// Registrar alumno
router.post("/registrar", (req, res) => {
  const { nombre, email, password } = req.body;

  alumnos.push({ nombre, email, password });
  res.redirect("/");
});

module.exports = router;
