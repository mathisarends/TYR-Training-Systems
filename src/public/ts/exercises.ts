console.log("Hello im here");

function handleExerciseResetButtonClick() {
  // AJAX-Anfrage
  fetch("/exercises/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.href = "/exercises";
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// reseting exercises
const resetBtn = document.getElementById("reset-btn")!;

resetBtn.addEventListener("click", e => {
    e.preventDefault();
    handleExerciseResetButtonClick();
})
