import { Request, Response } from "express"
import { formatDateMonthAndYear } from "../src/public/generic/formatDate.js";
import { ApiData } from "../interfaces/ApiData.js";

export function  getProfilePage(req : Request, res : Response) {
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

}   

export async function patchProfilePage(req : Request, res : Response) {
    try {
        const user = res.locals.user;
        const changedData: ApiData = req.body;
        
        Object.entries(changedData).forEach(([fieldName, fieldValue]) => {
            user[fieldName] = fieldValue;
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
}