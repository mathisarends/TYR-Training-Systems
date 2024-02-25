import { addSwipeHandlers } from "../../utils/swipeHandler.js";

export class SwitchDayView {

    trainingTables : NodeListOf<HTMLTableElement>;
    pageLinks : NodeListOf<HTMLDataListElement>;

    constructor() {
        this.trainingTables = document.querySelectorAll(".training-table") as NodeListOf<HTMLTableElement>;
        this.pageLinks = document.querySelectorAll(".page-item:not(:last-child)") as NodeListOf<HTMLDataListElement>;

        this.pageLinks.forEach((pageLink, index) => {
            pageLink.addEventListener("click", (e) => this.handlePageLinkClick(e, index));
        });

        addSwipeHandlers("contentBody", this.navigateToNextDay, this.navigateToPreviousDay);
        
    }

    private handlePageLinkClick(event: Event, index: number): void {
        event.preventDefault();
    
        this.trainingTables.forEach((trainingTable) => {
            trainingTable.setAttribute("hidden", "true");
        });
    
        this.pageLinks.forEach((pageLink) => {
            if (pageLink !== this.pageLinks[index] && (!pageLink.classList.contains("disabled"))) {
                pageLink.classList.add("disabled");
            } else if (pageLink === this.pageLinks[index] && pageLink.classList.contains("disabled")) {
                pageLink.classList.remove("disabled");
            }
        });
    
        this.trainingTables[index].removeAttribute("hidden");
        window.scrollTo(0, 0); // jump to start of the page
    }

    navigateToNextDay(): void {
        const selectedPage = document.querySelector(".page-item:not(.disabled)")!;
        const pageItems = document.querySelectorAll(".page-item:not(:last-child)") as NodeListOf<HTMLDataListElement>;

        let nextButton = selectedPage.nextElementSibling;
        if (nextButton?.classList.contains("placeholder")) {
            nextButton = pageItems[0];
        }

        if (nextButton) nextButton.dispatchEvent(new Event("click"));
    }

    navigateToPreviousDay(): void {
        const selectedPage = document.querySelector(".page-item:not(.disabled)")!;
        const pageItems = document.querySelectorAll(".page-item:not(:last-child)") as NodeListOf<HTMLDataListElement>;
        let previousButton = selectedPage.previousElementSibling;

        if (previousButton?.classList.contains("placeholder")) previousButton = pageItems[pageItems.length - 1];

        if (previousButton) previousButton.dispatchEvent(new Event("click"));
    }
}



//TODO hier weitermachen, Tables richtig anzeigen
// backend routen zum patchen