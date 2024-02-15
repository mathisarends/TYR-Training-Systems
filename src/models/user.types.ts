import { TrainingBlockInterface } from "./trainingBlock.types.js"
import { TrainingSessionInterface } from "./trainingSession.types.js"
import { ExerciseInterface } from "./trainingDay.types.js"


export interface UserInterface {
    name: string,
    createdAt: Date,
    email: string,
    googleId: string,
    passwordHash: string,
    templatePlans: TrainingBlockInterface[],
    customPlans: TrainingBlockInterface[],
    trainingSessions: TrainingSessionInterface[],
    exercises: ExerciseInterface[],
    save: () => void,
}