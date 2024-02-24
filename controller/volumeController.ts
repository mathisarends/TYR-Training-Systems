import { Request, Response } from "express";

import { UserInterface } from "../src/models/user.types.js";
import UserData from "../src/models/userData.model.js";

export async function handleVolumePatch(req: Request, res: Response) {

    try {
        const user: Partial<UserInterface> = res.locals.user;
        const UserData: any = await getUserData(user);

        // update all fields
        UserData.gender = req.body.gender;
        UserData.bodyWeight = req.body.bodyweight;
        UserData.bodyHeight = req.body.bodyheight;
        UserData.age = req.body.age;
        UserData.nutrition = req.body.nutrition;
        UserData.sleep = req.body.sleep;
        UserData.stress = req.body.stress;
        UserData.manual = req.body.manual
        UserData.trainingExperience = req.body.trainingExperience;

        await UserData.save();

        // TODO implement actual volume recommandation for S,B, D and other exercises

        res.status(200).json({});
    } catch (error) {
        console.log(
            "Ein Fehler beim Laden der Exercise-Seite ist aufgetreten!",
            error
        );
        res.status(500).json({ message: "Fehler eim patchen aufgetreten! " });
    }
}

export async function showVolumePage(req: Request, res: Response) {
    try {
        const user: Partial<UserInterface> = res.locals.user;

        const userData = await getUserData(user);
        console.log(userData);


        res.render("volume", {
            defaultLayout: true,
            carousel: false,
            userData,

            // Hier weiteren kram rein
        });
    } catch (error) {
        console.log(
            "Ein Fehler beim Laden der Exercise-Seite ist aufgetreten!",
            error
        );
    }
}

async function getUserData(user: Partial<UserInterface>) {

    try {
        const userData = await UserData.findOne({ user: user._id });
        return userData;
    } catch (error) {
        throw error;
    }

}

