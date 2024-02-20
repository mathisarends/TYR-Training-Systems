// editTrainingPlanModule.ts

import { CardModule } from "./CardModule.js";

export function initializeEditTrainingPlanModule() {
    const editPlanButton = document.getElementById("edit-plan-button");

    editPlanButton?.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await fetch(`training/planInfo/${CardModule.getInstance(".training-card").getLastSelectedPlanIndex()}`, {
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
    });

    function createEditModal(data: any) {
        // Erstelle ein neues Modal-Element
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = "editModal";
        modal.tabIndex = -1;
        modal.role = "dialog";
        modal.setAttribute("aria-labelledby", "editModalLabel");
        modal.setAttribute("aria-hidden", "true");

        // ... (Dein bestehender Code für das Modal)
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
                                <option value="3" ${data.trainingFrequency === 3 ? "selected" : ""}>3</option>
                                <option value="4" ${data.trainingFrequency === 4 ? "selected" : ""}>4</option>
                                <option value="5" ${data.trainingFrequency === 5 ? "selected" : ""}>5</option>
                                <option value="6" ${data.trainingFrequency === 6 ? "selected" : ""}>6</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="training_weeks">Blocklänge
                                (Wochen)</label>
                            <select name="trainingWeeks" id="training_weeks" class="form-control" required>
                                <option value="" disabled ${data.trainingWeeks.length === 0 ? "selected" : ""}></option>
                                <option value="3" ${data.trainingWeeks.length === 3 ? "selected" : ""}>3</option>
                                <option value="4" ${data.trainingWeeks.length === 4 ? "selected" : ""}>4</option>
                                <option value="5" ${data.trainingWeeks.length === 5 ? "selected" : ""}>5</option>
                                <option value="6" ${data.trainingWeeks.length === 6 ? "selected" : ""}>6</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="trainingPhaseSelector">Trainingsphase</label>
                                <select name="trainingPhase" id="trainingPhaseSelector" class="form-control" required>
                                    <option value="hypertrophie" ${data.trainingPhase === "hypertrophie" ? "selected" : ""}>Hypertrophie</option>
                                    <option value="kraft" ${data.trainingPhase === "kraft" ? "selected" : ""}>Kraft</option>
                                </select>
                        </div>

                        <div class="form-group">
                            <label for="weightPlaceholders">Gewichtsempfehlungen</label>
                            <select name="weightPlaceholders" class="form-control" required>
                                <option value="max" ${data.weightRecommandationBase === "max" ? "selected" : ""}>basierend auf Rechenmax</option>
                                <option value="lastWeek" ${data.weightRecommandationBase === "lastWeek" ? "selected" : ""}>basierend auf letzter Woche</option>
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
}

// maybe make this generic
function setUpEditModalFunctionality() {
    const modal = document.getElementById("editModal");

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
        const patchUrl = `training/plan/${CardModule.getInstance(".training-card").getLastSelectedPlanIndex()}`;

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