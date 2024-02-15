import { Document } from "mongoose";

interface Category {
  name: string;
  pauseTime: number;
  defaultSets: number;
  defaultReps: number;
  defaultRPE: number;
}

export interface Exercise {
  name: string;
  maxFactor?: number;
  category: Category;
}

interface ExerciseDocument extends Exercise, Document {}

export default ExerciseDocument;
