import express from "express";
const router = express.Router();

import { UserInterface } from "../src/models/user.types.js";
import TrainingBlock from "../src/models/trainingBlock.model.js";

import { checkAuthenticated } from "../middleware/authMiddleware.js";

router.get("/", checkAuthenticated, (req, res) => {

    const user: Partial<UserInterface> = res.locals.user;

    const username = user.name;
    const trainingPlans = user.customPlans;


    res.render("training/index", {
        defaultLayout: true,
        carousel: false,
        username,
        trainingPlans
    })
})

router.post('/create', checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;

        const title = req.body.title;
        const trainingFrequency = req.body.trainingFrequency;
        const trainingWeeks = req.body.trainingWeeks;
        const trainingPhase = req.body.trainingPhase;
        const weightRecommandation = req.body.weightPlaceholders;

        // Erstelle einen neuen TrainingBlock
        const newTrainingBlock = new TrainingBlock({
            title: title,
            trainingFrequency: trainingFrequency,
            trainingWeeks: trainingWeeks,
            trainingPhase: trainingPhase,
            weightRecommandationBase: weightRecommandation,
        });

        user.customPlans.push(newTrainingBlock);
        await user.save();

        console.log('Neuer TrainingBlock erstellt:', newTrainingBlock);

        // Hier könntest du die Response entsprechend anpassen, z.B. eine Erfolgsmeldung senden
        res.status(200).json({});
    } catch (error) {
        console.error('Fehler beim Erstellen des TrainingBlocks:', error);
        // Hier könntest du die Response für einen Fehler anpassen
        res.status(500).json({
            success: false,
            message: 'Fehler beim Erstellen des TrainingBlocks',
        });
    }
});

export default router;
