import express from "express";
const router = express.Router();

import { UserInterface } from "../src/models/user.types.js";

import TrainingBlock from "../src/models/trainingBlock.model.js";
import { TrainingBlockInterface } from "../src/models/trainingBlock.types.js";

import { checkAuthenticated } from "../middleware/authMiddleware.js";
import { formatCustomDate } from "../src/public/generic/formatDate.js";

router.get("/", checkAuthenticated, (req, res) => {

    const user: Partial<UserInterface> = res.locals.user;

    const username = user.name;
    const trainingPlans = user.customPlans;

    res.render("training/index", {
        defaultLayout: true,
        carousel: false,
        username,
        trainingPlans,
        formatCustomDate,
    })
})

router.delete("/delete/:id", checkAuthenticated, async (req, res) => {

    try {
        const user = res.locals.user;
    
        const deleteId = parseInt(req.params.id);
        user.customPlans?.splice(deleteId, 1);
    
        await user.save();

        res.status(200).json({});

    } catch (error) {
        const message = "Es ist ein Fehler beim löschen des Trainingsplans aufgetreten " + error;
        console.log(message);
        res.status(500).json({ message: message });
    }
})

router.get("/planInfo/:planIndex", checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;
        const planIndex = parseInt(req.params.planIndex);

        console.log(planIndex);

        if (planIndex >= 0 && planIndex < user.customPlans.length) {
            const trainingPlan = user.customPlans[planIndex];

            const jsonTrainingPlan = trainingPlan.toObject();

            res.json(jsonTrainingPlan);
        } else {
            res.status(404).json({ error: "Plan nicht gefunden" });
        }
    } catch (error) {
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

router.patch("/plan/:planIndex", checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;

        const planIndex = parseInt(req.params.planIndex);

        console.log("we here and right");
        console.log(planIndex);

        if (planIndex >= 0 && planIndex < user.customPlans.length) { 
            const trainingPlan = user.customPlans[planIndex];

            trainingPlan.title = req.body.title;
            trainingPlan.trainingFrequency = req.body.trainingFrequency;
            trainingPlan.trainingPhase = req.body.trainingPhase;
            trainingPlan.weightRecommandationBase = req.body.weightPlaceholders;
    
            await user.save();
    
            res.status(200).json({});
        } else {
            res.status(404).json({ error: "Plan nicht gefunden" });
        }
    } catch (error) {
        const msg = "Es ist ein Fehler beim bearbeiten des Plans aufgetreten " + error;
        console.log(msg);
        res.status(500).json({ message: msg });

    }
})

router.post('/create', checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;

        const title = req.body.title;
        const trainingFrequency = req.body.trainingFrequency;
        const trainingPlanWeeks = req.body.trainingWeeks;
        const trainingPhase = req.body.trainingPhase;
        const weightRecommandation = req.body.weightPlaceholders;

        const trainingWeeks = createNewTrainingPlanWithPlaceholders(
            parseInt(trainingPlanWeeks),
            parseInt(trainingFrequency)
          );

        // Erstelle einen neuen TrainingBlock
        const newTrainingBlock = new TrainingBlock({
            title: title,
            trainingFrequency: trainingFrequency,
            trainingPhase: trainingPhase,
            weightRecommandationBase: weightRecommandation,
            lastUpdated: new Date(),
            trainingWeeks: trainingWeeks,
        });

        user.customPlans.push(newTrainingBlock);
        user.customPlans.sort((a : any , b : any) => b.lastUpdated - a.lastUpdated);

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

function createNewTrainingPlanWithPlaceholders(weeks : number, daysPerWeek : number) {
    const trainingWeeks = [];
  
    for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
      const trainingDays = [];
      for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
        const trainingDay = {
          exercises: [],
        };
        trainingDays.push(trainingDay);
      }
      trainingWeeks.push({ trainingDays });
    }
  
    return trainingWeeks;
  }



export default router;
