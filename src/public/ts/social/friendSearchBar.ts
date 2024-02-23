export class SearchBar {

    friendSearchBar: HTMLInputElement;

    constructor() {
        this.friendSearchBar = document.querySelector("#friendSearchBar")!;
        this.initializeSearchBarFilter();
    }

    initializeSearchBarFilter() {

        console.log("init");
        const allCards = document.querySelectorAll(".col");
        const allUserNames = document.querySelectorAll(".card-title");

        this.friendSearchBar.addEventListener("input", () => {
            const currentSearch = this.friendSearchBar.value.toLowerCase();
    
            allCards.forEach((card, index) => {
                const userName = allUserNames[index].textContent?.toLowerCase() || "";
                const isMatch = userName.includes(currentSearch);
    
                card.classList.toggle("d-none", !isMatch);
            });
        })
    }
}