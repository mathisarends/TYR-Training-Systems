import express from "express";
import { handleIndexRoute } from "../controller/indexController.js";
const router = express.Router();

// Routes
router.get("/", (req, res) => handleIndexRoute(req, res));

export default router;