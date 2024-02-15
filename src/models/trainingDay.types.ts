export interface ExerciseInterface {
    category: string,
    exercise: string,
    sets: number,
    reps: number,
    weight: string,
    targetRPE: number,
    actualRPE: number,
    estMax: number,
    notes: string,
}

export interface TrainingDayInterface {
    exercises: ExerciseInterface[];
}

