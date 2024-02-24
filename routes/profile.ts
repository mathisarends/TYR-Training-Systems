import express from "express";
import { checkAuthenticated } from "../middleware/authMiddleware.js";
import { getProfilePage, patchProfilePage } from "../controller/profileController.js";

const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => getProfilePage(req, res))
router.patch("/", checkAuthenticated, (req, res) => patchProfilePage(req, res));

export default router;
