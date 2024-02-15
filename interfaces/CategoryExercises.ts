import { ExerciseInterface } from "../src/models/trainingDay.types.js";

export interface CategoryExercises {
    [category: string]: ExerciseInterface[];
  }