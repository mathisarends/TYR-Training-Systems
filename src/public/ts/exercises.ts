import { initializeExercisePatch, sendChangedData } from "./utils/exercisePatchModule.js";
import { ApiData } from "../../../interfaces/ApiData.js";
import { handleExerciseResetButtonClick } from "./utils/exerciseResetButton.js";

let changedData: ApiData = {}; // Definiere changedData im höheren Kontext

console.log("korrekt eingebunden");

initializeExercisePatch((data) => {
  changedData = data; // Aktualisiere changedData im höheren Kontext
  console.log("in exercises.ts")
  console.log(changedData);
});

const form = document.querySelector("form");
form?.addEventListener("submit", e => {
    e.preventDefault();

    sendChangedData("/exercises", "PATCH", changedData);
})

// reseting exercises
const resetBtn = document.getElementById("reset-btn")!;
resetBtn.addEventListener("click", e => {
    e.preventDefault();
    handleExerciseResetButtonClick();
})