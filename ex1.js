const express = require("express");

const app = express();
const PORT = 3000;

// Middleware pour lire le JSON et le x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1) GET /hello/:name
app.get("/hello/:name", (req, res) => {
  const name = req.params.name;

  res.json({
    message: `Hello ${name}`
  });
});

// 2) POST /user avec données urlencoded
app.post("/user", (req, res) => {
  const { name, age, email } = req.body;

  res.json({
    message: "Utilisateur reçu avec succès",
    data: {
      name,
      age,
      email
    }
  });
});

// 3) POST /course avec données JSON
app.post("/course", (req, res) => {
  const { title, teacher, price } = req.body;

  res.json({
    message: "Cours reçu avec succès",
    data: {
      title,
      teacher,
      price
    }
  });
});

// 4) GET /test avec données dans la requête + réponse JSON
// En GET, on passe généralement les données dans l'URL (query params)
app.get("/test", (req, res) => {
  const { name, age, city } = req.query;

  res.json({
    message: "Requête GET /test reçue",
    received: {
      name,
      age,
      city
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});