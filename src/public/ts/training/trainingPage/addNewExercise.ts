console.log("bin jetzt auch eingebunden!!");

export function initializeAddNeExercise() {
    const addNewExerciseButtons = document.querySelectorAll(".add-new-exercise-button");
    const exerciseTables = document.querySelectorAll(".training-table");

    const url = window.location.href;

    // TEMPLATE ODER CUSTOM SEITE
    addNewExerciseButtons.forEach((addExerciseBTN, index) => {
        addExerciseBTN.addEventListener("click", e => {
            e.preventDefault();

            const tableBody = exerciseTables[index].querySelector("tbody")!;
            const tableRows = tableBody.querySelectorAll(".table-row.mainExercise");
            const lastTr = tableRows[tableRows.length - 1];

            if (tableRows.length >= 12) {
                showMaxExercisesReachedModal();
            } else {
                const lastTrInnerHTML = lastTr.innerHTML; //create a new table row for the given table based on the previous last one

                let newTableRowInnerHTML = lastTrInnerHTML.replace(/_exercise(\d+)_/g, (match, group) => `_exercise${parseInt(group) + 1}_`);

                const newRow = document.createElement("tr");
                newRow.innerHTML = newTableRowInnerHTML;
                tableBody.appendChild(newRow);

                setupNewTableRow(newRow);
            }
        })
    })


    function showMaxExercisesReachedModal() {
        // Erstelle ein neues Bootstrap-Modal
        const modal = document.createElement("div");
        modal.classList.add("modal", "fade"); // Füge Bootstrap-Klassen hinzu
        modal.setAttribute("id", "customModal"); // Füge ein benutzerdefiniertes Attribut hinzu

        // Füge den Modal-Inhalt hinzu
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Maximale Übungen erreicht</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Du hast die maximale Anzahl von Übungen erreicht.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Schließen</button>
                </div>
            </div>
        </div>
    `;

        document.body.appendChild(modal); // Füge das Modal zum Body hinzu

        // Zeige das Modal an
        $(modal).modal("show");

        // Entferne das Modal, wenn es geschlossen wird
        $(modal).on("hidden.bs.modal", function () {
            document.body.removeChild(modal);
        });
    }

    function setupNewTableRow(tableRow : HTMLTableRowElement) {

        // show placeholder exerciseSelector first
        const previousExerciseNameSelector = tableRow.querySelector('.exercise-name-selector:not([style*="display: none"])') as HTMLSelectElement;
        previousExerciseNameSelector.style.display = "none";

        const placeholderExerciseNameSelector = tableRow.querySelector(".exercise-name-selector") as HTMLSelectElement;
        placeholderExerciseNameSelector.style.display = "block";

        const categorySelector = tableRow.querySelector(".exercise-category-selector") as HTMLSelectElement;
        categorySelector.value = "- Bitte Auswählen -";

        categorySelector.style.opacity = "0";
        placeholderExerciseNameSelector.style.opacity = "0"


        clearInputElementValue(tableRow, ".sets");
        clearInputElementValue(tableRow, ".reps");
        clearInputElementValue(tableRow, ".weight");
        clearInputElementValue(tableRow, ".targetRPE");
        clearInputElementValue(tableRow, ".actualRPE");
        clearInputElementValue(tableRow, ".estMax");
        clearInputElementValue(tableRow, ".workout-notes");

        categorySelector.addEventListener("change", () => {

            const category = categorySelector.value;
            const allExerciseNameSelectors = tableRow.querySelectorAll(".exercise-name-selector");


            const categoryIndex = exerciseCategorys.indexOf(category);
            const exerciseNameSelector = allExerciseNameSelectors[categoryIndex];
        })

    }

    function clearInputElementValue(tableRow: HTMLTableRowElement, selector: string): void {
        const inputElement = tableRow.querySelector(selector) as HTMLInputElement;
        if (inputElement) {
            inputElement.value = "";
            if (selector === ".weight") {
                inputElement.placeholder = "";
            }
        }
    }

    const exerciseCategorys = [
        "- Bitte Auswählen -",
        "Squat",
        "Bench",
        "Deadlift",
        "Overheadpress",
        "Chest",
        "Back",
        "Shoulder",
        "Triceps",
        "Biceps",
        "Legs"
    ];
}