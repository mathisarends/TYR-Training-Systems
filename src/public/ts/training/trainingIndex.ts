import { ExercisePatchHandler } from "../utils/exercisePatchModule.js";
import { validateInput } from "../utils/validateInput.js";
import { dispatchChangeEventOnAllInputs } from "../utils/dispatchChangeEventOnAllInputs.js";
import { ApiData } from "../../../../interfaces/ApiData.js";

import { CardModule } from "./CardModule.js";
import { CreateTrainingPlanModule } from "./createTrainingPlanModule.js";
import { initializeDeleteTrainingPlanModule } from "./deleteTrainingPlanModule.js";
import { initializeEditTrainingPlanModule } from "./editTrainingPlanModule.js";

const exercisePatchHandler = ExercisePatchHandler.getInstance(); // new
const createTrainingPlanModule = new CreateTrainingPlanModule();

dispatchChangeEventOnAllInputs(); // because some inputs are preselected for better user experience

CardModule.getInstance(".training-card"); // singleton erzeugen

initializeDeleteTrainingPlanModule();
initializeEditTrainingPlanModule();

