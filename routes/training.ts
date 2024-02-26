import express from "express";
const router = express.Router();

import { UserInterface } from "../src/models/user.types.js";
import { TrainingBlockInterface } from "../src/models/trainingBlock.types.js";

import TrainingBlock from "../src/models/trainingBlock.model.js";
import { prepareExercisesData } from "../controller/exerciseController.js";

import { checkAuthenticated } from "../middleware/authMiddleware.js";
import { formatCustomDate } from "../src/public/generic/formatDate.js";
import { ApiData } from "../interfaces/ApiData.js";
import { ExerciseInterface, TrainingDayInterface } from "../src/models/trainingDay.types.js";

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

// TODO: wir betracheten hier bislang nur weekId aber wollen das eingentlich dynamisch gestalten
router.get("/trainingplan/:id", checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;

        const planId = req.params.id;
        const trainingPlan = user.customPlans.id(planId);

        const trainingWeek = trainingPlan.trainingWeeks[0];
        const {
            exerciseCategories,
            categoryPauseTimes,
            categorizedExercises,
            defaultRepSchemeByCategory,
            maxFactors
        } = prepareExercisesData(user);

        res.render("training/trainingPage", {
            defaultLayout: true,
            carousel: false,
            trainingPlan,
            trainingWeek,
            planId,

            exerciseCategories,
            categoryPauseTimes,
            categorizedExercises,
            defaultRepSchemeByCategory,
            maxFactors
        })


    } catch (error) {
        console.log("Es ist ein Fehler beim Aufrufen des Trainingsplans aufgetreten!", error);
    }
})

router.patch("/trainingplan/:id", checkAuthenticated, async (req, res) => {
    try {
        const user = res.locals.user;

        const planId = req.params.id;
        const trainingPlan = user.customPlans.id(planId);

        const trainingWeek = trainingPlan.trainingWeeks[0];

        type StringKeyObject = { [key: string]: string };
        const changedData : StringKeyObject  = req.body;

        Object.entries(changedData).forEach(([fieldName, fieldValue]) => {
            const dayIndex = parseInt(fieldName.charAt(3));
            const exerciseIndex = parseInt(fieldName.charAt(13));
            const trainingDay: TrainingDayInterface = trainingWeek.trainingDays[dayIndex - 1];
            
            let exercise: Partial<ExerciseInterface> = trainingDay.exercises[exerciseIndex - 1];
            

            // hier vielleicht die ersten zeichen ausschneiden und gucken ob so ein eintrag die kategorie 
            // - Bitte Auswählen - hat dann die Übung nicht neu erstellen!
            if (!exercise) {
                const newExercise = createExerciseObject(fieldName, fieldValue);

                //@ts-ignore
                trainingDay.exercises.push(newExercise);

                exercise = newExercise;
            }

            //@ts-ignore
            changeExercise(fieldName, fieldValue, exercise, trainingDay, exerciseIndex);
        })

        await user.save();

        res.status(200).json({});

    } catch (error) {
        console.log("Es ist ein Fehler beim Aufrufen des Trainingsplans aufgetreten!", error);
    }
})

function createExerciseObject(fieldName : string, fieldValue : string) : Partial<ExerciseInterface>{
    return {
        // only string types
        category: fieldName.endsWith("category") ? fieldValue : "",
        exercise: "",
        weight: "",
        notes: "",
    };
}

function changeExercise(fieldName: string, fieldValue: string, exercise: ExerciseInterface, trainingDay : TrainingDayInterface, exerciseIndex : number) {

    // zum löschen nachdem sie gelöscht wurde wird sie aber wieder neue erstellt!!! also funktioniert noch nicht
    if (fieldName.endsWith("category") && fieldValue === "- Bitte Auswählen -") {
        trainingDay.exercises.splice(exerciseIndex, 1);
        console.log("exercises", trainingDay.exercises);
        console.log("gelöscht");
        return;
    }

    switch (true) {
        case fieldName.endsWith("category"):
            exercise.category = fieldValue;
            break;
        case fieldName.endsWith("exercise_name"):
            exercise.exercise = fieldValue;
            break;
        case fieldName.endsWith("sets"):
            exercise.sets = Number(fieldValue);
            break;
        case fieldName.endsWith("reps"):
            exercise.reps = Number(fieldValue);
            break;
        case fieldName.endsWith("weight"):
            exercise.weight = fieldValue;
            break;
        case fieldName.endsWith("targetRPE"):
            exercise.targetRPE = Number(fieldValue);
            break;
        case fieldName.endsWith("actualRPE"):
            exercise.actualRPE = Number(fieldValue);
            break;
        case fieldName.endsWith("estMax"):
            exercise.estMax = Number(fieldValue);
            break;
        case fieldName.endsWith("workout-notes"):
            exercise.notes = fieldValue;
            break;
        default:
            console.log("Dieses Feld gibt es leider nicht!");
            break;
    }
}


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

        if (planIndex >= 0 && planIndex < user.customPlans.length) {
            const trainingPlan = user.customPlans[planIndex];

            trainingPlan.title = req.body.title;
            trainingPlan.trainingFrequency = req.body.trainingFrequency;
            trainingPlan.trainingPhase = req.body.trainingPhase;
            trainingPlan.weightRecommandationBase = req.body.weightPlaceholders;

            if (trainingPlan.trainingWeeks.length !== req.body.trainingWeeks) {

                const difference = trainingPlan.trainingWeeks.length - parseInt(req.body.trainingWeeks);

                handleWeekDifference(trainingPlan, difference);

            }

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

function handleWeekDifference(trainingPlan: TrainingBlockInterface, difference: number) {

    const absoluteDifference = Math.abs(difference);

    if (difference < 0) {
        //@ts-ignore
        addNewTrainingWeeks(trainingPlan.trainingWeeks, trainingPlan.trainingFrequency, absoluteDifference, trainingPlan._id)
    } else {
        removeTrainingWeeks(trainingPlan.trainingWeeks, absoluteDifference)
    }

}

function addNewTrainingWeeks(
    trainingWeeks: any,
    trainingFrequency: number,
    addedWeeks: number,
    trainingPlanId: string
) {
    const emptyTrainingDay = {
        exercises: [],
    };

    for (let j = 0; j < addedWeeks; j++) {
        const trainingDays = [];
        for (let i = 0; i < trainingFrequency; i++) {
            trainingDays.push(emptyTrainingDay);
        }
        trainingWeeks.push({ trainingDays, trainingPlanId });
    }
}

export function removeTrainingWeeks(
    trainingWeeks: any,
    removeTrainingWeeks: number,
) {
    for (let i = 0; i < removeTrainingWeeks; i++) {
        trainingWeeks.pop();
    }
}


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
        user.customPlans.sort((a: any, b: any) => b.lastUpdated - a.lastUpdated);

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

function createNewTrainingPlanWithPlaceholders(weeks: number, daysPerWeek: number) {
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
