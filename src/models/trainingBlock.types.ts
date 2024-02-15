import { TrainingDayInterface } from "./trainingDay.types.js"

interface TrainingWeekInterface {
    trainingDays: TrainingDayInterface[],
    squatSetsDone: Number,
    squatTonnage: Number,
    benchSetsDone: Number,
    benchTonnage: Number,
    deadliftSetsDone: Number,
    deadliftTonnage: Number,
    parentTrainingPlan: string // reicht das?
}

export interface TrainingBlockInterface {
    title: string, 
    isTemplate: boolean,
    trainingFrequency: number,
    trainingPhase: "hypertrophie" | "kraft",
    lastUpdated: Date,
    automaticProgression: boolean,
    lastWeekDeloadEnabled: boolean,
    weightRecommandationBase: "max" | "lastWeek" | "off",
    trainingWeeks: TrainingWeekInterface[]
}