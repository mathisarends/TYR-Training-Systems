import User from "../src/models/user.model.js";
import standartExerciseCatalog from "../src/generators/standartExeciseCatalog.js"; // for reset
import ExerciseDocument from "../src/models/exercise.types.js";
import { Request, Response } from "express";
import { UserInterface } from "../src/models/user.types.js";
import { Exercise } from "../src/models/exercise.types.js";
import { CategoryExercises } from "../interfaces/CategoryExercises.js";

export async function showUserExercises(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const exercisesData = prepareExercisesData(user);

    console.log(exercisesData);

    res.render("exercises", {
      defaultLayout: true,
      carousel: false,
      exercisesData
    });
  } catch (error) {
    console.log(
      "Ein Fehler beim Laden der Exercise-Seite ist aufgetreten!",
      error
    );
  }
}

export async function resetUserExercises(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    user.exercises = standartExerciseCatalog;
    await user.save({ overwrite: true });
    console.log("Übungskatalog zurückgesetzt!");
    res.status(200).json({});
  } catch (error) {
    console.log(
      "Es ist ein Fehler beim zurücksetzen der Exercises aufgetreten:",
      error
    );
    res.status(500).json({});
  }
}

export async function patchUserExercises(req: Request, res: Response) {
  try {
    const user: UserInterface = res.locals.user;
    const changedData: Record<string, string>  = req.body;
    const exercises: any = user.exercises; // TODO: das hier bitte typisieren

    const changedCategoriesArray: string[] = []; // keeping track of already asigned categories
    const exercisesByCategory: CategoryExercises = {}; // save collection of arrays from categories that were changed with this patch

    // Iteriere über alle Einträge im req.body => finde erstmal die betreffenden categorien raus
    Object.entries(changedData).forEach(([fieldName, newValue]) => {
      //console.log(`Feld ${fieldName} wurde auf ${newValue} geändert.`);
      const categoryIndex = parseInt(fieldName.charAt(0));
      const category = getAssociatedCategoryByIndex(categoryIndex);

      if (!changedCategoriesArray.includes(category)) { // dont add category twice
        changedCategoriesArray.push(category);
        exercisesByCategory[category] = getExercisesByCategory(exercises, category); // what the fuck
      }
    });

    Object.entries(changedData).forEach(([fieldName, newValue]) => {
      if (fieldName.endsWith("exercise")) {

      } else if (fieldName.endsWith("Select")) {

      }
    })

    changedCategoriesArray.forEach((category) => {
      console.log(category);
    })

  } catch (err) {
    console.log(
      "Es ist ein Fehler beim Patchen der Exercises aufgetreten." + err
    );
  }
}

function getExercisesByCategory(exercises: Exercise[], category: string) {
  return exercises.filter(exercise => exercise.category.name === category);
}


function getNumberOfRequestedExercises(
  exerciseCategoriesLength: number,
  maxAmountOfExercises: number,
  exerciseData: any
) {
  let count = 0;

  for (let i = 0; i < exerciseCategoriesLength; i++) {
    for (let k = 0; k < maxAmountOfExercises; k++) {
      if (exerciseData[`exercise_${i}_${k}`]) {
        count++;
      }
    }
  }

  return count;
}

function createUserExerciseObject(
  exerciseName: string,
  exerciseMaxFactor: number,
  index: number,
  exerciseCategoryPauseTimes: number[],
  exerciseCategorySets: number[],
  exerciseCategoryReps: number[],
  exerciseCategoryRPE: number[]
) {
  const object = {
    name: exerciseName,
    maxFactor: exerciseMaxFactor,
    category: {
      name: getAssociatedCategoryByIndex(index),
      pauseTime: exerciseCategoryPauseTimes[index],
      defaultSets: exerciseCategorySets[index],
      defaultReps: exerciseCategoryReps[index],
      defaultRPE: exerciseCategoryRPE[index],
    },
  };

  return object;
}

function getAssociatedCategoryByIndex(index: number) {
  let category = "";

  if (index === 0) {
    category = "- Bitte Auswählen -";
  } else if (index === 1) {
    category = "Squat";
  } else if (index === 2) {
    category = "Bench";
  } else if (index === 3) {
    category = "Deadlift";
  } else if (index === 4) {
    category = "Overheadpress";
  } else if (index === 5) {
    category = "Chest";
  } else if (index === 6) {
    category = "Back";
  } else if (index === 7) {
    category = "Shoulder";
  } else if (index === 8) {
    category = "Triceps";
  } else if (index === 9) {
    category = "Biceps";
  } else if (index === 10) {
    category = "Legs";
  } else {
    console.log("ES IST EIN FEHLER AUFGETRETEN:");
  }
  return category;
}

// in order to show the exercise data of the user
export function prepareExercisesData(user: any) {
  // user schema noch definieren
  const predefinedExercises = user.exercises;

  const exerciseCategories = [
    ...new Set(
      predefinedExercises.map(
        (exercise: ExerciseDocument) => exercise.category.name
      )
    ),
  ];

  const categoryPauseTimes: Record<string, number> = {};
  const maxFactors: Record<string, number | undefined> = {};

  /*     const categoryPauseTimes = {};
    const maxFactors = {}; */

  predefinedExercises.forEach((exercise: ExerciseDocument) => {
    const categoryName = exercise.category.name;
    const pauseTime = exercise.category.pauseTime;
    if (!categoryPauseTimes[categoryName]) {
      categoryPauseTimes[categoryName] = pauseTime;
    }
    maxFactors[exercise.name] = exercise.maxFactor;
  });

  const defaultRepSchemeByCategory: Record<
    string,
    { defaultSets: number; defaultReps: number; defaultRPE: number }
  > = {};
  predefinedExercises.forEach((exercise: ExerciseDocument) => {
    const categoryName = exercise.category.name;
    const defaultSets = exercise.category.defaultSets;
    const defaultReps = exercise.category.defaultReps;
    const defaultRPE = exercise.category.defaultRPE;

    if (!defaultRepSchemeByCategory[categoryName]) {
      defaultRepSchemeByCategory[categoryName] = {
        defaultSets: defaultSets,
        defaultReps: defaultReps,
        defaultRPE: defaultRPE,
      };
    }
  });

  const categorizedExercises: Record<string, string[]> =
    predefinedExercises.reduce(
      (acc: Record<string, string[]>, exercise: ExerciseDocument) => {
        const categoryName = exercise.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(exercise.name);
        return acc;
      },
      {}
    );

  return {
    userID: user.id,
    exerciseCategories: exerciseCategories,
    categoryPauseTimes: categoryPauseTimes,
    categorizedExercises: categorizedExercises,
    defaultRepSchemeByCategory: defaultRepSchemeByCategory,
    maxFactors: maxFactors,
  };
}
