// createTrainingPlanModule.js

import { validateInput } from '../utils/validateInput.js';

import { ExercisePatchHandler } from '../utils/exercisePatchModule.js';

export class CreateTrainingPlanModule {
  constructor() {
    this.initializeCreateTrainingPlanModule();
  }

  initializeCreateTrainingPlanModule() {
    const form = document.querySelector('form');
    const createTrainingPlanBTN = document.getElementById('create-training-plan-btn');

    createTrainingPlanBTN?.addEventListener('click', (e) => {
      e.preventDefault();
      form?.dispatchEvent(new Event('submit'));
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validateInput(form)) {
        // prevent default behavior and send only changed data
        this.sendData('training/create');
      } else {
        const modalTitle = document.getElementById('exampleModalLabel')!;
        modalTitle.textContent = 'Bitte alles ausfüllen!';

        setTimeout(() => (modalTitle.textContent = 'Plan erstellen'), 5000);
      }
    });
  }

  sendData(url : string) {
    const exercisePatchHandler = ExercisePatchHandler.getInstance();
    exercisePatchHandler.sendChangedData(url, 'POST');
  }
}