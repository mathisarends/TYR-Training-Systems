import express from "express";
import { checkAuthenticated } from "../middleware/authMiddleware.js";
import { formatDateMonthAndYear } from "../src/public/generic/formatDate.js";
import { ApiData } from "../interfaces/ApiData.js";

const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {

    const user = res.locals.user;
    const username = user.name;
    const email = user.email;
    const memberSince = formatDateMonthAndYear(user.createdAt);
    const description = user.description;

    res.render("profile", {
        defaultLayout: true,
        carousel: false,
        username,
        email,
        description,
        memberSince
    })
})

router.patch("/", checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;
        const changedData: ApiData = req.body;

        const fieldMappings : Record<string, string> = {
            "userName": "name",
            "userMail": "email",
            "userDescription": "description",
        };

        Object.entries(changedData).forEach(([fieldName, fieldValue]) => {
            const userField = fieldMappings[fieldName];
            if (userField) {
                user[userField] = fieldValue;
            }
        });

        await user.save();

        res.status(200).json({
            message: "Benutzerdaten erfolgreich aktualisiert."
        });

    } catch (error) {
        const errMessage = "Es ist ein Fehler beim Patchen der Benutzerdaten aufgetreten " +  error;
        console.log(errMessage);        
        res.status(500).json({
            message: errMessage
        });
    }
});

export default router;
