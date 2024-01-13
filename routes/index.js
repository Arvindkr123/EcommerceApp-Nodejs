import express from "express";
import registerController from "../controllers/auth/registerController.js";
import loginController from "../controllers/auth/login.controller.js";
import meController from "../controllers/auth/me.controller.js";
import refreshTokenController from "../controllers/auth/refreshToken.controller.js";
import auth from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", auth, meController);
router.post("/refresh-token", refreshTokenController);

export default router;
