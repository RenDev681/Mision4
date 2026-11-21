const express = require("express");

const app = express();
const PORT = 3000;

// Permite recibir datos en formato JSON
app.use(express.json());

// Nuestra pequeña base de datos de animales
const animales = [
  "Perro",
  "Gato",
  "León",
  "Tigre",
  "Elefante",
  "Jirafa",
  "Cebra",
  "Delfín",
  "Tortuga",
  "Conejo",
  "Caballo",
  "Lobo"
];

// Endpoint para comprobar el registro
app.post("/api/registro", (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({
      ok: false,
      mensaje: "Faltan datos"
    });
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailValido) {
    return res.status(400).json({
      ok: false,
      mensaje: "El correo no es válido"
    });
  }

  res.status(200).json({
    ok: true,
    mensaje: `¡Bienvenido, ${nombre}! Registro correcto.`
  });
});

// Endpoint para buscar animales
app.get("/api/animales", (req, res) => {
  const busqueda = req.query.nombre || "";

  const resultados = animales.filter((animal) =>
    animal.toLowerCase().includes(busqueda.toLowerCase())
  );

  res.status(200).json(resultados);
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`API funcionando en http://localhost:${PORT}`);
});