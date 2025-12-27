const express = require("express");
const router = express.Router();

/*
  MEMORIA TEMPORAL
  (luego se conecta a BD)
*/
const clasesActive = [
  {
    id: 1,
    grupo: "3A",
    docente: "Ing. López",
    laboratorio: "Lab Sistemas",
    hora_inicio: "08:00",
    hora_fin: "10:00",
    carrera: "Ingeniería en Sistemas"
  }
];

const alumnos = [];

/*
  MOSTRAR VISTA (EJS ORIGINAL)
*/
router.get("/", (req, res) => {
  res.render("alumno", {
    clasesActive,
    user: {
      nombre: "Alumno Demo"
    }
  });
});

/*
  REGISTRAR ENTRADA (BITÁCORA)
*/
router.post("/registrar", (req, res) => {
  const {
    id_clase,
    nombre_alumno,
    matricula,
    equipo_numero,
    observaciones
  } = req.body;

  alumnos.push({
    id_clase,
    nombre_alumno,
    matricula,
    equipo_numero,
    observaciones,
    fecha: new Date()
  });

  console.log("Registro guardado:", alumnos);

  res.redirect("/alumno");
});

module.exports = router;
