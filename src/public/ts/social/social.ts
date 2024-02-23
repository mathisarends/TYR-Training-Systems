import { SearchBar } from "./friendSearchBar.js";
import { FriendCardModule } from "./friendCardModule.js";

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = new SearchBar();

    FriendCardModule.getInstance();
})
