import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { checkAuth } from "../middlewares/checkAuth";

const router = Router();

router.get("/", checkAuth, getUsers);

export default router;