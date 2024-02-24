export function initializeRPEValidation() {
    const MIN_RPE = 5;
    const MAX_RPE = 10;

    function validateRPE(rpe: number, rpeInput: HTMLInputElement) {
        switch (true) {
            case rpe < MIN_RPE:
                rpeInput.value = MIN_RPE.toString();
                break;
            case rpe > MAX_RPE:
                rpeInput.value = MAX_RPE.toString();
                break;
            default:
                rpeInput.value = rpe.toString();
        }
    }

    function updateWorkoutNotes(workoutNotes: HTMLInputElement, rpeDiff: number) {
        if (rpeDiff < -1) {
            workoutNotes.value += " overshoot ";
        } else if (rpeDiff > 1) {
            workoutNotes.value += " undershoot ";
        }
    }

    document.addEventListener("change", e => {
        const targetRPEInput = e.target as HTMLInputElement;

        if (targetRPEInput && targetRPEInput.classList.contains("targetRPE")) {
            const targetRPE: number = parseInt(targetRPEInput.value);
            validateRPE(targetRPE, targetRPEInput);
        }
    });

    document.addEventListener("change", e => {
        const target = e.target as HTMLInputElement;;

        if (target && target.classList.contains("actualRPE")) {
            const rpeInput = target
            let rpe = target.value;

            if (rpe === "") {
                rpeInput.value = "";
                return;
            }

            rpe = rpe.replace(/,/g, "."); //replace commas with dots
            let numbers = rpe.split(";").map(Number);

            if (numbers.length === 1 && !isNaN(numbers[0])) { //rpe is valid (number) and inputted without further values separated by ;
                validateRPE(numbers[0], rpeInput);

                // finde das zugehörige planedRPE und workoutNotes element
                const parentRow = rpeInput.closest("tr")!;
                const planedRPE = parentRow.querySelector(".targetRPE")! as HTMLInputElement;
                const workoutNotes = parentRow.querySelector(".workout-notes") as HTMLInputElement;;

                const rpeDiff = parseFloat(planedRPE.value) - numbers[0];
                updateWorkoutNotes(workoutNotes, rpeDiff);
                return;
            }

            if (numbers.some(isNaN)) { //if one of the values is not a number
                rpeInput.value = "";
                return;
            }

            const parentRow = rpeInput.closest("tr")!;
            const setInputs = parentRow.querySelector(".sets") as HTMLInputElement;

            if (numbers.length == parseInt(setInputs.value)) {
                const sum = numbers.reduce((acc, num) => acc + num, 0);
                const average = sum / numbers.length;

                const roundedAverage = Math.ceil(average / 0.5) * 0.5;
                const planedRPE = parentRow.querySelector(".targetRPE") as HTMLInputElement;
                const workoutNotes = parentRow.querySelector(".workout-notes") as HTMLInputElement;

                const rpeDiff = parseFloat(planedRPE.value) - roundedAverage;
                updateWorkoutNotes(workoutNotes, rpeDiff);
                validateRPE(roundedAverage, rpeInput);
            }
        }
    });
}