import express from "express";
import { checkAuthenticated } from "../middleware/authMiddleware.js";
import User from "../src/models/user.model.js";
const router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
    try {
        
        const currentUser = res.locals.user;
        const otherUsers = await User.find({ _id: { $ne: currentUser._id } });

        const simplifiedUsers = otherUsers.map((user : any) => ({
            name: user.name,
            lastActivity: user.lastActivity
        }));
        
        console.log(simplifiedUsers);


        res.render("social/index", {
            defaultLayout: true,
            carousel: true,
            simplifiedUsers
        })

    } catch (error) {
        console.log("Es ist ein Fehler beim Laden der social page aufgetreten!", error);
    }
})

export default router;
