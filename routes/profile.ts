import express from "express";
import { checkAuthenticated } from "../middleware/authMiddleware.js";
import { formatDateMonthAndYear } from "../src/public/generic/formatDate.js";
const router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {

    const user = res.locals.user;
    const username = user.name;
    const email = user.email;
    const memberSince = formatDateMonthAndYear(user.createdAt);

    res.render("profile", {
        defaultLayout: true,
        carousel: false,
        username,
        email,
        memberSince
    })
})

export default router;
