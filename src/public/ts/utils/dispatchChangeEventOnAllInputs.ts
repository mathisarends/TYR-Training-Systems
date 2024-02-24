/**
 * Dispatches a 'change' event on all input and select elements in the document.
 */
export function dispatchChangeEventOnAllInputs() {
    try {
        // Select all input and select elements in the document
        const allInputsAndSelects = document.querySelectorAll('input, select');

        // Dispatch 'change' event for each element
        allInputsAndSelects.forEach(element => {
            const event = new Event('change', {
                bubbles: true,
                cancelable: true,
            });

            element.dispatchEvent(event);
        });

        console.log('Change events dispatched on all input and select elements.');
    } catch (error) {
        console.error('Error dispatching change events:', error);
    }
}