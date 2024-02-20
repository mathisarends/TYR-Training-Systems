// indexForCategory.js

import { getIndexByCategory } from "./indexForCategory.js";

export function handleExerciseSelectors() {
  const displayedSelectors = document.querySelectorAll('.exercise-name-selector:not([style*="display: none"])') as NodeListOf<HTMLInputElement>;

  //remove placeholder values
  for (let i = 0; i < displayedSelectors.length; i++) {
    if (displayedSelectors[i].value === "Placeholder") {
      displayedSelectors[i].style.display = "none";
    }
  }

  document.addEventListener("change", (e) => {
    const target = e.target as HTMLElement;

    // Überprüfe, ob das ausgelöste Event von einem exercise-category-selector stammt
    if (target && target.classList.contains("exercise-category-selector")) {
      const category = (target as HTMLSelectElement).value;

      // Finde die übergeordnete Zeile (tr) des exercise-category-selectors
      const tableRow = target.closest("tr");

      if (tableRow) {
        // Suche alle exercise-name-selector in dieser Zeile
        const exerciseNameSelectors = tableRow.querySelectorAll(".exercise-name-selector");

        if (category === "- Bitte Auswählen -") {
          exerciseNameSelectors.forEach((selector: any) => {
            selector.style.display = "none";
            selector.disabled = false; // Zurücksetzen der deaktivierten Attribute
          });
        } else {
          exerciseNameSelectors.forEach((selector: any, index: number) => {
            selector.style.display = index === getIndexByCategory(category) ? "block" : "none";
            selector.style.opacity = index === getIndexByCategory(category) ? "1" : "0";
            selector.disabled = index !== getIndexByCategory(category);
          });
        }
      }
    }
  });
}