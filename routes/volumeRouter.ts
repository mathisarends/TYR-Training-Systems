import express from "express";
const router = express.Router();

import { checkAuthenticated } from "../middleware/authMiddleware.js";
import { showVolumePage, handleVolumePatch } from "../controller/volumeController.js";

router.get("/", checkAuthenticated, async (req, res) => showVolumePage(req, res));
router.patch("/", checkAuthenticated, (req, res) => handleVolumePatch(req, res));

export default router;