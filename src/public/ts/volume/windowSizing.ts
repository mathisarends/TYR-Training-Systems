// adjust class styling from bootstrap depending on window size

const resultAdjustElement = document.querySelector(
    ".result-adjust"
) as HTMLInputElement;

export function checkWindowSize() {

    if (window.innerWidth <= 768) {
        resultAdjustElement.classList.remove("text-center");
    } else {
        resultAdjustElement.classList.add("text-center");
    }
}
