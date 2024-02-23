/**
 * Überprüft alle Input- und Select-Elemente in einem Formular auf das 'required'-Attribut.
 * @param {HTMLFormElement} form - Das Formular, das überprüft werden soll.
 * @returns {boolean} - Gibt 'true' zurück, wenn alle erforderlichen Felder ausgefüllt sind, andernfalls 'false'.
 */
export function validateInput(form: HTMLFormElement): boolean {
    // Alle Input- und Select-Elemente mit dem 'required'-Attribut auswählen
    const requiredElements = form.querySelectorAll('input[required], select[required]');

    // Überprüfen, ob alle erforderlichen Felder ausgefüllt sind
    for (const element of Array.from(requiredElements)) {
        if (element instanceof HTMLInputElement) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                if (!element.checked) {
                    return false;
                }
            } else if (!element.value.trim()) {
                return false;
            }
        } else if (element instanceof HTMLSelectElement) {
            if (!element.value.trim()) {
                return false;
            }
        }
    }

    // Alle erforderlichen Felder sind ausgefüllt
    return true;

}