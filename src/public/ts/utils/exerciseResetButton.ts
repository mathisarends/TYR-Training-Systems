export function handleExerciseResetButtonClick() {
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
