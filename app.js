const express = require("express");
const path = require("path");

const alumnoRoutes = require("./routes/alumno");
const docenteRoutes = require("./routes/docente");
const apiRoutes = require("./routes/api");

const app = express(); // 👈 ESTO FALTABA (CLAVE)

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Archivos públicos
app.use(express.static(path.join(__dirname, "public")));

// Vistas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Rutas
app.use("/alumno", alumnoRoutes);
app.use("/docente", docenteRoutes);
app.use("/api", apiRoutes);

// Ruta principal (login)
app.get("/", (req, res) => {
  res.render("login");
});

// Puerto para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
