import { TrainingDayInterface } from "./trainingDay.types"

export interface TrainingSessionInterface {
    title: string, 
    lastUpdated: Date,
    trainingPhase: string,
    date: Date,
    trainings: TrainingDayInterface[]
}