import express from "express";
import { checkAuthenticated } from "../middleware/authMiddleware.js";
const router = express.Router();

import { getSocialPage, addFriend, getUserIdByIndex } from "../controller/socialRouter.js";

router.get("/", checkAuthenticated, async (req, res) => getSocialPage(req, res))
router.post("/addFriend/:friendId", checkAuthenticated, (req, res) => addFriend(req, res) );
router.get("/getUserId/:index", checkAuthenticated, (req, res) => getUserIdByIndex(req, res));

export default router;
