import { ApiData } from "../../../../interfaces/ApiData.js";

export class ExercisePatchHandler {
  private static instance: ExercisePatchHandler;
  private changedData: ApiData = {};

  private constructor() {
    this.initialize();
  }

  public static getInstance(): ExercisePatchHandler {
    if (!ExercisePatchHandler.instance) {
      ExercisePatchHandler.instance = new ExercisePatchHandler();
    }
    return ExercisePatchHandler.instance;
  }

  initialize(): void {
    const form = document.querySelector("form");
  
    if (form) {
      form.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
  
        // Überprüfe, ob das auslösende Element ein "input" oder "select" ist und nicht disabled
        if (target.matches("input:not([disabled]), select:not([disabled])")) {
          this.handleInputChange(target);
        }
      });
    } else {
      console.error("Das übergeordnete Element wurde nicht gefunden.");
    }
  }
  
  public handleInputChange(inputElement: HTMLInputElement | HTMLSelectElement): void {
    this.changedData[inputElement.name] = inputElement.value;
  
    console.log(this.changedData);
  }

  public sendChangedData(fetchUrl: string, method: string): void {
    fetch(fetchUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.changedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (fetchUrl === "training/create") {
          window.location.href = "/training";
        } else { // Normallfall
          this.clearChangedData();
          //@ts-ignore
          $('.modal').modal('show');

          //@ts-ignore
          setTimeout(() => $('.modal').modal('hide'), 3000);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  public getChangedData(): ApiData {
    return this.changedData;
  }

  private clearChangedData() : void {
    this.changedData = {};
  }
}