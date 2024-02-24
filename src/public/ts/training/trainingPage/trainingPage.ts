import { handleExerciseSelectors } from "./changeExerciseSelector.js";
import { handleDefaultValuesByCategory } from "./dsiplayDefaultSetSchema.js";
import { handlePlaceholderCategory } from "./removePlaceholder.js";
import { initializeRPEValidation } from "./rpeInputs.js";
import { initializeEstMaxCalculation } from "./calcBackoff.js";
import {initializeAddNeExercise} from "./addNewExercise.js";

document.addEventListener("DOMContentLoaded", () => {

    // initialisiere alle eventListener

    handleExerciseSelectors();
    handleDefaultValuesByCategory(); // default sets and reps
    handlePlaceholderCategory();
    initializeRPEValidation();
    initializeEstMaxCalculation();
    initializeAddNeExercise();

  });