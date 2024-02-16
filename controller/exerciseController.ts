import { Request, Response } from "express";
import { UserInterface } from "../src/models/user.types.js";
import { Exercise, ExerciseCategory } from "../src/models/exercise.types.js";

import { ApiData } from "../interfaces/ApiData.js";
import { ExerciseCategories } from "../interfaces/ExerciseCategoriesEnum.js";

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

/**
 * Renders the user's exercises on the exercises page.
 *
 * This function prepares the exercises data for rendering and renders the 'exercises' page with the provided data.
 *
 * @async
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @throws {Error} Throws an error if there is an issue during the rendering process.
 *
 * @example
 * // Example usage in an Express route:
 * app.get('/user/exercises', showUserExercises);
 */
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

/**
 * Resets the user's exercises to predefined placeholder exercises.
 *
 * This function resets the user's exercises for each category to predefined placeholder exercises.
 *
 * @async
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @throws {Error} Throws an error if there is an issue during the reset process.
 *
 * @example
 * // Example usage in an Express route:
 * app.post('/user/exercises/reset', resetUserExercises);
 */
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

/**
 * Maps changed data to categories based on the provided API data.
 *
 * This function iterates through the changed data and organizes it into a map where each category is associated with its changed field names and new values.
 *
 * @param {ApiData} changedData - The changed data received from the API.
 * @returns {Object} An object mapping categories to their changed field names and new values.
 *
 * @example
 * // Example usage:
 * const apiData = { '1_field1': 'value1', '2_field2': 'value2' };
 * const categoriesMap = mapChangedDataToCategories(apiData);
 * console.log(categoriesMap);
 * // {
 * //   'category1': { fieldNames: ['1_field1'], newValues: ['value1'] },
 * //   'category2': { fieldNames: ['2_field2'], newValues: ['value2'] }
 * // }
 */
function mapChangedDataToCategories(changedData: ApiData): { [category: string]: { fieldNames: string[]; newValues: any[] } } {
  const changedCategoriesMap: { [category: string]: { fieldNames: string[]; newValues: any[] } } = {};

  Object.entries(changedData).forEach(([fieldName, newValue]) => {

    const categoryIndex = parseInt(fieldName.charAt(0));
    const category = getAssociatedCategoryByIndex(categoryIndex);

    if (!changedCategoriesMap[category]) {
      changedCategoriesMap[category] = { fieldNames: [], newValues: [] };
    }

    changedCategoriesMap[category].newValues.push(newValue);
    changedCategoriesMap[category].fieldNames.push(fieldName);
  });

  return changedCategoriesMap;
}

/**
 * Process changes related to exercises based on the provided field name, index, new values, and user exercise field.
 *
 * If the field name indicates an exercise change, it updates the exercise name or adds a new exercise.
 * If the field name indicates a change applicable to all exercises in the category, it iterates over all exercises and updates the corresponding category field.
 *
 * @param {string} fieldName - The name of the changed field.
 * @param {number} index - The index of the field in the newValues array.
 * @param {any[]} newValues - An array of new values corresponding to the changed fields.
 * @param {Exercise[]} userExerciseField - The array of user exercises needed to apply changes.
 */
