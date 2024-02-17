import { initializeExercisePatch, sendChangedData } from "./utils/exercisePatchModule";
import { ApiData } from "../../../interfaces/ApiData.js";

let changedData: ApiData = {}; // Definiere changedData im höheren Kontext

console.log("korrekt eingebunden");

initializeExercisePatch((data) => {
  changedData = data; // Aktualisiere changedData im höheren Kontext
  console.log(changedData);
});

const form = document.querySelector("form");
form?.addEventListener("submit", e => {
    e.preventDefault();

    // prevent default behavious send only changed data
    sendChangedData("/exercises", "PATCH", changedData);
})

