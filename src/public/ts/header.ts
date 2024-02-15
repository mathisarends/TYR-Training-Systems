document.addEventListener("DOMContentLoaded", () => {
  const showSideBarBtn = document.getElementById("show-sidebar")!;
  const hideSideBarBtn = document.getElementById("hide-sidebar")!;

  // logo shall navigate back to main page
  const logoLink = document.getElementById("logo-link");

  logoLink?.addEventListener("click", () => {
    window.location.href = "/";
  });

  let buttonCount = 0;

  function showSideBar() {
    switchButtonView();
    const sidebar: HTMLElement = document.querySelector(".sidebar")!;
    sidebar.style.display = "flex";
    buttonCount++;
  }

  function hideSideBar() {
    switchButtonView();
    const sidebar: HTMLElement = document.querySelector(".sidebar")!;
    sidebar.style.display = "none";
    buttonCount++;
  }

  function switchButtonView() {
    if (buttonCount === 0) {
      showSideBarBtn.style.display = "none";
      hideSideBarBtn.style.display = "block";
      return;
    }

    const showStyle = getComputedStyle(showSideBarBtn);
    if (showStyle.display === "block" || showStyle.display === "") {
      showSideBarBtn.style.display = "none";
      hideSideBarBtn.style.display = "block";
    } else {
      showSideBarBtn.style.display = "block";
      hideSideBarBtn.style.display = "none";
    }
  }

  showSideBarBtn.addEventListener("click", showSideBar);
  hideSideBarBtn.addEventListener("click", hideSideBar);
});
