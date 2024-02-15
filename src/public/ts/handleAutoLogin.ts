import { prepareRequestData } from "./utils/prepareRequestData.js";
import { loginFetch } from "./utils/loginFetch.js";

async function autoLogin() {
    const form = document.querySelector("form")!;
    const formData = prepareRequestData(form);

    console.log(!formData.username && !formData.passowrd);

    if (!formData.username && !formData.passowrd) {
        formData.username = "y";
        formData.password = "y";
    }

    console.log(formData);

    loginFetch(formData);

}

const autoLogonBTN = document.getElementById("login-test")!;

autoLogonBTN.addEventListener("click", e => {
    e.preventDefault();
    autoLogin();
})

document.addEventListener("DOMContentLoaded", () => {

    if (autoLogonBTN) {
        autoLogin();
    }
    
})
