import express from "express";
import { checkAuthenticated } from "../middleware/authMiddleware.js";
import User from "../src/models/user.model.js";
const router = express.Router();

router.get("/", checkAuthenticated, async (req, res) => {
    try {
        const currentUser = res.locals.user;
        const otherUsers = await findOtherUsers(currentUser);

        const simplifiedUsers = otherUsers.map((user : any) => ({
            name: user.name,
            lastActivity: user.lastActivity,
            description: user.description,
            id: user._id,
        }));

        console.log(getUserIdFromCollectionByIndex(otherUsers, 1));


        res.render("social/index", {
            defaultLayout: true,
            carousel: true,
            simplifiedUsers
        })

    } catch (error) {
        console.log("Es ist ein Fehler beim Laden der social page aufgetreten!", error);
    }
})

router.post("/addFriend/:friendId", checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;

        const friendUserId = req.params.friendId;
        


    } catch (error) {
        const errMessage = "Es ist ein Fehler beim adden des Freundes aufgetreten! " + error;
        console.log(errMessage);
        res.status(500).send(errMessage);
    }
})

router.get("/getUserId/:index", checkAuthenticated, async (req, res) => {
    try {
        const currentUser = res.locals.user;
        const otherUsers = await findOtherUsers(currentUser);
        const index = parseInt(req.params.index);

        const resultUserId = getUserIdFromCollectionByIndex(otherUsers, index);

        if (resultUserId !== null) {
            res.status(200).json(resultUserId);
        } else {
            res.status(400).json({ message: "Invalid index provided." });
        }
    } catch (error) {
        const errMessage = "Es ist ein interner Serverfehler beim Herstellen des Nutzers aufgetreten " + error;
        console.log(errMessage);
        res.status(500).json({ message: errMessage });
    }
});

function getUserIdFromCollectionByIndex(users : any, index : number) {
    if (index >= 0 && index < users.length) {
        return users[index]._id.toString();
    } else {
        return null; // Invalid index
    }
}

// finds every user except for the user itself
async function findOtherUsers(currentUser : any) {
    
    return await User.find({ _id: { $ne: currentUser._id } });
}

export default router;
