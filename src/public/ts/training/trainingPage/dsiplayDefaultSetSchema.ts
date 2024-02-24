import { ExerciseCategories } from "../../../../../interfaces/ExerciseCategoriesEnum.js";

export function handleDefaultValuesByCategory() {
    const defaultSetsByCategory = document.querySelectorAll(".category-default-sets-input") as NodeListOf<HTMLInputElement>;
    const defaultRepsByCategory = document.querySelectorAll(".category-default-reps-input") as NodeListOf<HTMLInputElement>;
    const defaultRPEByCategory = document.querySelectorAll(".category-default-rpe-input") as NodeListOf<HTMLInputElement>;
  
    const exerciseCategories = [
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
  
    function getDefaultSetsByExerciseCategory(category: string) {
      const index = exerciseCategories.indexOf(category);
      return index !== -1 ? defaultSetsByCategory[index].value : "";
    }
  
    function getDefaultRepsByExerciseCategory(category: string) {
      const index = exerciseCategories.indexOf(category);
      return index !== -1 ? defaultRepsByCategory[index].value : "";
    }
  
    function getDefaultRPEByExerciseCategory(category: string) {
      const index = exerciseCategories.indexOf(category);
      return index !== -1 ? defaultRPEByCategory[index].value : "";
    }
  
    document.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
  
      // Überprüfe, ob das ausgelöste Event von einem .exercise-category-selector stammt
      if (target && target.classList.contains("exercise-category-selector")) {
        const category = target.value;
  
        // Finde das Elternelement (z.B. die Zeile), das die .exercise-category-selector enthält
        const parentRow = target.closest("tr");
  
        if (parentRow) {
          // Finde die entsprechenden Elemente in derselben Zeile und aktualisiere sie
          const setsInput = parentRow.querySelector(".sets") as HTMLInputElement;
          const repsInput = parentRow.querySelector(".reps") as HTMLInputElement;
          const targetRPEInput = parentRow.querySelector(".targetRPE") as HTMLInputElement;
  
          if (category !== "- Bitte Auswählen -") {
            setsInput.value = getDefaultSetsByExerciseCategory(category);
            repsInput.value = getDefaultRepsByExerciseCategory(category);
            targetRPEInput.value = getDefaultRPEByExerciseCategory(category);
          } else {
            setsInput.value = "";
            repsInput.value = "";
            targetRPEInput.value = "";
          }
        }
      }
    });
  }