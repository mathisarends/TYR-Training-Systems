// createTrainingPlanModule.js

import { validateInput } from '../utils/validateInput.js';
import { sendChangedData } from '../utils/exercisePatchModule.js';

import { ApiData } from '../../../../interfaces/ApiData.js';

export class CreateTrainingPlanModule {
  constructor(private changedData: ApiData) {
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

  setData(newData : ApiData) {
    this.changedData = newData;
  }

  sendData(url : string) {
    sendChangedData(url, 'POST', this.changedData);
  }
}