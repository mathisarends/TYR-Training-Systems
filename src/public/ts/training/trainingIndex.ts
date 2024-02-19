import { initializeExercisePatch, sendChangedData } from "../utils/exercisePatchModule.js";
import { validateInput } from "../utils/validateInput.js";
import { dispatchChangeEventOnAllInputs } from "../utils/dispatchChangeEventOnAllInputs.js";
import { ApiData } from "../../../../interfaces/ApiData.js";

let changedData : ApiData = {};

initializeExercisePatch((data) => {
    changedData = data; // Aktualisiere changedData im höheren Kontext
    console.log(changedData);
  });

  const form = document.querySelector("form");
  const createTrainingPlanBTN = document.getElementById("create-training-plan-btn");

  dispatchChangeEventOnAllInputs(); // because some inputs are preselected for better user experience

  createTrainingPlanBTN?.addEventListener("click", e  => {
    e.preventDefault();
    console.log("klick");
    form?.dispatchEvent(new Event("submit"));
  })

  form?.addEventListener("submit", e => {
      e.preventDefault();

      if (validateInput(form)) {
            // prevent default behavious send only changed data
            sendChangedData("training/create", "POST", changedData);

            hideCreateTrainingModal();

      } else {
        console.log("nicht alles ausgefüllt mashalla");
      }
  })

  function hideCreateTrainingModal() {
    //@ts-ignore
    const myModal = new Modal(document.getElementById('exampleModal')!);
    // Verstecke das Modal
    myModal.hide();
  }
  
