export class FriendCardModule {
    private static instance: FriendCardModule;
    private friendCards: NodeListOf<Element>;
    private lastSelectedFriendIndex: number;
    private addFriendButton : HTMLButtonElement;
    private lastSelectedFriendId : string;


    private constructor() {
        this.friendCards = document.querySelectorAll(".col");
        this.lastSelectedFriendIndex = -1;
        this.addFriendButton = document.getElementById("add-friend-button") as HTMLButtonElement;
        this.lastSelectedFriendId = "";

        this.friendCards.forEach((friendCard, index) => {
            friendCard.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();

                // if the card is clicked again proceed to page
                this.lastSelectedFriendIndex = index;
                this.handlePreSelect(friendCard);
                this.showAddFriendButton();



            })
        })

        this.addFriendButton.addEventListener("click", async (e) => {
            e.preventDefault();
            this.handleAddFriendButtonClick();
        })

        const contentBody = document.getElementById("contentBody");
        contentBody?.addEventListener("click", (e) => {
            e.preventDefault();
            this.deSelectAllCards();
        });
    }

    handlePreSelect(card: Element) {
        this.friendCards.forEach((currentCard) => {
            if (card !== currentCard) {
                currentCard.classList.remove("active");
            } else {
                currentCard.classList.add("active");
            }
        });
    }

    private deSelectAllCards() {
        this.friendCards.forEach((currentCard) => {
            currentCard.classList.remove("active");
        });

        this.toggleAddFriendButton();
    }

    private showAddFriendButton() {
        if (this.addFriendButton.classList.contains("visibility-hidden")) {
            this.addFriendButton.classList.remove("visibility-hidden")
        }
    }

    private toggleAddFriendButton() {
        this.addFriendButton.classList.toggle("visibility-hidden");
    }



    getlastSelectedFriendIndex() {
        return this.lastSelectedFriendIndex;
    }

    static getInstance() {
        if (!FriendCardModule.instance) {
            FriendCardModule.instance = new FriendCardModule();
        }
        return FriendCardModule.instance;
    }

    async handleAddFriendButtonClick() {
        try {
            const response = await fetch(`/social/getUserId/${this.lastSelectedFriendIndex}`);
            if (response.ok) {
                this.lastSelectedFriendId = await response.json();
                console.log("this.lastSelectedFriendId", this.lastSelectedFriendId);
            } else {
                console.error("Failed to fetch user ID:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error while handling add friend button click:", error);
        }
    }

    async makeFriendRequest(friendId : string) {
        
    }

}