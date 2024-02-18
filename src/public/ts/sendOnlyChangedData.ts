import { initializeExercisePatch, sendChangedData } from "./utils/exercisePatchModule.js";
import { ApiData } from "../../../interfaces/ApiData.js";

let changedData: ApiData = {}; // Definiere changedData im höheren Kontext

const path = window.location.pathname;

console.log("Hello bin eingebunden");

initializeExercisePatch((data) => {
  changedData = data; // Aktualisiere changedData im höheren Kontext
  console.log(changedData);
});

const form = document.querySelector("form");
form?.addEventListener("submit", e => {
    e.preventDefault();

    // prevent default behavious send only changed data
    sendChangedData(path, "PATCH", changedData);
})
