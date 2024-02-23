import express from "express";
import { Request, Response } from "express";
import User from "../src/models/user.model.js";
import { handleIndexRoute } from "../controller/indexController.js";
const router = express.Router();

// Routes
router.get("/", (req, res) => handleIndexRoute(req, res));

export default router;