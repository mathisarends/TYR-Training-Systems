import { ApiData } from "../../../../interfaces/ApiData.js";

export function initializeExercisePatch(callback: (data: ApiData) => void) {
  const changedData: ApiData = {};

  document
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>("input:not([disabled]), select:not([disabled])")
    .forEach((input) => {
      input.addEventListener("change", () => {
        changedData[input.name] = input.value;
        console.log(
          `Feld ${input.name} wurde geändert. Neuer Wert: ${input.value}`
        );

        // Rufe die callback-Funktion auf und übergebe das aktualisierte changedData
        callback(changedData);
      });
    });
}

export function sendChangedData(
  fetchUrl: string,
  method: string,
  data: ApiData
) {
  fetch(fetchUrl, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Hier möchte ich auch lieber mit einem modal arbeiten, statt die seite neu zu laden 
      $('.modal').modal('show');

      setTimeout(() => $('.modal').modal('hide'), 3000);

      //window.location.href = fetchUrl; // refresh page
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}
