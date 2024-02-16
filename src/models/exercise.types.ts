import { Document } from "mongoose";

export interface ExerciseCategory {
  name: string;
  pauseTime: number;
  defaultSets: number;
  defaultReps: number;
  defaultRPE: number;
}

export interface Exercise {
  name: string;
  maxFactor?: number;
  category: ExerciseCategory;
}

interface ExerciseDocument extends Exercise, Document {}

export default ExerciseDocument;
