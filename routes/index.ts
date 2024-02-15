import express from "express";
import { Request, Response } from "express";
import User from "../src/models/user.model.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { checkNotAuthenticated, checkAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.get("/", async (req: Request, res: Response) => {
    try {
              // @ts-ignore
      const user = await User.findById(req.user?._id);

        res.render("index", {
            defaultLayout: true,
            carousel: true,
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;