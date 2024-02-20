export function getIndexByCategory(category: string): number {
    // Diese Funktion ordnet Kategorien ihren entsprechenden Indizes in exerciseNameSelectors zu
    const categoryMap: Record<string, number> = {
        "Squat": 1,
        "Bench": 2,
        "Deadlift": 3,
        "Overheadpress": 4,
        "Chest": 5,
        "Back": 6,
        "Shoulder": 7,
        "Triceps": 8,
        "Biceps": 9,
        "Legs": 10
    };

    return categoryMap[category] || -1; // Return -1 für Kategorien, die keinem Index zugeordnet sind
}