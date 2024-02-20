// hidePlaceholderCategory.js

export function handlePlaceholderCategory() {
    const exerciseCategorySelectors = document.querySelectorAll(".exercise-category-selector") as NodeListOf<HTMLSelectElement>;
  
    // Entferne alle Placeholder-Kategorien zu Beginn
    exerciseCategorySelectors.forEach((categorySelector) => {
      const category = categorySelector.value;
      if (category === "- Bitte Auswählen -") {
        categorySelector.style.opacity = "0";
      }
    });
  
    document.addEventListener("mousedown", e => {
      const target = e.target as HTMLSelectElement;
  
      if (target && target.classList.contains("exercise-category-selector")) {
        if (target.value === "- Bitte Auswählen -") {
          target.style.opacity = "0";
        }
      }
    });
  
    document.addEventListener("change", e => {
      const target = e.target as HTMLSelectElement;
  
      if (target && target.classList.contains("exercise-category-selector")) {
        if (target.value !== "- Bitte Auswählen -") {
          target.style.opacity = "1";
        } else {
          target.style.opacity = "0";
        }
      }
    });
  }