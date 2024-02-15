import { Request, Response } from "express";
import { UserInterface } from "../src/models/user.types.js";
import { Exercise } from "../src/models/exercise.types.js";
import { CategoryExercises } from "../interfaces/CategoryExercises.js";

import { ApiData } from "../interfaces/ApiData.js";

// for reset
import {
  placeHolderExercises,
  squatExercises,
  benchExercises,
  deadliftExercises,
  overheadpressExercises,
  chestExercises,
  backExercises,
  shoulderExercises,
  bicepsExercises,
  tricepExercises,
  legExercises,
} from "../src/generators/standartExeciseCatalog.js";
import { ExerciseInterface } from "../src/models/trainingDay.types.js";

export async function showUserExercises(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const exercisesData = prepareExercisesData(user);

    res.render("exercises", {
      defaultLayout: true,
      carousel: false,
      exercisesData,
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

    // reset all exercises per category
    (user.placeholderExercises = placeHolderExercises),
      (user.squatExercises = squatExercises),
      (user.benchExercises = benchExercises),
      (user.deadliftExercises = deadliftExercises),
      (user.overheadpressExercises = overheadpressExercises),
      (user.backExercises = backExercises),
      (user.chestExercises = chestExercises),
      (user.shoulderExercises = shoulderExercises),
      (user.bicepsExercises = bicepsExercises),
      (user.tricepExercises = tricepExercises),
      (user.legExercises = legExercises),
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
    const changedData: ApiData = req.body;

    // eine kategorie speichert ein array von indexes zum ersetzen von feldern im array und 
    // newValues hält dann den string
    const changedCategoriesMap: { [category: string]: {fieldNames: string[]; newValues: any[] } } = {};

    Object.entries(changedData).forEach(([fieldName, newValue]) => {
      console.log(`${fieldName} has been changed to ${newValue}`);

      const categoryIndex = parseInt(fieldName.charAt(0));
      const category = getAssociatedCategoryByIndex(categoryIndex);

      // if there is now entry in the map create a new one
      if (!changedCategoriesMap[category]) {
        changedCategoriesMap[category] = { fieldNames: [], newValues: [] };
      }

      changedCategoriesMap[category].newValues.push(newValue);
      changedCategoriesMap[category].fieldNames.push(fieldName);

    });

    Object.entries(changedCategoriesMap).forEach(([category, { fieldNames, newValues }]) => {
      const userExerciseField = getExerciseFieldByCategory(category, user);

      fieldNames.forEach((fieldName, index) => {
        if (fieldName.endsWith("exercise")) { // means the name was changed

          const exerciseIndex = parseInt(fieldNames[index].charAt(2));
          userExerciseField[exerciseIndex].name = newValues[index];

        } else { // means a field which is applied for all exercises of the category
              // was change which means we have to iterate over all fields

              // TODO: implement that new exercise may be added!!!

          userExerciseField.forEach((exerciseField: Exercise) => {

            switch (true) {
              case fieldName.endsWith("categoryPauseTimeSelect"):
                exerciseField.category.pauseTime = newValues[index];
                break;
              case fieldName.endsWith("categoryDefaultSetSelect"):
                exerciseField.category.defaultSets = newValues[index];
                break;
              case fieldName.endsWith("categoryDefaultRepSelect"):
                exerciseField.category.defaultReps = newValues[index];
                break;
              case fieldName.endsWith("categoryDefaultRPESelect"):
                exerciseField.category.defaultRPE = newValues[index];
                break;
              default:
                // do nothing here
                break;
            }

          });
          
         }
      })

    });

    await user.save();

    res.status(200).json({ message: "Erfolgreich aktualisiert." });
  } catch (error) {
    console.error("An error occurred while trying to patch user exercises", error);
    res.status(500).json({ message: "Interner Serverfehler beim Aktualisieren der Benutzerübungen." });
  }
}

// auch mit dieser funktion stimmt irgendwas nicht ausführlich testen bitte ^^
function getExerciseFieldByCategory(category: string, user: any) {
  switch (category) {
    case "Squat":
      return user.squatExercises;
    case "Bench":
      return user.benchExercises;
    case "Deadlift":
      return user.deadliftExercises;
    case "Overheadpress":
      return user.overheadpressExercises;
    case "Chest":
      return user.chestExercises;
    case "Back":
      return user.backExercises;
    case "Shoulder":
      return user.shoulderExercises;
    case "Triceps":
      return user.tricepsExercises;
    case "Biceps":
      return user.bicepsExercises;
    case "Leg":
      return user.legExercises;
    default:
      // handle default case or throw an error
      throw new Error(`Unknown category: ${category}`);
  }
}

function getExercisesByCategory(exercises: Exercise[], category: string) {
  return exercises.filter((exercise) => exercise.category.name === category);
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

  if (index === 0) {
    return "- Bitte Auswählen -";
  } else if (index === 1) {
    return "Squat";
  } else if (index === 2) {
    return "Bench";
  } else if (index === 3) {
    return "Deadlift";
  } else if (index === 4) {
    return"Overheadpress";
  } else if (index === 5) {
    return "Back";
  } else if (index === 6) {
    return "Chest";
  } else if (index === 7) {
    return "Shoulder";
  } else if (index === 8) {
    return "Triceps";
  } else if (index === 9) {
    return "Biceps";
  } else if (index === 10) {
    return "Legs";
  } else {
    throw new Error("Category is not valid");
  }
}

export function prepareExercisesData(user: any) {
  //TODO
  const categorizedExercises: Record<string, string[]> = {};
  const categoryPauseTimes: Record<string, number> = {};
  const maxFactors: Record<string, number | undefined> = {};
  const defaultRepSchemeByCategory: Record<
    string,
    { defaultSets: number; defaultReps: number; defaultRPE: number }
  > = {};

  const allCategorysArray = [
    user.placeholderExercises,
    user.squatExercises,
    user.benchExercises,
    user.deadliftExercises,
    user.overheadpressExercises,
    user.backExercises,
    user.chestExercises,
    user.shoulderExercises,
    user.bicepsExercises,
    user.tricepExercises,
    user.legExercises,
  ];

  for (const categoryArray of allCategorysArray) {
    const exercises = Array.isArray(categoryArray)
      ? categoryArray
      : [categoryArray]; // Umwandelung in Array für iteration

    for (const exercise of exercises) {

      if (exercise && exercise.category.name) {
        const categoryName = exercise.category.name;

        if (!categorizedExercises[categoryName]) {
          categorizedExercises[categoryName] = [];
        }
        categorizedExercises[categoryName].push(exercise.name);

        if (!categoryPauseTimes[categoryName]) {
          categoryPauseTimes[categoryName] = exercise.category.pauseTime;
        }

        // Max Factors pro Übung
        maxFactors[exercise.name] = exercise.maxFactor;

        if (!defaultRepSchemeByCategory[categoryName]) {
          defaultRepSchemeByCategory[categoryName] = {
            defaultSets: exercise.category.defaultSets,
            defaultReps: exercise.category.defaultReps,
            defaultRPE: exercise.category.defaultRPE,
          };
        }
        // TODO: wo kommt das her?
      } else {
        console.error("Exercise or exercise category is undefined:", exercise);
      }
    }
  }

  return {
    userID: user.id,
    exerciseCategories: Object.keys(categorizedExercises),
    categoryPauseTimes,
    categorizedExercises,
    defaultRepSchemeByCategory,
    maxFactors,
  };
}
