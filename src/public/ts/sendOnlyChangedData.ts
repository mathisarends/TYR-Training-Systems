import { ExercisePatchHandler } from "./utils/exercisePatchModule.js";

let path = window.location.pathname;

const exercisePatchHandler = ExercisePatchHandler.getInstance();

const form = document.querySelector("form");
form?.addEventListener("submit", e => {
    e.preventDefault();

    // prevent default behavious send only changed data
    exercisePatchHandler.sendChangedData(path, "PATCH");
})
