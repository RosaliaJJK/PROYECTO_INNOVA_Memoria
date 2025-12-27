const express = require("express");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =========================
   ARCHIVOS ESTÁTICOS
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   EJS
========================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =========================
   RUTAS
========================= */
const alumnoRoutes = require("./routes/alumno");
app.use("/alumno", alumnoRoutes);

/* =========================
   RAÍZ
========================= */
app.get("/", (req, res) => {
  res.redirect("/alumno");
});

/* =========================
   PUERTO (RENDER)
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});
