import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  checkAuthStatus
} from "../controllers/authController";

import { uploadAvatar } from "../middlewares/uploadAvatar";

const router = Router();

router.post("/register", uploadAvatar.single("avatar"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/check", checkAuthStatus);

export default router;