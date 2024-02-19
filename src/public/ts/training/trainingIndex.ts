import { initializeExercisePatch, sendChangedData } from "../utils/exercisePatchModule.js";
import { validateInput } from "../utils/validateInput.js";
import { dispatchChangeEventOnAllInputs } from "../utils/dispatchChangeEventOnAllInputs.js";
import { ApiData } from "../../../../interfaces/ApiData.js";

let changedData: ApiData = {};

initializeExercisePatch((data) => {
    changedData = data; // Aktualisiere changedData im höheren Kontext
    console.log(changedData);
});

const form = document.querySelector("form");
const createTrainingPlanBTN = document.getElementById("create-training-plan-btn");

dispatchChangeEventOnAllInputs(); // because some inputs are preselected for better user experience

createTrainingPlanBTN?.addEventListener("click", e => {
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




const trainingCards = document.querySelectorAll(".training-card");

let lastSelectedPlanIndex: number;

trainingCards.forEach((card, index) => {
    card.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        lastSelectedPlanIndex = index;

        handlePreSelect(card);

    })
})

function handlePreSelect(card: Element) {
    trainingCards.forEach(currentCard => {
        if (card !== currentCard) {
            currentCard.classList.remove("active")
        } else {
            currentCard.classList.add("active");
            showMoreOptionsContainer();
        }
    })
}

const contentBody = document.getElementById("contentBody");
contentBody?.addEventListener("click", e => {
    e.preventDefault();

    deSelectallCards();
})

function deSelectallCards() {
    trainingCards.forEach(currentCard => {
        currentCard.classList.remove("active")
    })
    showRegularCreateButton();
}


function showMoreOptionsContainer() {
    toggleVisibility("optionsButtonContainer", true);
    toggleVisibility("showCreatePlanModal", false);
}

function showRegularCreateButton() {
    toggleVisibility("optionsButtonContainer", false);
    toggleVisibility("showCreatePlanModal", true);
}

function toggleVisibility(elementId: string, show: boolean) {
    const element = document.getElementById(elementId);

    if (element) {
        if (show) {
            element.classList.remove("d-none");
            element.classList.add("d-flex");
        } else {
            element.classList.remove("d-flex");
            element.classList.add("d-none");
        }
    }
}

const deletePlanButton = document.getElementById("delete-plan-button");
console.log(deletePlanButton);

deletePlanButton?.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
        const response = await fetch(`/training/delete/${lastSelectedPlanIndex}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            window.location.href = "/training";
            // Hier kannst du zusätzliche Aktionen nach dem erfolgreichen Löschen durchführen
        } else {
            console.error("Fehler beim Löschen des TrainingPlans");
            // Hier kannst du auf einen Fehlerfall reagieren
        }
    } catch (error) {
        console.error("Fehler beim Fetchen oder Verarbeiten der DELETE-Anfrage", error);
        // Hier kannst du auf einen Fehlerfall reagieren
    }
});

const editPlanButton = document.getElementById("edit-plan-button");
editPlanButton?.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
        const response = await fetch(`training/planInfo/${lastSelectedPlanIndex}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Empfangene Daten:", data);

            const modal = createEditModal(data);





        } else {
            console.error("Fehler beim Abrufen der Daten");
        }
    } catch (error) {
        console.error("Fehler beim Fetchen oder Verarbeiten der Anfrage", error);
    }

})

