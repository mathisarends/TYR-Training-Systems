// swipeHandler.ts
console.log("hallo aus swipeHandler");

let touchStartX: number | null;
const swipeThreshold = 7.5;

export function addSwipeHandlers(elementId: string, onSwipeLeft: () => void, onSwipeRight: () => void): void {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found.`);
        return;
    }

    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);

    function handleTouchStart(event: TouchEvent) {
        touchStartX = event.touches[0].clientX;
    }

    function handleTouchMove(event: TouchEvent) {
        if (!touchStartX) return;

        const touchEndX = event.touches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (deltaX > swipeThreshold) {
            onSwipeRight();
        } else if (deltaX < -swipeThreshold) {
            onSwipeLeft();
        }

        touchStartX = null;
    }

        // Hier wird der Kontext explizit festgelegt
        onSwipeLeft = onSwipeLeft.bind(null);
        onSwipeRight = onSwipeRight.bind(null);
}