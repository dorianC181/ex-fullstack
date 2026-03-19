import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { schemaExist, createSchema } from "./db";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api", (_req, res) => {
  res.json({ message: "API OK" });
});

async function startServer() {
  if (!(await schemaExist())) {
    console.log("database does not exist!, creating....");
    await createSchema();
  } else {
    console.log("database already exist!");
  }

  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Erreur au démarrage :", error);
});