function processExerciseChanges(
  fieldName: string,
  index: number,
  newValues: any [],
  userExerciseField: Exercise[],
) {


  if (isExercise(fieldName)) { // means that the exercise name was changed or a new exercise was added

    const exerciseIndex = parseInt(fieldName.charAt(2));

    if  (exerciseIndex >= userExerciseField.length) { // if it is a new Exercise push it to array
      const exerciseCategoryMetaInfo = getCategoryInfoFromList(userExerciseField)!;
      const newUserExercise = createExerciseObject(exerciseCategoryMetaInfo, newValues[index], undefined); // TODO: implement maxFactor
      userExerciseField.push(newUserExercise);
    } else { // else rename it
      userExerciseField[exerciseIndex].name = newValues[index];
    }

  } else { // means a field which is applied for all exercises of the category
        // was change which means we have to iterate over all fields

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
}

/**
 * Handles the PATCH request to update user exercises based on the provided changes.
 *
 * @async
 * @throws {Error} Throws an error if there is an issue during the update process.
 *
 * @example
 * // Example usage in an Express route:
 * app.patch('/user/exercises', patchUserExercises);
 */
export async function patchUserExercises(req: Request, res: Response) {
  try {
    const user: UserInterface = res.locals.user;
    const changedData: ApiData = req.body;

    const changedCategoriesMap = mapChangedDataToCategories(changedData);

    Object.entries(changedCategoriesMap).forEach(([category, { fieldNames, newValues }]) => {
      const userExerciseField = getExerciseFieldByCategory(category, user);

      for (let index = 0; index < fieldNames.length; index++) {
        processExerciseChanges(fieldNames[index], index, newValues, userExerciseField);
      }

    });

    await user.save();

    res.status(200).json({ message: "Erfolgreich aktualisiert." });
  } catch (error) {
    console.error("An error occurred while trying to patch user exercises", error);
    res.status(500).json({ message: "Interner Serverfehler beim Aktualisieren der Benutzerübungen." });
  }
}

/**
 * Checks if the provided field name corresponds to an exercise.
 *
 * This function returns true if the field name ends with the string "exercise," indicating that it is related to an exercise.
 *
 * @param {string} fieldName - The name of the field to be checked.
 * @returns {boolean} True if the field corresponds to an exercise, false otherwise.
 *
 */
function isExercise(fieldName: string) {
  return fieldName.endsWith("exercise")
}

/**
 * Gets the category information from the first element of a list.
 *
 * @param {Array} exerciseList - The list of exercises.
 * @returns {Object|null} The category information of the first exercise, or null if the list is empty.
 */
function getCategoryInfoFromList(exerciseList: Exercise[]) : ExerciseCategory | null {
  if (exerciseList.length > 0) {
    const firstExercise = exerciseList[0];
    return firstExercise.category;
  } else {
    return null; // Return null if the list is empty
  }
}

/**
 * Creates and returns an exercise object.
 *
 * This function constructs an exercise object with the provided parameters.
 *
 * @param {Category} category
 * @param {string} name - The name of the specific exercise.
 * @param {number|undefined} maxFactor - The maximum factor for the exercise (optional).
 * @returns {Object} An exercise object with the specified properties.
 
 */
function createExerciseObject(category: ExerciseCategory, name: string, maxFactor: number | undefined) : Exercise {
  const object = {
    category: category,
    name,
    maxFactor
  }

  return object;
}


/**
 * Gets the exercise field corresponding to the specified category from the user's data.
 *
 * This function takes a category name and a user object and returns the corresponding exercise field from the user's data based on the category.
 *
 * @param {string} category - The name of the exercise category (e.g., "Squat", "Bench").
 * @param {Object} user - The user object containing exercise fields for different categories.
 * @returns {Array} An array representing the exercise field for the specified category.
 * @throws {Error} Throws an error if the specified category is unknown.
 *
 */
function getExerciseFieldByCategory(category: ExerciseCategories, user: any) {
  switch (category) {
    case ExerciseCategories.SQUAT:
      return user.squatExercises;
    case ExerciseCategories.BENCH:
      return user.benchExercises;
    case ExerciseCategories.DEADLIFT:
      return user.deadliftExercises;
    case ExerciseCategories.OVERHEADPRESS:
      return user.overheadpressExercises;
    case ExerciseCategories.CHEST:
      return user.chestExercises;
    case ExerciseCategories.BACK:
      return user.backExercises;
    case ExerciseCategories.SHOULDER:
      return user.shoulderExercises;
    case ExerciseCategories.TRICEPS:
      return user.tricepsExercises;
    case ExerciseCategories.BICEPS:
      return user.bicepsExercises;
    case ExerciseCategories.LEGS:
      return user.legExercises;
    default:
      throw new Error(`Unknown category: ${category}`);
  }
}


/**
 * Gets the associated category name based on the provided index.
 *
 * This function takes an index and returns the corresponding category name.
 *
 * @param {number} index - The index used to determine the associated category.
 * @returns {string} The associated category name.
 * @throws {Error} Throws an error if the provided index does not correspond to a valid category.
 *
 */
function getAssociatedCategoryByIndex(index: number): ExerciseCategories {
  switch (index) {
    case 0:
      return ExerciseCategories.PLACEHOLDER;
    case 1:
      return ExerciseCategories.SQUAT;
    case 2:
      return ExerciseCategories.BENCH;
    case 3:
      return ExerciseCategories.DEADLIFT;
    case 4:
      return ExerciseCategories.OVERHEADPRESS;
    case 5:
      return ExerciseCategories.BACK;
    case 6:
      return ExerciseCategories.CHEST;
    case 7:
      return ExerciseCategories.SHOULDER;
    case 8:
      return ExerciseCategories.TRICEPS;
    case 9:
      return ExerciseCategories.BICEPS;
    case 10:
      return ExerciseCategories.LEGS;
    default:
      throw new Error("Category is not valid");
  }
}

/**
 * Prepares exercise data for rendering on the client side.
 *
 * @param {Object} user - The user object containing exercise fields for different categories.
 * @returns {Object} An object containing prepared exercise data for rendering.
 * @property {string} userID - The user ID.
 * @property {string[]} exerciseCategories - An array of exercise categories.
 * @property {Record<string, string[]>} categorizedExercises - A record mapping each category to an array of exercise names.
 * @property {Record<string, number>} categoryPauseTimes - A record mapping each category to its corresponding pause time.
 * @property {Record<string, number | undefined>} maxFactors - A record mapping each exercise name to its max factor.
 * @property {Record<string, { defaultSets: number; defaultReps: number; defaultRPE: number }>} defaultRepSchemeByCategory - A record mapping each category to its default rep scheme.
 */
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
