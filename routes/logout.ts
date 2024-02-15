import express from "express";
import { handleLogout } from "../controller/logoutController.js";
const router = express.Router();

import { checkAuthenticated } from "../middleware/authMiddleware.js";

router.get("/", checkAuthenticated, handleLogout);

export default router;
