import { showErrorMessage } from "./showErrorMessage.js";
import { ApiData } from "../../../../interfaces/ApiData.js";
  

export async function loginFetch(formData: ApiData) {

    const failureFlashElement = document.querySelector(
        ".login-card-description",
      )!;

    try {
        const response = await fetch(window.location.pathname, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Erfolgreiche Anmeldung
          window.location.href = "/"; // Redirect nach erfolgreicher Anmeldung
        } else {
          // Fehler während der Anmeldung
          showErrorMessage(failureFlashElement, data.message.toString());
        }
      } catch (error) {
        console.error("Fehler während der Anmeldung:", error);
        showErrorMessage(failureFlashElement, "Fehler während der Anmeldung");
      }
}