function createEditModal( data : any) {
    // Erstelle ein neues Modal-Element
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "editModal";
    modal.tabIndex = -1;
    modal.role = "dialog";
    modal.setAttribute("aria-labelledby", "editModalLabel");
    modal.setAttribute("aria-hidden", "true");

    // Füge den Modal-HTML-Code hinzu
    modal.innerHTML = `
        <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Plan bearbeiten</h5>
          <button id="close-edit-modal" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
                <div class="row no-gutters">
                  <div class="col-md-12">
                    <div class="card-body">
                      <form id="edit-training-form">
                          <div class="form-group">
                            <label for="training_title">Titel</label>
                            <input type="text" class="form-control" value="${data.title}" id="training_title" name="title" required>
                          </div>

                          <div class="form-group">
                            <label for="training_frequency">Trainings /
                                Woche</label>
                            <select name="trainingFrequency" id="training_frequency" class="form-control" required>
                                <option value="3" ${ data.trainingFrequency === 3 ? "selected" : ""}>3</option>
                                <option value="4" ${ data.trainingFrequency === 4 ? "selected" : ""}>4</option>
                                <option value="5" ${ data.trainingFrequency === 5 ? "selected" : ""}>5</option>
                                <option value="6" ${ data.trainingFrequency === 6 ? "selected" : ""}>6</option>
                            </select>
                          </div>

                          <div class="form-group">
                            <label for="training_weeks">Blocklänge
                                (Wochen)</label>
                            <select name="trainingWeeks" id="training_weeks" class="form-control" required>
                                <option value="" disabled ${ data.trainingWeeks.length === 0 ? "selected" : ""}></option>
                                <option value="3" ${ data.trainingWeeks.length === 3 ? "selected" : ""}>3</option>
                                <option value="4" ${ data.trainingWeeks.length === 4 ? "selected" : ""}>4</option>
                                <option value="5" ${ data.trainingWeeks.length === 5 ? "selected" : ""}>5</option>
                                <option value="6" ${ data.trainingWeeks.length === 6 ? "selected" : ""}>6</option>
                            </select>
                          </div>

                          <div class="form-group">
                            <label for="trainingPhaseSelector">Trainingsphase</label>
                                <select name="trainingPhase" id="trainingPhaseSelector" class="form-control" required>
                                    <option value="hypertrophie" ${ data.trainingPhase === "hypertrophie" ? "selected" : ""}>Hypertrophie</option>
                                    <option value="kraft" ${ data.trainingPhase === "kraft" ? "selected" : ""}>Kraft</option>
                                </select>
                          </div>

                          <div class="form-group">
                            <label for="weightPlaceholders">Gewichtsempfehlungen</label>
                            <select name="weightPlaceholders" class="form-control" required>
                                <option value="max" ${ data.weightRecommandationBase === "max" ? "selected" : ""}>basierend auf Rechenmax</option>
                                <option value="lastWeek" ${ data.weightRecommandationBase === "lastWeek" ? "selected" : ""}>basierend auf letzter Woche</option>
                                <option value="off">keine Gewichtsempfehlungen</option>
                            </select>
                          </div>
        
                        </form>
                        </nav>
                    </div>
                  </div>
                </div>
        </div>

        <div class="modal-footer">
          <button id="close-edit-modal-2" type="button" class="btn btn-light" data-dismiss="modal">Close</button>
          <button id="edit-training-plan-btn" type="button" class="btn  btn-info">Edit</button>
        </div>
      </div>
        </div>
    `;

    // Füge das Modal zum DOM hinzu
    document.body.appendChild(modal);

    setUpEditModalFunctionality();

    //@ts-ignore
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    return modal;
}


// maybe make this generic
function setUpEditModalFunctionality() {
    const modal =  document.getElementById("editModal");

    const editTrainingPlanButton = document.getElementById("edit-training-plan-btn");
    const editTrainingForm = document.getElementById("edit-training-form") as HTMLFormElement;

    // dispatch event on submit when clicked
    editTrainingPlanButton?.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        editTrainingForm?.dispatchEvent(new Event("submit"));
    })

    editTrainingForm?.addEventListener("submit", async (e) => {
        
        const formData = new FormData(editTrainingForm);
        const patchUrl = `training/plan/${lastSelectedPlanIndex}`;

        try {
            const response = await fetch(patchUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (response.ok) {
                // Erfolgreich aktualisiert
                window.location.href = "/training";

            } else {
                // Fehler beim Aktualisieren des Plans
                console.error("Fehler beim Aktualisieren des Plans");
            }
        } catch (error) {
            console.error("Fehler beim Fetchen oder Verarbeiten der Anfrage", error);
        }

    })

    const closeEditModal = document.getElementById("close-edit-modal");
    const closeEditModa2 = document.getElementById("close-edit-modal-2");

    closeEditModal?.addEventListener("click", () => {
        modal?.remove();
        console.log("entfernt");
    })

    closeEditModa2?.addEventListener("click", () => {
        modal?.remove();
        console.log("entfernt");
    })


}