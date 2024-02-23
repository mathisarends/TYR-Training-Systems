export class CardModule {
    private static instance: CardModule;
    private trainingCards: NodeListOf<Element>;
    private lastSelectedPlanIndex: number;
  
    private constructor(cardname : string) {
      this.trainingCards = document.querySelectorAll(cardname);
      this.lastSelectedPlanIndex = -1;
  
      this.trainingCards.forEach((card, index) => {
        card.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // if the card is clicked again proceed to page
          if (this.lastSelectedPlanIndex === index) {
            this.proceedToTrainingPage(index);
          } else {
            this.handlePreSelect(card);
          }

          this.lastSelectedPlanIndex = index;

        });
      });
  
      const contentBody = document.getElementById("contentBody");
      contentBody?.addEventListener("click", (e) => {
        e.preventDefault();
        this.deSelectAllCards();
      });
    }

    private proceedToTrainingPage(index : number) {
        const selectedCard = this.trainingCards[index];
        const href = selectedCard.getAttribute("href");
      
        if (href) {
          // Hier kannst du zur neuen Seite navigieren
          window.location.href = href;
        } else {
            console.error("Das betreffene Element hat kein href tag!");
        }
    }
  
    private handlePreSelect(card: Element) {
      this.trainingCards.forEach((currentCard) => {
        if (card !== currentCard) {
          currentCard.classList.remove("active");
        } else {
          currentCard.classList.add("active");
          this.showMoreOptionsContainer();
        }
      });
    }
  
    private deSelectAllCards() {
      this.trainingCards.forEach((currentCard) => {
        currentCard.classList.remove("active");
      });
  
      this.showRegularCreateButton();
    }
  
    private showMoreOptionsContainer() {
      this.toggleVisibility("optionsButtonContainer", true);
      this.toggleVisibility("showCreatePlanModal", false);
    }
  
    private showRegularCreateButton() {
      this.toggleVisibility("optionsButtonContainer", false);
      this.toggleVisibility("showCreatePlanModal", true);
    }
  
    private toggleVisibility(elementId: string, show: boolean) {
      const element = document.getElementById(elementId);
  
      if (element) {
        if (show) {
          element.classList.remove("d-none");
          element.classList.add("d-flex");
        } else {
          element.classList.remove("d-flex");
          element.classList.add("d-none");
        }
      }
    }
  
    getLastSelectedPlanIndex() {
      return this.lastSelectedPlanIndex;
    }
  
    static getInstance(cardname : string): CardModule {
      if (!CardModule.instance) {
        CardModule.instance = new CardModule(cardname);
      }
  
      return CardModule.instance;
    }
  }


