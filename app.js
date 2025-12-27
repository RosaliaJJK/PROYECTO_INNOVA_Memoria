const alumnoRoutes = require("./routes/alumno");
const docenteRoutes = require("./routes/docente");
const apiRoutes = require("./routes/api");

app.use("/alumno", alumnoRoutes);
app.use("/docente", docenteRoutes);
app.use("/api", apiRoutes);
