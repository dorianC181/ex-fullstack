import express from "express";
import session from "express-session";
import { compare } from "bcrypt";
import { pool, schemaExist, createSchema } from "./db";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false
  })
);

type LoginData = {
  name: string;
  password: string;
};

type DbUser = {
  id: number;
  name: string;
  passwordHash: string;
};

function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
  if ((req.session as any).user) {
    next();
    return;
  }

  res.status(401).json({
    message: "Non authentifié"
  });
}

app.get("/hello/:name", (req, res) => {
  res.json({
    message: `Hello ${req.params.name}`
  });
});

app.post("/user", (req, res) => {
  res.json({
    message: "Utilisateur reçu",
    data: req.body
  });
});

app.post("/course", (req, res) => {
  res.json({
    message: "Cours reçu",
    data: req.body
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Test OK",
    query: req.query
  });
});

app.post("/login", async (req, res) => {
  const loginData = req.body as LoginData;

  if (!loginData.name || !loginData.password) {
    res.status(400).json({
      message: "name et password sont requis"
    });
    return;
  }

  const connection = await pool.getConnection();

  try {
    const dbUsers = await connection.query(
      "SELECT * FROM users WHERE name = ?",
      [loginData.name]
    ) as DbUser[];

    console.log("users", dbUsers);

    if (dbUsers.length === 0) {
      res.sendStatus(401);
      return;
    }

    const dbUser = dbUsers[0];

    const passwordMatches = await compare(loginData.password, dbUser.passwordHash);

    if (!passwordMatches) {
      res.sendStatus(401);
      return;
    }

    (req.session as any).user = {
      id: dbUser.id,
      name: dbUser.name
    };

    res.json({
      message: "Connexion réussie",
      user: (req.session as any).user
    });
  } finally {
    connection.end();
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        message: "Erreur lors du logout"
      });
      return;
    }

    res.json({
      message: "Déconnexion réussie"
    });
  });
});

app.get("/auth/check", (req, res) => {
  if ((req.session as any).user) {
    res.json({
      authenticated: true,
      user: (req.session as any).user
    });
    return;
  }

  res.json({
    authenticated: false
  });
});

app.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    message: "Profil accessible",
    user: (req.session as any).user
  });
});

async function startServer() {
  if (!(await schemaExist())) {
    console.log("database does not exist!, creating....");
    await createSchema();
  } else {
    console.log("database already exist!");
    // await deleteSchema()
  }

  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Erreur au démarrage :", error);
});