import { prepareRequestData } from "./utils/prepareRequestData.js";
import { loginFetch } from "./utils/loginFetch.js";
import { showErrorMessage } from "./utils/showErrorMessage.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("test");

  async function login() {
    const form = document.querySelector("form")!;
    const formData = prepareRequestData(form);

    loginFetch(formData);
  }

  const submitBtn = document.getElementById("login");

  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    login();
  });
});