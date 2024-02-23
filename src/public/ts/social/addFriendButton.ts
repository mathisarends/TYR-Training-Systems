export class AddFriendButton {
    private static instance: AddFriendButton;
    private addFriendButton : HTMLButtonElement;


    private constructor() {
        this.addFriendButton = document.getElementById("add-friend-button") as HTMLButtonElement;
    }

    getAddFriendButton() {
        return this.addFriendButton;
    }

    static getInstance() {
        if (!AddFriendButton.instance) {
            AddFriendButton.instance = new AddFriendButton();
        }
        return AddFriendButton.instance;
    }

}