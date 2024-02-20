import { initializeExercisePatch, sendChangedData } from "../utils/exercisePatchModule.js";
import { validateInput } from "../utils/validateInput.js";
import { dispatchChangeEventOnAllInputs } from "../utils/dispatchChangeEventOnAllInputs.js";
import { ApiData } from "../../../../interfaces/ApiData.js";

import { CardModule } from "./CardModule.js";
import { CreateTrainingPlanModule } from "./createTrainingPlanModule.js";
import { initializeDeleteTrainingPlanModule } from "./deleteTrainingPlanModule.js";
import { initializeEditTrainingPlanModule } from "./editTrainingPlanModule.js";

let changedData: ApiData = {};

const createTrainingPlanModule = new CreateTrainingPlanModule(changedData);

initializeExercisePatch((data : ApiData) => {
    changedData = data; // Aktualisiere changedData im höheren Kontext
    createTrainingPlanModule.setData(data);
});

dispatchChangeEventOnAllInputs(); // because some inputs are preselected for better user experience

CardModule.getInstance(".training-card"); // singleton erzeugen

initializeDeleteTrainingPlanModule();
initializeEditTrainingPlanModule();

