// deleteTrainingPlanModule.ts
import { CardModule } from "./CardModule.js";


export function initializeDeleteTrainingPlanModule() {
  const deletePlanButton = document.getElementById("delete-plan-button");

  deletePlanButton?.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/training/delete/${CardModule.getInstance(".training-card").getLastSelectedPlanIndex()}`, {
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
}