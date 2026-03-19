import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ message: "API OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});