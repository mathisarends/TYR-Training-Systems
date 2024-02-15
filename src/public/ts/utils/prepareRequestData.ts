import { ApiData } from "../../../../interfaces/ApiData.js";

export function prepareRequestData(form: HTMLFormElement): ApiData {
  const inputs = form.querySelectorAll("input");
  const selects = form.querySelectorAll("select");

  const formData: ApiData = {};

  inputs.forEach((input: HTMLInputElement) => {
    formData[input.name] = input.value;
  });

  selects.forEach((select: HTMLSelectElement) => {
    if (select.selectedIndex >= 0) {
      const selectedOptionValue =
        select.selectedOptions[select.selectedIndex].value;
      formData[select.name] = selectedOptionValue;
    }
  });

  return formData;
}
