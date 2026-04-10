const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Lire JSON et urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "mon_super_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Plugin static : permet de servir les fichiers HTML/CSS/JS du dossier public
app.use(express.static(path.join(__dirname, "public")));

// Middleware de vérification d'auth
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({
      message: "Accès refusé. Vous devez être connecté."
    });
  }
}

// Route de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Exemple simple
  if (username === "admin" && password === "1234") {
    req.session.user = {
      username: username
    };

    res.json({
      message: "Connexion réussie",
      user: req.session.user
    });
  } else {
    res.status(401).json({
      message: "Identifiants invalides"
    });
  }
});

// Route de logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la déconnexion"
      });
    }

    res.json({
      message: "Déconnexion réussie"
    });
  });
});

// Vérifier si l'utilisateur est connecté
app.get("/auth/check", (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});

// Route protégée
app.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    message: "Bienvenue sur votre profil",
    user: req.session.user
  });
});

// Exemple d'affichage protégé en HTML
app.get("/secret", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "secret.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});