export function initializeEstMaxCalculation() {
        const form = document.querySelector("form")!;

        form.addEventListener("change", e => {
            const target = e.target as HTMLInputElement;

            if (target && (target.classList.contains("weight") || target.classList.contains("actualRPE") || target.classList.contains("reps"))) {
                const parentRow = target.closest("tr")!;
                const category = (parentRow.querySelector(".exercise-category-selector") as HTMLInputElement).value;

                if (category === "Squat" || category === "Bench" || category === "Deadlift") {
                    const weight = parseFloat((parentRow.querySelector(".weight") as HTMLInputElement).value);
                    const reps = parseInt((parentRow.querySelector(".reps") as HTMLInputElement).value);
                    const rpe = parseFloat((parentRow.querySelector(".actualRPE") as HTMLInputElement).value);
                    const workoutNotes = parentRow.querySelector(".workout-notes") as HTMLInputElement;

                    if (weight && reps && rpe) {
                        const estMax = calcEstMax(weight, reps, rpe, workoutNotes, category);
                        const estMaxInput = parentRow.querySelector(".estMax") as HTMLInputElement;
                        estMaxInput.value = estMax.toString();

                        const nextRow = parentRow.nextElementSibling!;

                        const exercise = (parentRow.querySelector('.exercise-name-selector:not([style*="display: none"])') as HTMLInputElement).value;
                        const nextExercise = (nextRow.querySelector('.exercise-name-selector:not([style*="display: none"])') as HTMLInputElement).value;
                        const nextWeightInputValue = (nextRow.querySelector(".weight") as HTMLInputElement).value;

                        if (nextRow && (exercise === nextExercise) && estMax && !nextWeightInputValue) {
                            const nextRowReps = parseInt((nextRow.querySelector(".reps") as HTMLInputElement).value);
                            const nextRowRPE = parseFloat((nextRow.querySelector(".targetRPE") as HTMLInputElement).value);

                            if (nextRowReps && nextRowRPE) {
                                const backoffWeight = calcBackoff(nextRowReps, nextRowRPE, estMax);
                                const nextRowWeightInput = nextRow.querySelector(".weight") as HTMLInputElement;
                                nextRowWeightInput.placeholder = backoffWeight.toString();
                            }
                        }
                    }
                }
            }
        });

        function calcBackoff(planedReps: number, planedRPE: number, topSetMax: number): string {
            const totalReps = planedReps + (10 - planedRPE);
            let percentage = (0.484472 * totalReps * totalReps - 33.891 * totalReps + 1023.67) * 0.001;

            let backoffWeight = topSetMax * percentage;
            backoffWeight = Math.ceil(backoffWeight / 2.5) * 2.5;

            const lowEndBackoffweight = backoffWeight - 2.5;
            const highEndBackoffweight = backoffWeight + 2.5;

            const backoffString: string = lowEndBackoffweight + " - " + highEndBackoffweight;
            return backoffString;
        }

        function calcEstMax(weight: number, reps: number, rpe: number, workoutNotes: HTMLInputElement, category: string): number {
            const actualReps = reps + (10 - rpe);
            const unroundedValue = weight * (1 + 0.0333 * actualReps);

            const roundedValue = Math.ceil(unroundedValue / 2.5) * 2.5;
            const allTimeBestEstMax = getMaxByCategory(category);

            if (roundedValue - allTimeBestEstMax > 5) {
                if (!workoutNotes.value.includes("uptrend")) {
                    workoutNotes.value = "uptrend " + workoutNotes.value;
                }
            }
            return roundedValue;
        }

        function getMaxByCategory(category: string): number {
            if (category === "Squat") {
                return parseInt((document.getElementById("userMaxSquat") as HTMLInputElement).value);
            } else if (category === "Bench") {
                return parseInt((document.getElementById("userMaxBench") as HTMLInputElement).value);
            } else {
                return parseInt((document.getElementById("userMaxDeadlift") as HTMLInputElement).value);
            }
        }
}